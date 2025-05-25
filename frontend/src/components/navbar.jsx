import { useState } from "react";

function Navbar(){
    const [city,setCity] = useState("city");
    return(
        <>
        <nav className="navbar">
            <a className="logo">plotly</a>
            <div classname="CITY">
                <button className="buyin">buy in {city}</button>
                <div className="content">
                    <input type="text" placeholder="Enter a city name"/>
                    <button>confirm</button>
                </div>
            </div>
            <form className="search">
                <input type="text" />
                <select name="buy" id="buy">
                    <option value="rent">buy</option>
                    <option value="pg">pg</option>
                    <option value="buy">buy</option>
                </select>
            </form>
        </nav>
        </>
    )
}

export default Navbar;