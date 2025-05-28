import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Maps from './maps';
import '../styles/results.css';
import axios from 'axios';
import Resultprop from './resultprop';
import { context } from '../context/context'; 

function Results() {
  let {type} = useParams();
  const [priceLow, setPriceLow] = useState('');
  const [priceHigh, setPriceHigh] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState( 15.8054452);
  const [longitude, setLongitude] = useState( 78.0387213);
  const [properties, setProperties] = useState([]);
  const { isLoggedIn , userId } = React.useContext(context);

  // Handler to receive position from Maps component
  const handleMapPositionChange = (pos) => {
    setLatitude(pos.lat);
    setLongitude(pos.lng);
  };

  useEffect(() => {
    try {
      const fetchInitialData = async () => {
        const url = import.meta.env.VITE_URL;
        
          const id  = userId;
        const result = await axios.post(`${url}/api/search/search`, 
            {
            type,
            isLoggedIn,
            id
          },
        {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            }
        });
        setProperties(result.data);
        console.log("Properties fetched:", result.data);
        console.log(userId, isLoggedIn);
      }
      
      fetchInitialData();

    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_URL;
    
    const id  = userId;

    try {
      const result = await axios.post(`${url}/api/search/search`,{
        type,
        priceLow,
        priceHigh,
        bedrooms,
        category,
        latitude,
        longitude,
        isLoggedIn,
        id
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      });

      setProperties(result.data);
      console.log("Filtered properties:", result.data);
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }

  };

  return (
    <div className="results-page-container">
      <form
        onSubmit={handleSubmit}
        className="results-sidebar"
      >
        <div>
          <h3>Filter Properties</h3>
          {/* Price Range */}
          <label>Price Range:</label>
          <div className="price-range-group">
            <input
              type="number"
              placeholder="Min"
              value={priceLow}
              onChange={e => setPriceLow(e.target.value)}
            />
            <span style={{ alignSelf: 'center', color: '#888' }}>to</span>
            <input
              type="number"
              placeholder="Max"
              value={priceHigh}
              onChange={e => setPriceHigh(e.target.value)}
            />
          </div>
          {/* Bedrooms */}
          <label>Bedrooms:</label>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map(num => (
              <label key={num} className="radio-custom">
                <input
                  type="radio"
                  name="bedrooms"
                  value={num}
                  checked={bedrooms === num}
                  onChange={() => setBedrooms(num)}
                /> 
                <span className="custom-radio"></span>
                {num}
              </label>
            ))}
          </div>
          {/* Category */}
          <label>Type:</label>
          <div className="radio-group">
            {['house', 'villa', 'mansion'].map(type => (
              <label key={type} className="radio-custom">
                <input
                  type="radio"
                  name="category"
                  value={type}
                  checked={category === type}
                  onChange={() => setCategory(type)}
                />
                <span className="custom-radio"></span>
                {type}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Maps onPositionChange={handleMapPositionChange} initialPosition={{ lat: latitude, lng: longitude }} />
          <div className="map-coords">
            <strong>Latitude:</strong> {latitude} <br />
            <strong>Longitude:</strong> {longitude}
          </div>
        </div>
        <button type="submit">
          Apply Filters
        </button>
      </form>
        <div style={{ flex: 1 }}>
        {Array.isArray(properties) && properties.length > 0 ? (
            <div className="property-list">
            {properties.map(property => (
                <Resultprop key={property.id} data={property} />
            ))}
            </div>
        ) : (
            <div className="no-results">No properties found</div>
        )}
        </div>
    </div>
  );
}

export default Results;