import { useCallback, useState } from "react"
import Switch from "src/components/Switch/Switch";

const numberTypes = [
    "isbn13",
    "min_isbn13",
    "max_isbn13",
    "min_num_pages",
    "max_num_pages",
    "min_published_year",
    "max_published_year",
    "min_average_rating",
    "max_average_rating",
    "min_ratings_count",
    "max_ratings_count"
];

export function SearchBar({
    type: initType = "title",
    text: initText = "",
    search: _search = () => {},

    sort: initSort = "null",
    caseInsensitive: initCaseInsensitive = true,
    matchWhole: initMatchWhole = false,
    matchWord: initMatchWord = false,
    accentInsensitive: initAccentInsensitive = true,
    descending: initDescending = false
}={}) {
    const [text, _setText] = useState(initText);
    const [type, _setType] = useState(initType);
    const [number, setNumber] = useState(numberTypes.includes(type));

    const [sort, setSort] = useState(initSort);
    const [caseInsensitive, setCaseInsensitive] = useState(initCaseInsensitive);
    const [matchWhole, setMatchWhole] = useState(initMatchWhole);
    const [matchWord, setMatchWord] = useState(initMatchWord);
    const [accentInsensitive, setAccentInsensitive] = useState(initAccentInsensitive);
    const [descending, setDescending] = useState(initDescending);

    const setText = useCallback((text) => {
        if (number) {
            text = text.replace(/[^0-9]/g, "");
        }
        _setText(text);
    }, [number]);

    const setType = useCallback((type) => {
        _setType(type);
        if (numberTypes.includes(type)) _setText(text.replace(/[^0-9]/g, ""));
        setNumber(numberTypes.includes(type));
    }, [text]);

    function search() {
        _search({text, type, caseInsensitive, matchWhole, accentInsensitive, descending, matchWord, sort});
    }

    function reset() {
        _setText(initText);
        _setType(initType);
        setSort(initSort);
        setCaseInsensitive(initCaseInsensitive);
        setMatchWhole(initMatchWhole);
        setMatchWord(initMatchWord);
        setAccentInsensitive(initAccentInsensitive);
        setDescending(initDescending);

        _search({
            text: initText,
            type: initType,
            caseInsensitive: initCaseInsensitive,
            matchWhole: initMatchWhole,
            accentInsensitive: initAccentInsensitive,
            descending: initDescending,
            matchWord: initMatchWord,
            sort: initSort
        });
    }

    return (
        <div className="mb-3">
            <div className="input-group">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search..." 
                    aria-label="Search" 
                    aria-describedby="basic-addon2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <select 
                    className="form-select" 
                    id="inputGroupSelect01"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="all">(Select One)</option>
                    <option value="title">Title</option>
                    <option value="subtitle">Subtitle</option>
                    <option value="description">Description</option>
                    <option value="authors">Author</option>
                    <option value="categories">Category</option>
                    <option value="isbn10">ISBN10</option>

                    <option value="isbn13">ISBN13</option>
                    <option value="min_isbn13">Min ISBN13</option>
                    <option value="max_isbn13">Max ISBN13</option>
                    <option value="num_pages">Number of Pages</option>
                    <option value="min_num_pages">Min Number of Pages</option>
                    <option value="max_num_pages">Max Number of Pages</option>
                    <option value="published_year">Published Year</option>
                    <option value="min_published_year">Min Published Year</option>
                    <option value="max_published_year">Max Published Year</option>
                    <option value="ratings_count">Ratings Count</option>
                    <option value="min_ratings_count">Min Ratings Count</option>
                    <option value="max_ratings_count">Max Ratings Count</option>
                    <option value="average_rating">Average Rating</option>
                    <option value="min_average_rating">Min Average Rating</option>
                    <option value="max_average_rating">Max Average Rating</option>
                </select>

                <select
                    className="form-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="null">(No Sort)</option>
                    <option value="title">Sort by Title</option>
                    <option value="subtitle">Sort by Subtitle</option>
                    <option value="description">Sort by Description</option>
                    <option value="authors">Sort by Author</option>
                    <option value="categories">Sort by Category</option>
                    <option value="isbn10">Sort by ISBN10</option>
                    <option value="isbn13">Sort by ISBN13</option>
                    <option value="num_pages">Sort by Number of Pages</option>
                    <option value="published_year">Sort by Published Year</option>
                    <option value="ratings_count">Sort by Ratings Count</option>
                    <option value="average_rating">Sort by Average Rating</option>
                </select>

                <button
                    className="btn-primary me-2"
                    onClick={search}
                >
                    Search
                </button>

                <button
                    className="btn-primary"
                    onClick={() => reset()}
                >
                    Reset
                </button>
            </div>

            <div className="d-flex flex-row gap-2">
                <Switch
                    id="matchWhole"
                    label="Match Whole String"
                    checked={matchWhole}
                    onChange={setMatchWhole}
                />

                <Switch
                    id="matchWord"
                    label="Match Whole Word"
                    checked={matchWord}
                    onChange={setMatchWord}
                />

                <Switch
                    id="caseSensitive"
                    label="Case Sensitive"
                    checked={!caseInsensitive}
                    onChange={setCaseInsensitive}

                    invert
                />

                <Switch
                    id="accentSensitive"
                    label="Accent Sensitive"
                    checked={!accentInsensitive}
                    onChange={setAccentInsensitive}

                    invert
                />

                <Switch
                    id="descending"
                    label="Descending"
                    checked={descending}
                    onChange={setDescending}
                />
            </div>
        </div>
    )
}