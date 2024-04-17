const express = require('express');
const router = express.Router();
const Book = require("models/Book");
const { transformRegex } = require("lib/Regex");

// Reduce repetitive code by batch-creating similar routes
function createFilterRoutes(path, _get=() => Book.find({})) {
    function get(req, res) {
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

        if (s !== "null") result = result.sort({ [sort]: 1 });
        if (limit !== "null") result = result.limit(parseInt(limit)).skip(parseInt(limit) * parseInt(page));
        
        return result;
    }

    router.get(`/${path}`, (req, res) => {
        const query = get(req, res);
        if (res.headersSent) return;

        query.then((books) => {
            res.json(books);
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    });

    router.get(`/${path}/props/:fields`, (req, res) => {
        const query = get(req, res);
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
            if (!Book.pathExists(field) && !res.headersSent) return res.status(400).send(`Invalid property: ${field}`);
            fields[field] = negate ? 0 : 1;
        });
        if (res.headersSent) return;

        if (!fields._id) fields._id = 0;
        if (fields.id) {
            fields._id = 1;
            delete fields.id;
        }
        
        query.select(fields).then((books) => {
            res.json(books);
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err);
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
    if (!Book.pathExists(prop)) return res.status(400).send(`Invalid property: ${prop}`);
    
    let result;
    if (Book.pathType(prop) === "String") {
        result = Book.find({
            [prop]: transformRegex(val, {
                caseInsensitive: case_insensitive === "true",
                matchWhole: match_whole === "true",
                accentInsensitive: accent_insensitive === "true"
            })
        }).limit(parseInt(limit));
    } else if (Book.pathType(prop) === "Number") {
        if (val.startsWith(">=")) {
            val = val.substring(2);
            
            if (isNaN(val)) return res.status(400).send(`Invalid Number: ${val}`);
            result = Book.find({ [prop]: { $gte: val } });
        } else if (val.startsWith("<=")) {
            val = val.substring(2);

            if (isNaN(val)) return res.status(400).send(`Invalid Number: ${val}`);
            result = Book.find({ [prop]: { $lte: val } });
        } else if (val.startsWith('>')) {
            val = val.substring(1);

            if (isNaN(val)) return res.status(400).send(`Invalid Number: ${val}`);
            result = Book.find({ [prop]: { $gt: val } });
        } else if (val.startsWith('<')) {
            val = val.substring(1);

            if (isNaN(val)) return res.status(400).send(`Invalid Number: ${val}`);
            result = Book.find({ [prop]: { $lt: val } });
        } else if (val.startsWith("in_")) {
            const [min, max] = val.substring(3).split(':');

            if (isNaN(min)) return res.status(400).send(`Invalid Min Number: ${min}`);
            if (isNaN(max)) return res.status(400).send(`Invalid Max Number: ${max}`);
            result = Book.find({ [prop]: { $gte: min, $lte: max } });
        } else if (val.startsWith("nin_")) {
            const [min, max] = val.substring(4).split(':');
            result = Book.find({$or: [{[prop]: {$lt: min}}, {[prop]: {$gt: max}}]});
        } else {
            result = Book.find({ [prop]: val });
        }
    }

    return result.limit(parseInt(limit)).skip(parseInt(limit) * parseInt(page));
});

//get all distince categories
router.get('/categories', (req, res) => {
    Book.distinct('categories')
        .then(categories => {
            res.json(categories);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error retrieving categories');
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