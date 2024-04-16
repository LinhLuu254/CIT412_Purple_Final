import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIURLContext } from 'src/contexts/APIURLContext';
import axios from 'axios';
import useToken from 'src/hooks/useToken';
import { Navigate } from 'react-router-dom';

export default function LoginForm() {
    const [inputs, setInputs] = useState({});
    const apiURL = useContext(APIURLContext);
    const {token, setToken} = useToken();
    const navigate = useNavigate();

    if (token) {
        return <Navigate replace to='/profile'/>
    }

    async function loginUser(credentials) {
        try{
            let res = await axios.post(apiURL + '/users/login', credentials);
            localStorage.setItem('local_ID', JSON.stringify(res.data._id));
            return res.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    const handleChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setInputs(values => ({...values, [fieldName]: fieldValue}));
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        let loginCredentials = {};
        loginCredentials.email = inputs.email;
        loginCredentials.password = inputs.password;
        const loginResponse = await loginUser(loginCredentials);
        if (loginCredentials == null) {
            alert('Check Input!');
        } else {
            try{
                setToken(loginResponse.accessToken);
                navigate('/profile');
            } catch (err) {
                alert('Check Input!');
            }
        }
    }

    return (
        <div className='container-sm'>
            <form action="post" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        className='form-control'
                        placeholder='email@email.com'
                        value={inputs.email || ""}
                        name="email"
                        onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        className='form-control'
                        placeholder='password'
                        value={inputs.password}
                        name="password"
                        onChange={handleChange} />
                </div>
            </form>       
        </div>
    )
}