import { useContext, useState } from "react";
import axios from 'axios';
import { context } from '../context/context.js';
import { Link } from 'react-router-dom';

function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(context);
    const url = import.meta.env.VITE_URL;
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const result = await axios.post(`${url}/api/auth/logout`, {}, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (result.data.message === "Logout successfull") {
                alert("Loggout Successfull");
                setIsLoggedIn(false);
            }
        } catch (error) {
            alert("loggout failed");
            console.log(error);
        }
    }

    const handleMenuToggle = () => setMenuOpen(prev => !prev);

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="links logo"><h1>Homely</h1></Link>
                <button className="navbar-toggle" onClick={handleMenuToggle}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
                <div className={`navbar-links${menuOpen ? " open" : ""}`}>
                    <Link to="/" className="links">Home</Link>
                    {isLoggedIn ? (<Link to="/likedprops" className="links">Liked properties</Link>) : null}
                    <Link to="/results/sale" className="links">buy</Link>
                    <Link to="/results/pg" className="links">pg</Link>
                    <Link to="/results/rent" className="links">rent</Link>
                    {isLoggedIn ? (<Link to="/addproperty" className="links">add property</Link>) : null}
                    {isLoggedIn ? (<Link to="/myproperties" className="links">My properties</Link>) : null}
                    {
                        !isLoggedIn ? (
                            <div className="buttons">
                                <Link to="/login" className="a">Login</Link>
                                <Link to="/signup" className="b">Register</Link>
                            </div>
                        ) : (
                            <div className="buttons">
                                <Link to="/profile" className="a">Profile</Link>
                                <button className="b" onClick={handleLogout}>Logout</button>
                            </div>
                        )
                    }
                </div>
            </nav>
        </>
    )
}

export default Navbar;