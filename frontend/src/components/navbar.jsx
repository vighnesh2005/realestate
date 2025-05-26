import { useContext, useState } from "react";
import axios from 'axios';
import { context } from '../context/context.js';

function Navbar(){
    const {isLoggedIn,setIsLoggedIn} = useContext(context);
    const url = import.meta.env.VITE_URL; 
        const handleLogout = async ()=>{
            try {
                console.log(url);
                const result = await axios.post(`${url}/api/auth/logout`, {}, {
                    withCredentials: true,
                    headers: {
                    "Content-Type": "application/json",
                    }  
                });
                if(result.data.message === "Logout successfull"){
                    alert("Loggout Successfull");
                    setIsLoggedIn(false);
                }        
            } catch (error) {
                alert("loggout failed");
                console.log(error);
            }
        }
    return(
        <>
        <nav className="navbar">
            <a href="" className="links"><h1>Homely</h1></a>
            <a href="" className="links">home</a>
            <a href="" className="links">Liked properties   </a>
            <a href="" className="links">buy</a>
            <a href="" className="links">pg</a>
            <a href="" className="links">rent</a>

            {
        !isLoggedIn ? (
            <div className="buttons">
            <a href="/login" className="a">Login</a>
            <a href="/signup" className="b">Register</a>
            </div>
        ) : (
            <div className="buttons">
            <a href="/profile" className="a">Profile</a>
            <button href="/logout" className="b" onClick={handleLogout}>Logout</button>
            </div>
        )
        }
        </nav>
        </>
    )
}

export default Navbar;