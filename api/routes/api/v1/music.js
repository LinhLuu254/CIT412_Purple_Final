const express = require('express');
const spotify = require("config/spotify");

const router = express.Router();

router.get("/genres", (req, res) => {
    spotify.getAvailableGenreSeeds().then(data => {
        const { genres } = data.body;
        res.status(200).json(genres);
    }, err => {
        console.error(err);
        res.status(500).json({error: err.message});
    });
});

module.exports = router;