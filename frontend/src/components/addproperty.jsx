import React, { useRef, useState } from "react";
import "../styles/addproperty.css";
import Maps from "./maps.jsx";
import { Upload } from "../upload.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Addproperty() {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();
  const [latitude, setLatitude] = useState(39.781700);
  const [longitude, setLongitude] = useState(-89.650100);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev =>
      [...prev, ...files.filter(f => !prev.some(img => img.name === f.name && img.size === f.size))]
    );
    e.target.value = "";
  };

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Wait for all uploads  to finish and get the URLs
  const pictures = await Promise.all(images.map(img => Upload(img)));

  try {
    const url = import.meta.env.VITE_URL;
    const response = await axios.post(`${url}/api/props/addproperty`, {
      title: e.target.title.value,
      address: e.target.address.value,
      city: e.target.city.value,
      state: e.target.state.value,
      postal_code: e.target.postal_code.value,
      country: e.target.country.value,
      latitude,
      longitude,
      price: parseFloat(e.target.price.value),
      description: e.target.description.value,
      type: e.target.type.value,
      user_id: localStorage.getItem("userId"),
      bedrooms: parseInt(e.target.bedrooms.value),
      category: e.target.category.value,
      pictures, // array of URLs
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      alert("Property added successfully!");
      e.target.reset();
      setImages([]);
      fileInputRef.current.value = null;
      navigate("/");
    } else {
      alert("Failed to add property. Please try again.");
    }
  } catch (error) {
    console.error("Error adding property:", error);
    alert("An error occurred while adding the property.");
  }
};

  return (
    <div className="p-10">
    <form className="addproperty-form " onSubmit={handleSubmit}>
        <label className="custom-file-label" htmlFor="image-upload">
        Choose Images
        </label>
        <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={fileInputRef}
        />
      <div className="image-preview-list">
        {images.map((img, idx) => (
          <div className="image-preview-item" key={idx}>
            <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => handleRemoveImage(idx)}
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      {/* ...rest of your form fields... */}
      <label>Title</label>
      <input type="text" name="title" placeholder="title" required />
      <label>Address</label>
      <textarea name="address" placeholder="add address" required></textarea>
      <label>City</label>
      <input type="text" name="city" placeholder="city" required />
      <label>State</label>
      <input type="text" name="state" placeholder="state" required />
      <label>Postal Code</label>
      <input type="text" name="postal_code" placeholder="postal code" required />
      <label>Country</label>
      <input type="text" name="country" placeholder="country" required />
<div className="form-group">
  <label>Location</label>
  <Maps
    onPositionChange={({ lat, lng }) => {
      setLatitude(lat);
      setLongitude(lng);
    }}
    initialPosition={{ lat: latitude, lng: longitude }}
  />
  <div className="map-coords" style={{marginTop: "8px", color: "#666", fontSize: "0.98em"}}>
    <strong>Latitude:</strong> {latitude} &nbsp;
    <strong>Longitude:</strong> {longitude}
  </div>
</div>
      <label>Price</label>
      <input type="number" name="price" placeholder="price" required />
      <label>Description</label>
      <textarea name="description" placeholder="description" required></textarea>
      <label>Type</label>
      <select name="type" required>
        <option value="rent">Rent</option>
        <option value="sale">Sale</option>
        <option value="pg">PG</option>
      </select>
      <label>Bedrooms</label>
      <input type="number" name="bedrooms" placeholder="number of bedrooms" required />
      <label>Category</label>
      <select name="category" required>
        <option value="house">House</option>
        <option value="villa">Villa</option>
        <option value="mansion">Mansion</option>
      </select>
      <button type="submit">Add Property</button>
    </form>
    </div>
  );
}

export default Addproperty;