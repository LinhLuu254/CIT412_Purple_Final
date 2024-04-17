import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import 'src/components/Book/Book.css'


function Books({bookID, bookTitle, bookCategory, bookThumbnail, bookRating}) {

    console.log(`Book's id: ${bookID}`)

    return (

        <div className="col-md-4">
            <div className="card p-2" id="bookCard">
                <img className="card-img-top" id="cardImage" src={bookThumbnail} alt={bookTitle}></img>
                <div className="card-body">
                    <h5 className="card-title">{bookTitle}</h5>
                    <p className="card-text"><strong>Categories: </strong><i>{bookCategory.join(", ")}</i></p>
                    <p className="card-text"><strong>Rate: </strong><b>{bookRating}</b></p>
                    <p id="link"><RouterLink to='/login' >Login for more detail..</RouterLink></p>
                </div>
            </div>
        </div>
       
    )
}

export default Books;