import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix marker icon issue with leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

// Component to keep map centered on marker
function MapFollower({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
}

function Maps({ onPositionChange, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || { lat: 28.6139, lng: 77.209 });
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const markerRef = useRef();
  const debounceRef = useRef();

  useEffect(() => {
    if (onPositionChange) onPositionChange(position);
  }, [position, onPositionChange]);
  // Debounced autocomplete handler using Nominatim
  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (value.length > 2) {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}`
        );
        setSuggestions(res.data);
      } else {
        setSuggestions([]);
      }
    }, 150);
  };

  // When user selects a suggestion
  const handleSelect = (place) => {
    setPosition({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });
    setQuery(place.display_name);
    setSuggestions([]);
  };

  // Handle marker drag
  const handleDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const latlng = marker.getLatLng();
      setPosition({ lat: latlng.lat, lng: latlng.lng });
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInput}
        placeholder="Search location"
        style={{ width: "300px", marginBottom: "10px" }}
      />
      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, background: "#fff", border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto" }}>
          {suggestions.map((place, idx) => (
            <li
              key={place.place_id || idx}
              onClick={() => handleSelect(place)}
              style={{ cursor: "pointer", padding: "5px" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
      <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: handleDragEnd,
          }}
          ref={markerRef}
        />
        <LocationMarker setPosition={setPosition} />
        <MapFollower position={position} />
      </MapContainer>
    </div>
  );
}

export default Maps;