import { useState, useEffect } from 'react';
import axios from 'axios';


function useBookFetcher ({
    path,
    filter: initFilter = "all",
    query: initQuery = "",
    page: initPage = 0,
    limit: initLimit = 10,
    fields: initFields = ["title", "id", "thumbnail", "categories", "average_rating"],
    sort: initSort = null,
    caseInsensitive: initCaseInsensitive = true,
    accentInsensitive: initAccentInsensitive = true,
    matchWhole: initMatchWhole = false
}={}) {
    // Set up initial state of state variables
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [filter, setFilter] = useState(initFilter);
    const [query, setQuery] = useState(initQuery);
    const [page, setPage] = useState(initPage);
    const [limit, setLimit] = useState(initLimit);
    const [fields, setFields] = useState(initFields);
    const [sort, setSort] = useState(initSort);
    const [caseInsensitive, setCaseInsensitive] = useState(initCaseInsensitive);
    const [accentInsensitive, setAccentInsensitive] = useState(initAccentInsensitive);
    const [matchWhole, setMatchWhole] = useState(initMatchWhole);

    useEffect(() => {
        // Define a function that loads tasks from the API
        const loadBooks = async () => {
            const dataSource = 
                `${path}/${filter === "all" ? filter : `by-${filter}/${encodeURIComponent(query)}`}/props/${fields.join(",")}?`
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
                console.log(response.data);
                setBooks([...response.data]);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(err.message);
                console.error(err);
            }
        };
        
        loadBooks();
    }, [path, filter, query, fields, page, limit, sort, caseInsensitive, matchWhole, accentInsensitive]);

    return {
        loading, error, books,

        setFilter, setQuery, setPage,
        setLimit, setFields, setSort,
        setCaseInsensitive, setAccentInsensitive,
        setMatchWhole,

        filter, query, page, limit, fields, sort,
        caseInsensitive, accentInsensitive, matchWhole
    };


}

export default useBookFetcher;