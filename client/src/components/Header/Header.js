import 'src/components/Header/Header.css';


function Header () {

    return (
    
        <nav className="nav justify-content-start">
            
            <img className="img-thumbnail" src="./images/logo.png" alt="Logo" id="logo" />
        
            <li className="nav-item">
                Home
            </li>
            
            <li className="nav-item">
                Resgister
            </li> 
            <li className="nav-item">
                Login
            </li>   
                            
        </nav>
    )
}

export default Header;