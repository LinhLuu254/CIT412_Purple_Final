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

    const {loading, error, data: booksData, query, setQuery, filter, setFilter, page, setPage} = useBookFetcher({
        path: `${apiURL}/books`,
        filter: "all",
        limit: 9
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
            <SearchBar search={onSearch} text={query} type={filter === "all" ? "title" : filter} />

            <p>
                Showing Page {page + 1} {" "}
                (books {booksData.startIndex + 1}-{booksData.endIndex})
                of {booksData.maxPage + 1} pages ({booksData.count} books total)
            </p>

            <button
                className="btn-primary me-2"
                onClick={() => setPage(0)}
                disabled={page === 0}
            >
                First
            </button>

            <button
                className="btn-primary me-2"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
            >
                Previous
            </button>
            <button
                className="btn-primary"
                onClick={() => setPage((p) => p + 1)}
                
                disabled={page === booksData.maxPage}
            >
                Next
            </button>

            <button
                className="btn-primary ms-2"
                onClick={() => setPage(booksData.maxPage - 1)}
                disabled={page === booksData.maxPage - 1}
            >
                Last
            </button>

            <div className="row">
                {
                    booksData.books.map((book) =>(
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