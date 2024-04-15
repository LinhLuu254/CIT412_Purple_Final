import { APIURLContext } from "src/contexts/APIURLContext";
import { useState, useContext } from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import useToken from "src/hook/useToken";
import axios from "axios";
import useID from "src/hook/useID";


export default function LoginForm() {

    const [inputs, setInputs] = useState({});
    const apiURL = useContext(APIURLContext);
    const { token, setToken } = useToken();
    const {_id, setID} = useID();
    const navigate = useNavigate();

    if (token) {
        return <Navigate replace to='/profile' />
    }

    console.log(`My API URL ${apiURL}`);
    console.log(_id);

    //Function that posts form data to the API
    async function loginUser(credentials) {
        try {
            const res = await axios.post('http://localhost:8080/api/v1/users/login', credentials);
            console.log(res.data);
            return res.data;

        } catch (err) {
            console.log(err);
            return null
        }

    };

    //Handler function for form field change
    const handleChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setInputs(values => ({...values, [fieldName]: fieldValue}));
    }

    //Handler submit for the login form
    const handleSubmit = async (event) => {
        event.preventDefault();
        //alert(`you entered ${inputs.email} and ${inputs.password}`)

        let loginCredentials = {};

        loginCredentials.email = inputs.email;
        loginCredentials.password = inputs.password;

        console.log(`Login credentials: `);
        console.log(loginCredentials);

        const loginResponse = await loginUser(loginCredentials);
        console.log(`Login response:`);
        console.log(loginResponse);

        if (loginResponse == null) {
            alert(`That username and password is not valid!`);
        } else {
            // alert(`Your access token is: ${loginResponse.accessToken}`);
            setToken(loginResponse.accessToken);
            setID(loginResponse._id)
            navigate('/profile');
        }
    }

    return (      
        <div className="container-sm m-auto align-items-center" >
            <div className="row">
                <div className="col-sm-4 text-black">
                    <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                        <form method="post" onSubmit={handleSubmit}>
                            <h3 className="mb-3 pb-3" >Log in</h3>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="email">Email address
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        className="form-control form-control-lg" 
                                        value ={inputs.email || ""}
                                        onChange={handleChange}
                                        
                                        />
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="password">Password
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name= "password"
                                        className="form-control form-control-lg" 
                                        value={inputs.password || ""}
                                        onChange={handleChange}
                                        />
                                </label>
                            </div>
                            <div className="pt-1 mb-4">
                                <button className="btn btn-info btn-lg btn-block" type="submit" value="Log In">Login</button>
                            </div>
                            <p className="small mb-5 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
                            <p>Don't have an account? <span onClick={() => navigate('/profile')} className="link-info">Register here</span></p>
                        </form>
                    </div>
                </div>
                <div class="col-sm-6 px-0 d-none d-sm-block">
                    <img src="./images/music.jpeg"
                    alt="Login image" class="w-100 vh-98"/>
                </div>
            </div>       
        </div>
    )
}