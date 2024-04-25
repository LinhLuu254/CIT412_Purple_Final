const express = require('express');
const router = express.Router();
const Book = require("models/Book");
const User = require("models/User");
const { transformRegex } = require("lib/Regex");


// Reduce repetitive code by batch-creating similar routes
function createFilterRoutes(path, _get=() => () => Book.find({})) {
    async function get(req, res) {
        let {
            l = 10,
            limit = l,

            p = 0,
            pg = p,
            page = pg,

            s = "null",
            sort = s
        } = req.query;

        // The function will return another function, because if we await directly the whole query will get executed, and
        // we want to modify the query before that happens.
        let result = (await _get(req, res))();
        if (res.headersSent) return;

        const count = await result.clone().countDocuments();
        if (limit === "null") limit = count;

        const maxPage = Math.ceil(count / parseInt(limit));

        if (parseInt(page) >= maxPage || parseInt(page) < 0) return res.status(404).json({message: "Page out of bounds"});

        const startIndex = parseInt(page) * parseInt(limit);
        const endIndex = Math.min(startIndex + parseInt(limit), count);

        if (s !== "null") result = result.sort({ [sort]: 1 });
        result = result.limit(parseInt(limit)).skip(startIndex);
        
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

function byValue(prop, val, res, {case_insensitive, match_whole, accent_insensitive, match_word, callback=(obj) => Book.find(obj)}) {
    if (!Book.pathExists(prop)) return () => res.status(400).json({message: `Invalid property: ${prop}`});

    let result;
    if (Book.pathType(prop) === "String") {
        result = callback({
            [prop]: transformRegex(val, {
                caseInsensitive: case_insensitive === "true",
                matchWhole: match_whole === "true",
                accentInsensitive: accent_insensitive === "true",
                matchWord: match_word === "true"
            })
        });
    } else if (Book.pathType(prop) === "Number") {
        if (val.startsWith(">=")) {
            val = val.substring(2);
            
            if (isNaN(val)) return () => res.status(400).json({message: `Invalid Number: ${val}`});
            result = callback({ [prop]: { $gte: val } });
        } else if (val.startsWith("<=")) {
            val = val.substring(2);

            if (isNaN(val)) return () => res.status(400).json({message: `Invalid Number: ${val}`});
            result = callback({ [prop]: { $lte: val } });
        } else if (val.startsWith('>')) {
            val = val.substring(1);

            if (isNaN(val)) return () => res.status(400).json({message: `Invalid Number: ${val}`});
            result = callback({ [prop]: { $gt: val } });
        } else if (val.startsWith('<')) {
            val = val.substring(1);

            if (isNaN(val)) return () => res.status(400).json({message: `Invalid Number: ${val}`});
            result = callback({ [prop]: { $lt: val } });
        } else if (val.startsWith("in_")) {
            const [min, max] = val.substring(3).split(':');

            if (isNaN(min)) return () => res.status(400).json({message: `Invalid Min Number: ${min}`});
            if (isNaN(max)) return () => res.status(400).json({message: `Invalid Max Number: ${max}`});
            result = callback({ [prop]: { $gte: min, $lte: max } });
        } else if (val.startsWith("nin_")) {
            const [min, max] = val.substring(4).split(':');
            result = callback({$or: [{[prop]: {$lt: min}}, {[prop]: {$gt: max}}]});
        } else {
            result = callback({ [prop]: val });
        }
    }

    return () => result;
}

createFilterRoutes('all');

createFilterRoutes('by-:prop/:val', (req, res) => {
    let {prop, val} = req.params;

    // Simple trick to add aliases to query parameters. The one at the bottom is the one you should use in your code.
    const {
        i = "true",
        ci = i,
        case_insensitive = ci,

        W = "false",
        mW = W,
        match_whole = mW,

        w = "false",
        mw = w,
        match_word = mw,

        a = "true",
        ai = a,
        accent_insensitive = ai
    } = req.query;
    
    if (prop === 'id') prop = '_id';
    return byValue(prop, val, res, {case_insensitive, match_whole, accent_insensitive, match_word });
});

createFilterRoutes("favorited-by/:userId/all", async (req) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) return () => res.status(404).json({message: "User not found"});
    return () => Book.find({ _id: { $in: user.favorites.map((id) => id.toString()) } });
});

createFilterRoutes("favorited-by/:userId/by-:prop/:val", async (req, res) => {
    let {prop, val} = req.params;

    const {
        i = "true",
        ci = i,
        case_insensitive = ci,

        W = "false",
        mW = W,
        match_whole = mW,

        w = "false",
        mw = w,
        match_word = mw,

        a = "true",
        ai = a,
        accent_insensitive = ai
    } = req.query;

    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) return () => res.status(404).json({message: "User not found"});
    if (prop === 'id') prop = '_id';
    if (prop === "_id") return () => res.status(400).json({message: "Cannot filter by _id"});

    return byValue(prop, val, res, {
        case_insensitive,
        match_whole,
        accent_insensitive,
        match_word,
        callback: (obj) => Book.find({ ...obj, _id: { $in: user.favorites.map((id) => id.toString()) } })
    });
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