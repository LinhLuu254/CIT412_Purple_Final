import React, { useContext, useState } from 'react';
import 'src/components/Book/Book.css';
import { APIURLContext } from 'src/contexts/APIURLContext';
import useFavoriteToggler from 'src/hooks/FavoriteToggler';
import useID from 'src/hooks/useID';

function Books({ bookID, bookTitle, bookCategory, bookThumbnail, bookRating, bookDescription, bookAuthor, favorite, refreshFavorites }) {
    const apiURL = useContext(APIURLContext);
    const { _id } = useID();
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const { toggleFavorite, loading: toggleLoading, error: toggleError } = useFavoriteToggler({
        path: `${apiURL}/users`,
        bookID
    });

    if (toggleError === "Unauthorized") {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('_id');
    }

    return (
        <div className="col-md-4">
            <div className="card" id="bookCard">
                {bookThumbnail ? (
                    <img className="card-img-top" id="cardImage" src={bookThumbnail} alt={bookTitle} />
                ) : (
                    <p>[No Image Available]</p>
                )}
                <div className="card-body">
                    <h4 className="card-title">{bookTitle}</h4>
                    <h7><i>{bookAuthor?.join(" and ") || "[undefined]"}</i></h7>
                    <p className="card-text"><strong>Categories: </strong>{bookCategory?.join(", ") || "[None]"}</p>
                    <p className="card-text"><strong>Rate: </strong><b>{bookRating || "[None]"}</b></p>
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" onClick={() => setIsAccordionOpen(!isAccordionOpen)} aria-expanded={isAccordionOpen} aria-controls="collapseOne">
                                    Description
                                </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`} id="collapseOne" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <strong>{bookDescription}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (_id) toggleFavorite({ onSuccess: refreshFavorites });
                        }}
                        disabled={toggleLoading || !_id}
                    >
                        {!_id ? "Login to Favorite"
                            : toggleLoading ? "Loading..."
                                : toggleError ? "Error"
                                    : favorite ? "Remove from Favorites"
                                        : "Add to Favorites"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Books;

