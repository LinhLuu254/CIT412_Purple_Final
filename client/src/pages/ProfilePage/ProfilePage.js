import { Navigate } from 'react-router-dom';
import useToken from 'src/hooks/useToken';
import useID from 'src/hooks/useID';
import { useState, useEffect, useContext, useCallback} from "react";
import axios from 'axios';
import { APIURLContext } from "src/contexts/APIURLContext";
import BookGallery from 'src/components/BookGallery/BookGallery';
import 'src/pages/ProfilePage/ProfilePage.css'


export default function ProfilePage() {
    const { token} = useToken();
    const {_id} = useID();
    const apiURL = useContext(APIURLContext);
    const [user, setUser] = useState({});

    // const apiURL = useContext(APIURLContext);

    const loadUser = useCallback(async () => {
        try {
            const response = await axios.get(`${apiURL}/users/one/${_id}`);
            setUser(response.data);
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
        <div className="container-lg mx-auto p-3" id="profile">
            <div className='row'>
                <h2>Welcome, <i>{user.name}</i> to your book collection! </h2>
                <h3>Favorite Books</h3>
                <p>Add more to your collection...</p>
            </div>
            <div> 
                <BookGallery path={`books/favorited-by/${_id}`} reloadOnFavoriteChange={true} email={user.email} />
            </div>
        </div>
    )
}