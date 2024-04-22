import { Navigate } from 'react-router-dom';
import useToken from 'src/hooks/useToken';
import useID from 'src/hooks/useID';
import { useState, useEffect, useContext, useCallback} from "react";
import axios from 'axios';
import { APIURLContext } from "src/contexts/APIURLContext";
import Books from 'src/components/Book/Book';


export default function ProfilePage() {
    const { token} = useToken();

    const {_id} = useID();

    const apiURL = useContext(APIURLContext);

    const [user, setUser] = useState({});

    // const apiURL = useContext(APIURLContext);

    const loadUser = useCallback(async () => {
        try {
            const response = await axios.get(`${apiURL}/users/one/${_id}?i=true`);
            setUser(response.data)

        }catch (error){
            console.error(error);

        }
    }, [_id, apiURL]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    //Nagvigate Register when not user
    if (!user) {
        return <Navigate replace to='/register' />
    } 

    // If there isn't a token set, don't let the user see this page
    if (!token) {
        // Redirect the user to login
        return <Navigate replace to='/login' />
    }


    //console.log(`Token: ${token}`);
    //console.log(`ID: ${_id}`);

    return(
        <div>
            <div>
                <h2>User's Info</h2>
                <p>Username: {user.name}</p>
                <p>Useremail: {user.email}</p>

                <h2>Favorite Books</h2>
                <div className="row">
                    {
                        user?.favorites?.map((book) =>
                            <Books
                                key={book._id}
                                book={book}
                                bookID={book._id}
                                bookTitle={book.title}
                                bookCategory={book.categories}
                                bookThumbnail={book.thumbnail} 
                                bookRating={book.average_rating}
                                favorite={true}
                                refreshFavorites={loadUser}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}