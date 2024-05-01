import useBookFetcher from "src/hooks/BookFetcher";
import {useCallback, useContext} from 'react';
import { APIURLContext } from 'src/contexts/APIURLContext';
import Books from "src/components/Book/Book";
import { SearchBar } from "src/components/SearchBar/SearchBar";
import useFavoritesFetcher from "src/hooks/FavoritesFetcher";
import useToken from "src/hooks/useToken";

export default function BookGallery({path = "books", reloadOnFavoriteChange=false, email}={}) {
    const apiURL = useContext(APIURLContext);
    const {token} = useToken();

    const {
        loading: booksLoading, error: booksError, data: booksData,
        setQuery, setFilter, page, setPage,
        setMatchWhole, setCaseInsensitive, setAccentInsensitive,
        setDescending, setMatchWord, setSort,
        loadBooks
    } = useBookFetcher({
        path: `${apiURL}/${path}`,
        sort: "null",
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

    const onSearch = useCallback(({text, type, matchWhole, matchWord, caseInsensitive, accentInsensitive, descending, sort}) => {
        if (!booksLoading) {
            setQuery(text);
            setFilter(type);
            setPage(0);
            setMatchWhole(matchWhole);
            setMatchWord(matchWord);
            setCaseInsensitive(caseInsensitive);
            setAccentInsensitive(accentInsensitive);
            setDescending(descending);
            setSort(sort);
        }
    }, [booksLoading, setQuery, setFilter, setPage, setMatchWhole, setCaseInsensitive, setAccentInsensitive, setDescending, setMatchWord, setSort]);

    if (booksError || favoritesError) {
        if ((booksError || favoritesError) === "Unauthorized") {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('_id');
        }
        return <div className="container-sm mx-auto p-3"><p>Error: {booksError || favoritesError}</p></div>
    }

    const sendPubSubData = async () => {

        booksData.email = email;

        try{
            const response = await fetch(`${apiURL}/users/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },                
                body: JSON.stringify(booksData)
            });

            if (!response.ok) {
                throw new Error('Error sending data to API');
            }

            console.log('Data sent successfully!');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container-lg" id="gallery">
            {token ? <button onClick={sendPubSubData} >Share your favs</button> : null}
            <div className="row m-3 p-3" id="search">
                <SearchBar
                    search={onSearch}
                    text=""
                    type="all"
                    sort="null"
                    
                    caseInsensitive
                    accentInsensitive

                    matchWhole={false}
                    matchWord={false}
                    descending={false}
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