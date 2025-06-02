import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Maps from './maps';
import Resultprop from './resultprop';
import axios from 'axios';
import { context } from '../context/context';

function Results() {
  const { type } = useParams();
  const { isLoggedIn, userId } = React.useContext(context);

  const [priceLow, setPriceLow] = useState('');
  const [priceHigh, setPriceHigh] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState(15.8054452);
  const [longitude, setLongitude] = useState(78.0387213);
  const [properties, setProperties] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // hidden by default on small screens

  const handleMapPositionChange = (pos) => {
    setLatitude(pos.lat);
    setLongitude(pos.lng);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const url = import.meta.env.VITE_URL;
        const id = userId;
        const result = await axios.post(
          `${url}/api/search/search`,
          { type, isLoggedIn, id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setProperties(result.data);
      } catch (err) {
        console.error("Initial fetch error:", err);
      }
    };
    fetchInitialData();
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = import.meta.env.VITE_URL;
      const result = await axios.post(
        `${url}/api/search/search`,
        {
          type,
          priceLow,
          priceHigh,
          bedrooms,
          category,
          latitude,
          longitude,
          isLoggedIn,
          id: userId,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setProperties(result.data);
      setSidebarOpen(false); // close sidebar after submit on small screens
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar toggle button - visible only on small screens */}
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 z-[9999] p-3 bg-blue-600 text-white rounded-md shadow-lg md:hidden"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <form
        onSubmit={handleSubmit}
        className={`
          fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 p-4 space-y-4 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:block md:w-80 z-[1000]
        `}
      >
        <h2 className="text-lg font-semibold">Filter Properties</h2>

        <div>
          <label className="block mb-1 font-medium">Price Range:</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceLow}
              onChange={(e) => setPriceLow(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceHigh}
              onChange={(e) => setPriceHigh(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Bedrooms:</label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="bedrooms"
                  value={num}
                  checked={bedrooms === num}
                  onChange={() => setBedrooms(num)}
                />
                <span>{num}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Category:</label>
          <div className="flex flex-wrap gap-2">
            {['house', 'villa', 'mansion'].map((item) => (
              <label key={item} className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="category"
                  value={item}
                  checked={category === item}
                  onChange={() => setCategory(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Maps
            onPositionChange={handleMapPositionChange}
            initialPosition={{ lat: latitude, lng: longitude }}
          />
          <div className="mt-2 text-sm text-gray-600">
            <div>
              <strong>Latitude:</strong> {latitude}
            </div>
            <div>
              <strong>Longitude:</strong> {longitude}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </form>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {properties.map((property) => (
              <Resultprop key={property.id} data={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No properties found</div>
        )}
      </main>
    </div>
  );
}

export default Results;
