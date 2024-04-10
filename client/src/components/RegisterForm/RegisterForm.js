import React, { useState } from 'react';

const RegisterForm = () => {
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
      const response = await fetch('http://localhost:8080/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Registration successful, redirect or display success message
        console.log('Registration successful');
      } else {
        // Registration failed, display error message
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      <div className='container-sm'>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input
              type="name"
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
    </div>
  )
}
export default RegisterForm;
