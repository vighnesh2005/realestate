import Maps from './maps';
function Dashboard(){
    return (
        <>
        <div className="Hero">
            <h1>Buy Your Dream House With Us</h1>
            <a href="">Explore</a>
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
        <Maps></Maps>
        </>
    )
}

export default Dashboard;