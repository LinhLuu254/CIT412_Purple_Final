import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function filterString(type, value) {
    value = encodeURIComponent(value);

    if (type === "all") return "all";
    if (type.startsWith("min_")) return `by-${type.slice(4)}/>=${value}`;
    if (type.startsWith("max_")) return `by-${type.slice(4)}/<=${value}`;

    return `by-${type}/${value}`;
}

function useBookFetcher ({
    path,
    filter: initFilter = "all",
    query: initQuery = "",
    page: initPage = 0,
    limit: initLimit = 10,
    fields: initFields = ["title", "id", "thumbnail", "categories", "average_rating","description", "authors"],
    sort: initSort = null,
    descending: initDescending = false,
    caseInsensitive: initCaseInsensitive = true,
    accentInsensitive: initAccentInsensitive = true,
    matchWhole: initMatchWhole = false
}={}) {
    // Set up initial state of state variables
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filter, setFilter] = useState(initFilter);
    const [query, setQuery] = useState(initQuery);
    const [page, setPage] = useState(initPage);
    const [limit, setLimit] = useState(initLimit);
    const [fields, setFields] = useState(initFields);
    const [sort, setSort] = useState(initSort);
    const [descending, setDescending] = useState(initDescending);
    const [caseInsensitive, setCaseInsensitive] = useState(initCaseInsensitive);
    const [accentInsensitive, setAccentInsensitive] = useState(initAccentInsensitive);
    const [matchWhole, setMatchWhole] = useState(initMatchWhole);

    // Define a function that loads tasks from the API
    const loadBooks = useCallback(async () => {
        const dataSource = 
            `${path}/${filterString(filter, query)}/props/${fields.join(",")}?`
            + `p=${page}&`
            + `l=${limit}&`
            + `s=${sort}&`
            + `i=${caseInsensitive}&`
            + `m=${matchWhole}&`
            + `a=${accentInsensitive}`
        ;

        try {
            setLoading(true);
            const response = await axios.get(dataSource);
            response.data.books = descending ? response.data.books.reverse() : response.data.books;
            //console.log(response.data);
            setData({...response.data});
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
            console.error(err);
        }
    }, [path, filter, query, page, limit, fields, sort, descending, caseInsensitive, matchWhole, accentInsensitive]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    return {
        loading, error, data,

        setFilter, setQuery, setPage,
        setLimit, setFields, setSort,
        setCaseInsensitive, setAccentInsensitive,
        setMatchWhole, setDescending,

        filter, query, page, limit, fields, sort,
        caseInsensitive, accentInsensitive, matchWhole,
        descending, loadBooks
    };
}

export default useBookFetcher;