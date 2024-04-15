const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

require("models/Book");
const Book = mongoose.model("Book");

// Reduce repetitive code by batch-creating similar routes
function createFilterRoutes(path, get=() => Book.find()) {
    router.get(`/${path}`, (req, res) => {
        const query = get(req);

        query.then((books) => {
            res.json(books);
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    });

    router.get(`/${path}/partial/:fields`, (req, res) => {
        const fields = {};
        req.params.fields.split(',').forEach((field) => {
            fields[field.trim()] = 1;
        });
        if (!fields._id) fields._id = 0;

        const query = get(req).select(fields);

        query.then((books) => {
            res.json(books);
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    });
}

createFilterRoutes('all');
createFilterRoutes('by-title/:title', (req) => Book.find({ title: req.params.title }));

module.exports = router;