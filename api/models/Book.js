const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function toTitleCase(str="") {
    const words = str.split(" ");

    return words.map((word, i) => {
        // Simple way to detect most minor words with few false positives
        if (i !== 0 && word.length <= 3) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

const BookSchema = new Schema ({
    title: {
        type: String,
        required: true,

        trim: true,
        unique: true,

        get: toTitleCase,
        set: toTitleCase
    },

    subtitle: {
        type: String,

        trim: true,

        get: toTitleCase,
        set: toTitleCase
    },

    description: {
        type: String,

        trim: true
    },

    authors: {
        type: String,
        required: true,

        get: (v) => v?.split(";").map((a) => toTitleCase(a).trim()),
        set: (v) => {
            if (typeof v === 'string') v = v.split(";");
            
            if (Array.isArray(v)) {
                if (v.length === 0) throw new Error("At least one author is required");
                return v.map((a) => toTitleCase(a).trim()).join(";");
            } else {
                throw new Error(`Cannot convert ${v} to authors`);
            }
        }
    },

    categories: {
        type: String,

        get: (v) => v?.split(",").map((c) => toTitleCase(c).trim()),
        set: (v) => {
            if (typeof v === 'string') v = v.split(",");
            
            if (Array.isArray(v)) {
                if (v.length === 0) throw new Error("At least one category is required");
                return v.map((c) => toTitleCase(c).trim()).join(",");
            } else {
                throw new Error(`Cannot convert ${v} to categories`);
            }
        }
    },

    isbn10: {
        type: String,
        required: true,

        match: /^(\d{9}X?)|(\d{10})$/
    },

    isbn13: {
        type: Number,
        required: true,

        max: 9999999999999, // Makes sure the number is 13 digits or less

        get: (v) => pad(v, 13),
        set: (v) => {
            if (typeof v === 'string') v = parseInt(v);
            if (typeof v === 'number') return v;
            throw new Error(`Cannot convert ${v} to ISBN13`);
        }
    },

    num_pages: {
        type: Number,

        min: 1
    },

    published_year: {
        type: Number,
        required: true,

        min: 1,
        max: new Date().getFullYear() // Cannot be in the future
    },

    ratings_count: {
        type: Number,

        min: 0
    },

    average_rating: {
        type: Number,

        min: 0,
        max: 5
    },

    thumbnail: {
        type: String,

        // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        match: /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    },
}, {
    toJSON: {getters: true, virtuals: true},
});

const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;