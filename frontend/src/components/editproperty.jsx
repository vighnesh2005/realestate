import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "../styles/addproperty.css";
import Maps from "./maps.jsx";
import { Upload, Delete } from "../upload.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Editproperty() {
  const [images, setImages] = useState([]); // Only URLs
  const [newImages, setNewImages] = useState([]); // Only File objects
  const [removedImages, setRemovedImages] = useState([]); // URLs to delete
  const fileInputRef = useRef();
  const [latitude, setLatitude] = useState(39.781700);
  const [longitude, setLongitude] = useState(-89.650100);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;
  const id = parseInt(useParams().id);
  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    price: "",
    description: "",
    type: "",
    bedrooms: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const func = async () => {
      try {
        const result = await axios.post(
          `${url}/api/search/view`,
          { propertyid: id },
          { withCredentials: true }
        );
        setForm({
          title: result.data.details.title || "",
          address: result.data.details.address || "",
          city: result.data.details.city || "",
          state: result.data.details.state || "",
          postal_code: result.data.details.postal_code || "",
          country: result.data.details.country || "",
          price: result.data.details.price || "",
          description: result.data.details.description || "",
          type: result.data.details.type || "",
          bedrooms: result.data.details.bedrooms || "",
          category: result.data.details.category || "",
          user_id : result.data.details.user_id || ""
        });
        setLatitude(Number(result.data.details.latitude) || 39.781700);
        setLongitude(Number(result.data.details.longitude) || -89.650100);
        setImages((result.data.photos || []).map(img => img.url || img));
        setNewImages([]);
        setRemovedImages([]);
      } catch (error) {
        console.log(error);
      }
    };
    func();
    // eslint-disable-next-line
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev =>
      [...prev, ...files.filter(f => !prev.some(img => img.name === f.name && img.size === f.size))]
    );
    e.target.value = "";
  };

  // Remove image (existing URL)
  const handleRemoveImage = (idx) => {
    const url = images[idx];
    setRemovedImages(prev => [...prev, url]);
    setImages(images.filter((_, i) => i !== idx));
  };

  // Remove new image (File)
  const handleRemoveNewImage = (idx) => {
    setNewImages(newImages.filter((_, i) => i !== idx));
  };

  // Handle map position change
  const handleMapChange = ({ lat, lng }) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  // Handle submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Delete removed images from Cloudinary
    for (const url of removedImages) {
      await Delete(url);
    }

    // 2. Upload new images (File objects)
    let uploadedUrls = [];
    for (const file of newImages) {
      const url = await Upload(file);
      if (url) uploadedUrls.push(url);
    }

    // 3. Combine all URLs for backend
    const allUrls = [...images, ...uploadedUrls];

    // 4. Send update to backend
    await axios.post(
      `${url}/api/edit/editprop`,
      {
        id: id,
        ...form,
        latitude,
        longitude,
        pictures: allUrls,
      },
      { withCredentials: true }
    );

    // 5. Update state to reflect only URLs,  clear newImages and removedImages
    setImages(allUrls);        // <-- Now images is only URLs
    setNewImages([]);          // <-- Clear newImages
    setRemovedImages([]);      // <-- Clear removedImages

    alert("Property updated!");
    navigate(`/myproperties`);
  } catch (err) {
    alert("Failed to update property.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-10">
    <form className="addproperty-form" onSubmit={handleSubmit}>
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
            <img src={img} alt={`preview-${idx}`} />
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
        {newImages.map((file, idx) => (
            <div className="image-preview-item" key={`new-${idx}`}>
            <img src={URL.createObjectURL(file)} alt={`preview-new-${idx}`} />
            <button
                type="button"
                className="remove-image-btn"
                onClick={() => handleRemoveNewImage(idx)}
                title="Remove"
            >
                &times;
            </button>
            </div>
        ))}
        </div>
      <label>Title</label>
      <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="title" required />
      <label>Address</label>
      <textarea name="address" value={form.address} onChange={handleChange} placeholder="add address" required />
      <label>City</label>
      <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="city" required />
      <label>State</label>
      <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="state" required />
      <label>Postal Code</label>
      <input type="text" name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="postal code" required />
      <label>Country</label>
      <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="country" required />
      <div className="form-group">
        <label>Location</label>
        <Maps
          onPositionChange={handleMapChange}
          initialPosition={{ lat: latitude, lng: longitude }}
        />
        <div className="map-coords">
          <strong>Latitude:</strong> {latitude} &nbsp;
          <strong>Longitude:</strong> {longitude}
        </div>
      </div>
      <label>Price</label>
      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="price" required />
      <label>Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="description" required />
      <label>Type</label>
      <select name="type" value={form.type} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="rent">Rent</option>
        <option value="sale">Sale</option>
        <option value="pg">PG</option>
      </select>
      <label>Bedrooms</label>
      <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="number of bedrooms" required />
      <label>Category</label>
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="house">House</option>
        <option value="villa">Villa</option>
        <option value="mansion">Mansion</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Property"}</button>
    </form>
    </div>
  );
}

export default Editproperty;