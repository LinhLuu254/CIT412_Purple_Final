import 'src/components/Header/Header.css';
import { Link as RouterLink } from 'react-router-dom';


function Header () {

    return (
    
        <nav className="nav justify-content-start">
            <ul className="navbar-nav">
                <li className="nav-item">
                    Home
                </li>
                <li className="nav-item">
                    <RouterLink to='/register' className='Header-link'>
                        Register
                    </RouterLink>
                </li>
                <li className="nav-item">
                    Login
                </li>
            </ul>                   
        </nav>
    )
}

export default Header;