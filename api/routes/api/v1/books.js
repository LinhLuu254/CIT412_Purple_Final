const express = require('express');
const router = express.Router();
const Book = require("models/Book");
const { transformRegex } = require("lib/Regex");

// Reduce repetitive code by batch-creating similar routes
function createFilterRoutes(path, get=() => Book.find({})) {
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
            field = field.trim();
            let negate = false;
            if (field.startsWith('-')) {
                field = field.substring(1);
                negate = true;
            }

            if (field === 'id') field = '_id';
            if (!Book.pathExists(field)) return res.status(400).send(`Invalid property: ${field}`);
            fields[field] = negate ? 0 : 1;
        });
        if (res.headersSent) return;

        if (!fields._id) fields._id = 0;
        if (fields.id) fields._id = 1;
        
        query.select(fields).then((books) => {
            res.json(books);
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    });
}

function findByRegex(regexArgs) {
    return (req, res) => {
        let {prop, val} = req.params;

        if (prop === 'id') prop = '_id';
        if (!Book.pathExists(prop)) return res.status(400).send(`Invalid property: ${prop}`);
        
        if (Book.pathType(prop) === "String") {
            return Book.find({ [prop]: transformRegex(val, regexArgs) });
        } else if (Book.pathType(prop) === "Number") {
            if (val.startsWith(">=")) {
                val = val.substring(2);
                return Book.find({ [prop]: { $gte: val } });
            } else if (val.startsWith("<=")) {
                val = val.substring(2);
                return Book.find({ [prop]: { $lte: val } });
            } else if (val.startsWith('>')) {
                val = val.substring(1);
                return Book.find({ [prop]: { $gt: val } });
            } else if (val.startsWith('<')) {
                val = val.substring(1);
                return Book.find({ [prop]: { $lt: val } });
            } else if (val.startsWith("in_")) {
                const [min, max] = val.substring(3).split(':');
                return Book.find({ [prop]: { $gte: min, $lte: max } });
            } else if (val.startsWith("nin_")) {
                const [min, max] = val.substring(4).split(':');
                return Book.find({$or: [{[prop]: {$lt: min}}, {[prop]: {$gt: max}}]});
            } else {
                return Book.find({ [prop]: val });
            }
        }
    };
}

createFilterRoutes('all');
// by-exact-prop needs to be defined before by-prop or by-prop will catch any by-exact-prop requests and cause an error
createFilterRoutes('by-exact-:prop/:val', findByRegex({matchWhole: true}));
createFilterRoutes('by-:prop/:val', findByRegex({caseInsensitive: true, accentInsensitive: true}));

module.exports = router;