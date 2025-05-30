import { Link } from 'react-router-dom';
import { context } from '../context/context.js';
import { useContext } from 'react';

function Dashboard(){
    // const {setIsLoggedIn} = useContext(context);
    // setIsLoggedIn(false);
    return (
        <>
        
        <div className="Hero">
            <h1>Buy Your Dream House With Us</h1>
            <Link to="/results/sale">Explore</Link>
        </div>
          <div className="dashboard-stats">
            <div className="stat-box">
            <h2>100,000+</h2>
            <p>Homes Sold</p>
            </div>
            <div className="stat-box">
            <h2>15,000</h2>
            <p>Active Listings</p>
            </div>
            <div className="stat-box">
            <h2>40000+</h2>
            <p>Happy Clients</p>
            </div>
        </div>
        </>
    )
}

export default Dashboard;