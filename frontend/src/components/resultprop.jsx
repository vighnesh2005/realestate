import { Link } from "react-router-dom";
import { useState, useContext,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { context } from "../context/context";
import axios from "axios";

function Resultprop({ data }) {
  const { isLoggedIn } = useContext(context);
  const [liked, setLiked] = useState(isLoggedIn === true ? data.liked : false);

  // Sync liked state with data.liked when data or login changes


  const handleLike = async () => {
    if (isLoggedIn !== true) {
      alert("Please login to like properties.");
      return;
    }
    const url = import.meta.env.VITE_URL;
    setLiked((prev) => !prev);

    try {
      if (liked) {
        await axios.post(
          `${url}/api/props/dislike`,
          { property_id: data.id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Property unliked:");
      } else {
        await axios.post(
          `${url}/api/props/like`,
          { property_id: data.id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Property liked:");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <Link to={`/view/${data.id}`} className="property-link" style={{textDecoration:"none"}}>
    <div className="property-card">
      <div className="property-img-container">
        <img src={data.image} alt="property" className="property-img" />
        <span
          className={`property-like-icon${liked ? " liked" : ""}`}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleLike();
          }}
          title={isLoggedIn !== true ? "Login to like" : liked ? "Unlike" : "Like"}
        >
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
        </span>
      </div>

      <div className="property-content">
        <div className="property-header">
          <h2>{data.title}</h2>
          <p>{data.address}</p>
        </div>

        <div className="property-details">
          <div>
            <strong>RS: {data.price}</strong>
          </div>
          <div>City: {data.city}</div>
          <div>State: {data.state}</div>
          <div>Category: {data.category}</div>
          <div>Bedrooms: {data.bedrooms} BHK</div>
          <div>Owner: {data.owner}</div>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default Resultprop;