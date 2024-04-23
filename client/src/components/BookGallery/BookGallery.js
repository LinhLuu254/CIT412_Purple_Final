import useBookFetcher from "src/hooks/BookFetcher";
import {useCallback, useContext} from 'react';
import { APIURLContext } from 'src/contexts/APIURLContext';
import Books from "src/components/Book/Book";
import { SearchBar } from "src/components/SearchBar/SearchBar";
import useFavoritesFetcher from "src/hooks/FavoritesFetcher";

export default function BookGallery({path = "books", reloadOnFavoriteChange=false}={}) {
    const apiURL = useContext(APIURLContext);

    const {
        loading: booksLoading, error: booksError, data: booksData,
        setQuery, query, setFilter, filter, page, setPage,
        setMatchWhole, matchWhole,
        setCaseInsensitive, caseInsensitive,
        setAccentInsensitive, accentInsensitive,
        setDescending, descending,
        loadBooks
    } = useBookFetcher({
        path: `${apiURL}/${path}`,
        filter: "all",
        limit: 12
    });

    const {
        loading: favoritesLoading, error: favoritesError, data: favorites,
        loadFavorites, userId
    } = useFavoritesFetcher({
        path: `${apiURL}/users`
    });

    function refreshFavorites() {
        if (reloadOnFavoriteChange) {
            loadBooks();
        }
        if (userId) loadFavorites();
    }

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
    }, [booksLoading, setQuery, setFilter, setPage, setMatchWhole, setCaseInsensitive, setAccentInsensitive, setDescending]);

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
    }, [booksLoading, setQuery, setFilter, setPage, setMatchWhole, setCaseInsensitive, setAccentInsensitive, setDescending]);

    if (booksError || favoritesError) return <div className="container-sm mx-auto p-3"><p>Error: {booksError || favoritesError}</p></div>
    return (
        <div className="container-lg" id="gallery">
            <div className="row m-3 p-3" id="search">
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

                <p id="show-page">
                    Showing Page {page + 1} {" "}
                    (books {booksData.startIndex + 1}-{booksData.endIndex})
                    of {booksData.maxPage} pages ({booksData.count} books total)
                </p>

                {booksLoading || favoritesLoading ? <p>Loading...</p> : null}

                <div className="col ">
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
                        
                        disabled={page === booksData.maxPage - 1}
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
                </div>   
            </div>
            <div className="row p-2 m-auto">
                <div className="row">
                    {
                        booksData?.books?.map((book) =>(
                            <Books
                                key = {book._id}
                                loading={booksLoading}
                                error={booksError}
                                bookID={book._id}
                                bookTitle={book.title}
                                bookCategory={book.categories}
                                bookThumbnail={book.thumbnail}
                                bookDescription={book.description} 
                                bookAuthor={book.authors}
                                bookRating={book.average_rating}
                                favorite={favorites.includes(book._id)}
                                refreshFavorites={refreshFavorites}
                            />

                        ))
                    }
                </div>
            </div> 
        </div>
    )
}