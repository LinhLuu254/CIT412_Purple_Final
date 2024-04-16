import { createContext } from "react";

const apiURL = () => {
    console.log(`Environment: ${process.env.NODE_ENV}`)
    if (process.env.NODE_ENV === 'production') {
        console.log(`Production; API URL: ${process.env.REACT_APP_PROD_API_URL}`)
        return process.env.REACT_APP_PROD_API_URL;
    } else {
        console.log(`Not in Production; API URL: ${process.env.REACT_APP_DEV_API_URL}`)
        return process.env.REACT_APP_DEV_API_URL;
    }
}

export const APIURLContext = createContext(apiURL());