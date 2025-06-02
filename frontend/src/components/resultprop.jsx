import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { context } from "../context/context";
import axios from "axios";

function Resultprop({ data }) {
  const { isLoggedIn } = useContext(context);
  const [liked, setLiked] = useState(isLoggedIn === true ? data.liked : false);

  // Whenever data.liked or login status changes, keep liked in sync
  useEffect(() => {
    if (isLoggedIn) {
      setLiked(data.liked);
    } else {
      setLiked(false);
    }
  }, [data.liked, isLoggedIn]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Please login to like properties.");
      return;
    }

    // Optimistically toggle:
    setLiked((prev) => !prev);

    const url = import.meta.env.VITE_URL;
    try {
      if (liked) {
        // Was previously liked, now "unliking"
        await axios.post(
          `${url}/api/props/dislike`,
          { property_id: data.id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Was not liked, now "liking"
        await axios.post(
          `${url}/api/props/like`,
          { property_id: data.id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      // If the request fails, revert to previous state:
      setLiked((prev) => !prev);
    }
  };

  return (
    <Link
      to={`/view/${data.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{ textDecoration: "none" }}
    >
      <div className="m-10 bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-200">
        {/* Image Container */}
        <div className="relative w-full md:w-1/3 h-48 md:h-auto">
          <img
            src={data.image}
            alt="property"
            className="w-full h-full object-cover"
          />
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLike();
            }}
            title={
              !isLoggedIn
                ? "Login to like"
                : liked
                ? "Unlike this property"
                : "Like this property"
            }
            className={`absolute top-2 right-2 p-2 rounded-full cursor-pointer ${
              liked
                ? "bg-red-100 text-red-600"
                : "bg-white bg-opacity-80 text-gray-600 hover:bg-gray-100"
            } transition-colors duration-150`}
          >
            <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col justify-between flex-1">
          {/* Header (Title + Address) */}
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {data.title}
            </h2>
            <p className="text-sm text-gray-600">
              {data.address}, {data.city}, {data.state}
            </p>
          </div>

          {/* Details */}
          <div className="text-gray-700 space-y-1 text-sm mb-4">
            <div>
              <strong>RS: </strong>₹ {data.price}
            </div>
            <div>
              <strong>Category: </strong> {data.category}
            </div>
            <div>
              <strong>Bedrooms: </strong> {data.bedrooms} BHK
            </div>
            <div>
              <strong>Owner: </strong> {data.owner}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Resultprop;
