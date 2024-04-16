
import { useState } from 'react';

export default function useID() {
    // Function that retrieves an _id in LocalStorage
    function getID() {
        const IDString = localStorage.getItem('_id');
        const userID = JSON.parse(IDString);
        if (userID) {
            console.log(`Found _id`);
            return userID;
        } else {
            return null;
        }
    }

    const [_id, setID] = useState(getID());

    // Function that sets accessID in LocalStorage
    function saveID(userID) {
        localStorage.setItem('_id', JSON.stringify(userID));
        setID(userID);
    }

    // Return an object that allows to invoke the custom hook
    return {
        _id,
        setID: saveID
    }

}