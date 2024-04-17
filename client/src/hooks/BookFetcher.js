import { useState, useEffect } from 'react';
import axios from 'axios';


function useBookFetcher (dataSource) {
    // Set up initial state of state variables
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        
        // Define a function that loads tasks from the API
        const loadBooks = async () => {
            try {
                const response = await axios.get(dataSource);
                console.log(response.data);
                setBooks((books) => [...response.data]);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(err.message);
                console.error(err);
            }
        };

        // Call the function we defined
        setLoading(true);
        loadBooks();

    }, [])

    return [loading, error, books];


}

export default useBookFetcher;