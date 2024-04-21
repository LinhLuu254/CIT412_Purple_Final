import { useCallback, useState } from "react"

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
    search = () => {},
    reset = () => {},

    caseInsensitive: initCaseInsensitive = true,
    matchWhole: initMatchWhole = false,
    accentInsensitive: initAccentInsensitive = true,
    descending: initDescending = false
}={}) {
    const [text, _setText] = useState(initText);
    const [type, _setType] = useState(initType);
    const [number, setNumber] = useState(numberTypes.includes(type));

    const [caseInsensitive, setCaseInsensitive] = useState(initCaseInsensitive);
    const [matchWhole, setMatchWhole] = useState(initMatchWhole);
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

    return (
        <>
            <div className="input-group mb-3">
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

                <button
                    className="btn-primary me-2"
                    onClick={() => search({text, type, caseInsensitive, matchWhole, accentInsensitive, descending})}
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
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="matchWhole"
                        checked={matchWhole}
                        onChange={(e) => setMatchWhole(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="matchWhole">Match Whole</label>
                </div>

                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="caseInsensitive"
                        checked={!caseInsensitive}
                        onChange={(e) => setCaseInsensitive(!e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="caseInsensitive">Case Sensitive</label>
                </div>

                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="accentInsensitive"
                        checked={!accentInsensitive}
                        onChange={(e) => setAccentInsensitive(!e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="accentInsensitive">Accent Sensitive</label>
                </div>

                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="descending"
                        checked={descending}
                        onChange={(e) => setDescending(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="descending">Descending</label>
                </div>
            </div>
        </>
    )
}