import React, { useState, useContext } from 'react';
import { APIURLContext } from 'src/contexts/APIURLContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {

  const apiURL = useContext(APIURLContext);
  const navigate = useNavigate();

  // State to hold form field values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    name: ''
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to server
      const response = await fetch(apiURL + '/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Registration successful, redirect and display success message
        alert(`Registration successful`);
        console.log('Registration successful');
        navigate('/login');

      } else {
        // Registration failed
        alert(`Registration failed, check your input`);
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className='container-sm align-items-center m-3' id="register">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input 
              type="name" 
              name="name"
              className="form-control" 
              id="InputName" 
              aria-describedby="name" 
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={handleChange}
            />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input 
            type="email" 
            name="email"
            className="form-control" 
            id="InputEmail1" 
            aria-describedby="email" 
            placeholder="Enter email" 
            value={formData.email}
            onChange={handleChange} 
            />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="InputPassword"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="phone"
            name="phone"
            className="form-control"
            id="InputPhone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
          <br></br>
          <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  )
}
export default RegisterForm;
