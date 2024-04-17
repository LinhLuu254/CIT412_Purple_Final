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

    const [books, setBooks] = useState([]);
    const [loading, error, bookdata] = useBookFetcher(`${apiURL}/books/all/props/title,id,thumbnail,categories,average_rating`);

    function onSearchChange(text, type) {
        if (bookdata) {
            setBooks(bookdata.filter((book) => {
                switch (type) {
                    case "title":
                        return book.title.toLowerCase().includes(text.toLowerCase());
                }

                return false;
            }));
        }
    }

    useEffect(() => {
        setBooks(bookdata)
    }, [bookdata])

    return (
        <div className="container-sm mx-auto p-3">
            <SearchBar onChange={onSearchChange} />

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