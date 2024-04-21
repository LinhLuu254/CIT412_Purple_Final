import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useID from 'src/hooks/useID';
import useToken from 'src/hooks/useToken';

export default function useFavoritesFetcher({
    path
}={}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const {token} = useToken();
    const {_id: userId} = useID();

    const loadFavorites = useCallback(async ({
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
        axios.get(`${path}/one/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            //console.log(res.data.favorites);
            const newData = [...res.data.favorites];
            setData(newData);
            onSuccess(newData);
        }).catch(err => {
            setError(err.message);
            console.error(err);
            onError(err);
        }).finally(() => {
            setLoading(false);
            onComplete();
        });
    }, [path, token, userId]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    return {
        loading, error, data,
        userId, loadFavorites
    };
}