const express = require('express');
const router = express.Router();
const Book = require("models/Book");
const { transformRegex } = require("lib/Regex");

// Reduce repetitive code by batch-creating similar routes
function createFilterRoutes(path, _get=() => Book.find({})) {
    async function get(req, res) {
        const {
            l = 10,
            limit = l,

            p = 0,
            pg = p,
            page = pg,

            s = "null",
            sort = s
        } = req.query;

        let result = _get(req, res);
        const count = await result.clone().countDocuments();
        const maxPage = Math.ceil(count / parseInt(limit));

        if (parseInt(page) >= maxPage || parseInt(page) < 0) return res.status(404).json({message: "Page out of bounds"});

        const startIndex = parseInt(page) * parseInt(limit);
        const endIndex = Math.min(startIndex + parseInt(limit), count);

        if (s !== "null") result = result.sort({ [sort]: 1 });
        if (limit !== "null") result = result.limit(parseInt(limit)).skip(startIndex);
        
        return {query: result, page: parseInt(page), maxPage, limit: parseInt(limit), sort, count, startIndex, endIndex};
    }

    router.get(`/${path}`, async (req, res) => {
        const {query, page, count, startIndex, endIndex, maxPage} = await get(req, res);
        if (res.headersSent) return;

        query.then((books) => {
            res.json({
                books,
                page,
                count,
                startIndex,
                endIndex,
                maxPage
            });
        }).catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
    });

    router.get(`/${path}/props/:fields`, async (req, res) => {
        const {query, page, count, startIndex, endIndex, maxPage} = await get(req, res);
        if (res.headersSent) return;

        const fields = {};
        req.params.fields.split(',').forEach((field) => {
            if (res.headersSent) return;

            field = field.trim();
            let negate = false;
            if (field.startsWith('-')) {
                field = field.substring(1);
                negate = true;
            }

            if (field === 'id') field = '_id';
            if (!Book.pathExists(field) && !res.headersSent) return res.status(400).json({message: `Invalid property: ${field}`});
            fields[field] = negate ? 0 : 1;
        });
        if (res.headersSent) return;

        if (!fields._id) fields._id = 0;
        if (fields.id) {
            fields._id = 1;
            delete fields.id;
        }
        
        query.select(fields).then((books) => {
            res.json({
                books,
                page,
                count,
                startIndex,
                endIndex,
                maxPage
            });
        }).catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
    });
}

createFilterRoutes('all');
createFilterRoutes('by-:prop/:val', (req, res) => {
    let {prop, val} = req.params;

    // Simple trick to add aliases to query parameters. The one at the bottom is the one you should use in your code.
    const {
        i = "true",
        ci = i,
        case_insensitive = ci,

        m = "false",
        mw = m,
        match_whole = mw,

        a = "true",
        ai = a,
        accent_insensitive = ai
    } = req.query;

    if (prop === 'id') prop = '_id';
    if (!Book.pathExists(prop)) return res.status(400).json({message: `Invalid property: ${prop}`});
    
    let result;
    if (Book.pathType(prop) === "String") {
        result = Book.find({
            [prop]: transformRegex(val, {
                caseInsensitive: case_insensitive === "true",
                matchWhole: match_whole === "true",
                accentInsensitive: accent_insensitive === "true"
            })
        });
    } else if (Book.pathType(prop) === "Number") {
        if (val.startsWith(">=")) {
            val = val.substring(2);
            
            if (isNaN(val)) return res.status(400).json({message: `Invalid Number: ${val}`});
            result = Book.find({ [prop]: { $gte: val } });
        } else if (val.startsWith("<=")) {
            val = val.substring(2);

            if (isNaN(val)) return res.status(400).json({message: `Invalid Number: ${val}`});
            result = Book.find({ [prop]: { $lte: val } });
        } else if (val.startsWith('>')) {
            val = val.substring(1);

            if (isNaN(val)) return res.status(400).json({message: `Invalid Number: ${val}`});
            result = Book.find({ [prop]: { $gt: val } });
        } else if (val.startsWith('<')) {
            val = val.substring(1);

            if (isNaN(val)) return res.status(400).json({message: `Invalid Number: ${val}`});
            result = Book.find({ [prop]: { $lt: val } });
        } else if (val.startsWith("in_")) {
            const [min, max] = val.substring(3).split(':');

            if (isNaN(min)) return res.status(400).json({message: `Invalid Min Number: ${min}`});
            if (isNaN(max)) return res.status(400).json({message: `Invalid Max Number: ${max}`});
            result = Book.find({ [prop]: { $gte: min, $lte: max } });
        } else if (val.startsWith("nin_")) {
            const [min, max] = val.substring(4).split(':');
            result = Book.find({$or: [{[prop]: {$lt: min}}, {[prop]: {$gt: max}}]});
        } else {
            result = Book.find({ [prop]: val });
        }
    }

    return result;
});

//get all distince categories
router.get('/categories', (req, res) => {
    Book.distinct('categories')
        .then(categories => {
            res.json(categories);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

//get all books of one category
router.get('/categories/:category', async (req, res) => {
    const category = req.params.category;
    const regExpression = new RegExp(category, 'i')
    const regexfilter = {"categories": {$regex: regExpression}};
    const books = await Book.find(regexfilter);
    res.json(books);

});

module.exports = router;