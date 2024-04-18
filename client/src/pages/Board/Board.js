import "src/pages/Board/Board.css"
import useBookFetcher from "src/hooks/BookFetcher";
import { useState, useEffect } from "react";
import {useContext} from 'react';
import { APIURLContext } from 'src/contexts/APIURLContext';
import { nanoid } from "nanoid";
import Books from "src/components/Book/Book";
import { SearchBar } from "src/components/SearchBar/SearchBar";



function Board() {
    const apiURL = useContext(APIURLContext);

    const {loading, error, books, setQuery, setFilter, page, setPage} = useBookFetcher({
        path: `${apiURL}/books`,
        filter: "all"
    });

    function onSearch(text, type) {
        if (!loading) {
            setQuery(text);
            setFilter(type);
        }
    }

    if (loading) return <div className="container-sm mx-auto p-3"><p>Loading...</p></div>
    return (
        <div className="container-sm mx-auto p-3">
            <SearchBar search={onSearch} disabled={loading} />

            <p>Page {page + 1}</p>
            <button
                className="btn-primary"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
            >
                Previous
            </button>
            <button
                className="btn-primary"
                onClick={() => setPage((p) => p + 1)}
                
                // Determining max page will be later.
                //disabled={page === 0}
            >
                Next
            </button>

            <div className="row">
                {
                    books.map((book) =>(
                        <Books
                            key = {nanoid()}
                            loading={loading}
                            error={error}
                            bookID={book._id}
                            bookTitle={book.title}
                            bookCategory={book.categories}
                            bookThumbnail={book.thumbnail} 
                            bookRating={book.average_rating}   
                        />

                    ))
                }

            </div>
        </div>
    )
}

export default Board;