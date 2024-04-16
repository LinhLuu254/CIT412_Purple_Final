const accentPatterns = [
    "(a|á|à|ä|â)", "(A|Á|À|Ä|Â)",
    "(e|é|è|ë|ê)", "(E|É|È|Ë|Ê)",
    "(i|í|ì|ï|î)", "(I|Í|Ì|Ï|Î)",
    "(o|ó|ò|ö|ô)", "(O|Ó|Ò|Ö|Ô)",
    "(u|ú|ù|ü|û)", "(U|Ú|Ù|Ü|Û)"
];

function combineFlags(...flags) {
    const result = new Set();
    flags.forEach((flag) => {
        if (flag) {
            flag.split("").forEach((c) => {
                if (!result.has(c)) result.add(c);
            });
        }
    });

    return [...result].join("");
}

function escapeRegex(value, flags = "") {
    if (typeof value === 'string') {
        return new RegExp(value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    } else if (value instanceof RegExp) {
        return escapeRegex(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

function regexAccentInsensitive(value, flags = "") {
    if (typeof value === 'string') {
        accentPatterns.forEach((pattern) => {
            value = value.replaceAll(new RegExp(pattern, "g"), pattern);
        });
        return new RegExp(value, flags);
    } else if (value instanceof RegExp) {
        return regexAccentInsensitive(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

function removeAccents(value) {
    if (typeof value === 'string') {
        accentPatterns.forEach((pattern) => {
            value = value.replaceAll(new RegExp(pattern, "g"), pattern[1]);
        });
        return value;
    } else {
        throw new TypeError("Expected string, got " + typeof value);
    }
}

function regexCaseInsensitive(value, flags = "") {
    if (typeof value === 'string') {
        if (!flags.includes("i")) {
            flags += "i";
        }
        return new RegExp(value, flags);
    } else if (value instanceof RegExp) {
        return regexCaseInsensitive(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

function regexMatchWhole(value, flags = "") {
    if (typeof value === 'string') {
        return new RegExp(`^${value}$`, flags);
    } else if (value instanceof RegExp) {
        return regexMatchWhole(value.source, combineFlags(value.flags, flags));
    } else {
        throw new TypeError("Expected string or RegExp, got " + typeof value);
    }
}

function transformRegex(value, args={}) {
    const flags = args.flags || "";
    if (args.accentInsensitive) value = regexAccentInsensitive(value, flags);
    if (args.caseInsensitive) value = regexCaseInsensitive(value, flags);
    if (args.matchWhole) value = regexMatchWhole(value, flags);
    return value;
}

function cleanString(str) {
    return removeAccents(str).toLowerCase().replaceAll(/[^a-z0-9 ]/g, "");
}

const alphanumericPattern = /[\w_-]*/i;
const nonAlphanumericPattern = /[^\w_-]*/i;

function isAlphanumeric(str) {
    return transformRegex(alphanumericPattern, {matchWhole: true}).test(str);
}

function toAlphanumeric(str, separator="-") {
    str = removeAccents(str);
    const words = str.split(/\s+/);
    return words.map(word => word.length === 0 ? "" : word.replaceAll(transformRegex(nonAlphanumericPattern, {matchWhole: true, flags: "g"}), separator)).join(separator);
}

function isValidEmail(v) {
    return /^\S+@\S+\.\S+$/.test(v);
}

function isValidPhoneNumber(v) {
    return /^\(\d{3}\)(\s*|-)\d{3}(\s*|-)\d{4}$/.test(v);
}

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
function isValidURL(v) {
    return /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(v);
}

function isValidOffset(v) {
    return /^(\+|-)\d{1,2}:\d{2}$/.test(v);
}

function isValidSSN(v) {
    return /^\d{3}-?\d{2}-?\d{4}$/.test(v);
}

module.exports = {
    combineFlags,
    escapeRegex,
    removeAccents,

    regexAccentInsensitive,
    regexCaseInsensitive,
    regexMatchWhole,
    transformRegex,

    cleanString,
    isAlphanumeric,
    toAlphanumeric,

    isValidEmail,
    isValidPhoneNumber,
    isValidURL,
    isValidOffset,
    isValidSSN
};