import React, { useContext } from 'react';
import 'src/components/Book/Book.css'
import { APIURLContext } from 'src/contexts/APIURLContext';
import useFavoriteToggler from 'src/hooks/FavoriteToggler';


function Books({bookID, bookTitle, bookCategory, bookThumbnail, bookRating, favorite, refreshFavorites}) {
    const apiURL = useContext(APIURLContext);
    const {toggleFavorite, loading: toggleLoading, error: toggleError} = useFavoriteToggler({
        path: `${apiURL}/users`,
        bookID
    });

    return (
        <div className="col-md-4">
            <div className="card p-2" id="bookCard">
                {
                    bookThumbnail ? 
                        <img className="card-img-top" id="cardImage" src={bookThumbnail} alt={bookTitle}></img>
                    :
                        <p>
                            [No Image Availables]
                        </p>
                }
                <div className="card-body">
                    <h5 className="card-title">{bookTitle}</h5>
                    <p className="card-text"><strong>Categories: </strong><i>{bookCategory?.join(", ") || "[None]"}</i></p>
                    <p className="card-text"><strong>Rate: </strong><b>{bookRating || "[None]"}</b></p>
                    <button
                        className="btn btn-primary"
                        onClick={() => toggleFavorite({onSuccess: refreshFavorites})}
                        disabled={toggleLoading}
                    >
                        {
                            toggleLoading ? "Loading..." : toggleError ? "Error" :
                            favorite ? "Remove from Favorites" : "Add to Favorites"
                        }
                    </button>
                </div>
            </div>
        </div>
       
    )
}

export default Books;