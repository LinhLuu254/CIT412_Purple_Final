import { useCallback, useState } from 'react';
import axios from 'axios';
import useID from 'src/hooks/useID';
import useToken from 'src/hooks/useToken';

export default function useFavoriteToggler({
    path,
    bookID: _bookID
}={}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [bookID, setBookID] = useState(_bookID);
    const {token} = useToken();
    const {_id: userId} = useID();

    const toggleFavorite = useCallback(async ({
        onSuccess = () => {},
        onError = () => {},
        onComplete = () => {}
    }={}) => {
        if (!token || !userId) {
            setLoading(false);

            const err = new Error("Not Logged In");
            setError(err.message);
            onError(err);
            return;
        }

        setLoading(true);
        axios.post(`${path}/one/${userId}/toggle-favorite/${bookID}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            onSuccess(res);
        }).catch(err => {
            setError(err.message);
            console.error(err);
            onError(err);
        }).finally(() => {
            setLoading(false);
            onComplete();
        });
    }, [path, bookID, token, userId]);

    return {
        loading, error, toggleFavorite, bookID, setBookID
    };
}