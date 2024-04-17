import 'src/components/Header/Header.css';
import {Link as RouterLink } from 'react-router-dom';
import LogoutButton from '../LogoutButton/Logout';

function Header() {


    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light Header-wrapper">
                <div className="container-fluid">
                    <a href= "/" className='navbar-brand'>Books Findder</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className='nav-item'>
                                    <RouterLink to='/' className='Header-link'>Home</RouterLink>
                            </li>
                            <li className='nav-item'>
                                <RouterLink to='/register' className='Header-link'>Register</RouterLink>
                            </li>
                            <li className="nav-item">
                            {localStorage.getItem('accessToken') ? (
                                <LogoutButton />
                            ) : (
                                <RouterLink to='/login' className='Header-link'>
                                    Login
                                </RouterLink>
                            )}
                            </li>   
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header;