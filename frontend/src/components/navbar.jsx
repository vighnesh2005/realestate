import { useContext, useState } from "react";
import axios from 'axios';
import { context } from '../context/context.js';
import { Link } from 'react-router-dom';

function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(context);
    const url = import.meta.env.VITE_URL;

    const handleLogout = async () => {
        try {
            console.log(url);
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

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="links"><h1>Homely</h1></Link>
                <Link to="/" className="links">Home</Link>
                {isLoggedIn ? (<Link to="/likedprops" className="links">Liked properties</Link>) : (<div></div>)}

                <Link to="/results/sale" className="links">buy</Link>
                <Link to="/results/pg" className="links">pg</Link>
                <Link to="/results/rent" className="links">rent</Link>
                {isLoggedIn ? (<Link to="/addproperty" className="links">add property</Link>) : (<div></div>)}
                {isLoggedIn ? (<Link to="/myproperties" className="links">My properties</Link>) : (<div></div>)}
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
            </nav>
        </>
    )
}

export default Navbar;
