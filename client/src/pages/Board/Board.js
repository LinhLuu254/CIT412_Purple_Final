import "src/pages/Board/Board.css"
import useBookFetcher from "src/hooks/BookFetcher";
import {useCallback, useContext} from 'react';
import { APIURLContext } from 'src/contexts/APIURLContext';
import { nanoid } from "nanoid";
import Books from "src/components/Book/Book";
import { SearchBar } from "src/components/SearchBar/SearchBar";
import useFavoritesFetcher from "src/hooks/FavoritesFetcher";

function Board() {
    const apiURL = useContext(APIURLContext);

    const {
        loading: booksLoading, error: booksError, data: booksData,
        setQuery, query, setFilter, filter, page, setPage,
        setMatchWhole, matchWhole,
        setCaseInsensitive, caseInsensitive,
        setAccentInsensitive, accentInsensitive,
        setDescending, descending
    } = useBookFetcher({
        path: `${apiURL}/books`,
        filter: "all",
        limit: 9
    });

    const {
        loading: favoritesLoading, error: favoritesError, data: favorites,
        loadFavorites: refreshFavorites
    } = useFavoritesFetcher({
        path: `${apiURL}/users`
    });

    const onSearch = useCallback(({text, type, matchWhole, caseInsensitive, accentInsensitive, descending}) => {
        if (!booksLoading) {
            setQuery(text);
            setFilter(type);
            setPage(0);
            setMatchWhole(matchWhole);
            setCaseInsensitive(caseInsensitive);
            setAccentInsensitive(accentInsensitive);
            setDescending(descending);
        }
    }, [booksLoading, setQuery, setFilter, setPage]);

    const onReset = useCallback(() => {
        if (!booksLoading) {
            setQuery("");
            setFilter("all");
            setPage(0);
            setMatchWhole(false);
            setCaseInsensitive(true);
            setAccentInsensitive(true);
            setDescending(false);
        }
    }, [booksLoading, setQuery, setFilter, setPage]);

    if (booksError || favoritesError) return <div className="container-sm mx-auto p-3"><p>Error: {booksError || favoritesError}</p></div>
    return (
        <div className="container-sm mx-auto p-3">
            <SearchBar
                search={onSearch}
                reset={onReset}
                text={query}
                type={filter}
                caseInsensitive={caseInsensitive}
                matchWhole={matchWhole}
                accentInsensitive={accentInsensitive}
                descending={descending}
            />

            <p>
                Showing Page {page + 1} {" "}
                (books {booksData.startIndex + 1}-{booksData.endIndex})
                of {booksData.maxPage + 1} pages ({booksData.count} books total)
            </p>

            {booksLoading || favoritesLoading ? <p>Loading...</p> : null}
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
                    booksData?.books?.map((book) =>(
                        <Books
                            key = {nanoid()}
                            loading={booksLoading}
                            error={booksError}
                            bookID={book._id}
                            bookTitle={book.title}
                            bookCategory={book.categories}
                            bookThumbnail={book.thumbnail} 
                            bookRating={book.average_rating}
                            favorite={favorites.includes(book._id)}
                            refreshFavorites={refreshFavorites}
                        />

                    ))
                }

            </div>
        </div>
    )
}

export default Board;