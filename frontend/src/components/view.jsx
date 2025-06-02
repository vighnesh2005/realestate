import { useContext, useEffect, useState } from 'react';
import { context } from '../context/context.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Maps from "./maps.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

function View() {
  const { userId, isLoggedIn } = useContext(context);
  const property_id = parseInt(useParams().property_id, 10);
  const url = import.meta.env.VITE_URL;

  const [photos, setPhotos] = useState([]);
  const [property, setProperty] = useState({});
  const [reviews, setReviews] = useState([]);
  const [liked, setLiked] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.post(
          `${url}/api/search/view`,
          {
            userid: userId,
            isLoggedIn: isLoggedIn,
            propertyid: property_id,
          },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        );

        setPhotos(results.data.photos || []);
        setProperty(results.data.details || {});
        setReviews(results.data.reviews || []);
        setLiked(isLoggedIn === true ? results.data.details.liked : false);
      } catch (error) {
        console.error("Error in View component:", error);
      }
    };
    fetchData();
  }, [userId, isLoggedIn, property_id, url]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Please login to like properties.");
      return;
    }

    setLiked((prev) => !prev);
    try {
      if (liked) {
        await axios.post(
          `${url}/api/props/dislike`,
          { property_id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        await axios.post(
          `${url}/api/props/like`,
          { property_id },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      // Revert if request fails
      setLiked((prev) => !prev);
    }
  };

  const showPrevPhoto = () => {
    setPhotoIndex((idx) => (idx === 0 ? photos.length - 1 : idx - 1));
  };

  const showNextPhoto = () => {
    setPhotoIndex((idx) => (idx === photos.length - 1 ? 0 : idx + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const results = await axios.post(
        `${url}/api/review/addreview`,
        {
          propertyid: property_id,
          rating,
          review,
        },
        {
          withCredentials: true,
        }
      );
      setReviews(results.data.reviews);
      setReview("");
      setRating(1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">Property Details</h1>

      {/* Photo Carousel & Like Button */}
      {photos.length > 0 && (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
          <img
            src={photos[photoIndex].url}
            alt={`Property photo ${photoIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Prev/Next Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={showPrevPhoto}
                aria-label="Previous photo"
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
              >
                <span className="text-xl font-semibold">&#8592;</span>
              </button>
              <button
                onClick={showNextPhoto}
                aria-label="Next photo"
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
              >
                <span className="text-xl font-semibold">&#8594;</span>
              </button>
            </>
          )}

          {/* Like Icon */}
          <span
            onClick={handleLike}
            title={
              !isLoggedIn
                ? "Login to like"
                : liked
                ? "Unlike this property"
                : "Like this property"
            }
            className={`
              absolute top-2 right-2 p-2 rounded-full cursor-pointer transition-colors
              ${liked
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-white bg-opacity-80 text-gray-600 hover:bg-gray-100"}
            `}
          >
            <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} size="lg" />
          </span>
        </div>
      )}

      {/* Basic Property Details */}
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">{property.title}</h2>
        <p className="text-gray-600">{property.description}</p>
        <div className="flex flex-wrap gap-4 text-gray-700">
          <div>
            <span className="font-semibold">Owner: </span>
            {property.owner}
          </div>
          <div>
            <span className="font-semibold">Price: </span>₹ {property.price}
          </div>
          <div>
            <span className="font-semibold">Phone: </span>
            {property.phoneno}
          </div>
        </div>
      </div>

      {/* Address & Additional Info */}
      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
          <p className="text-gray-600">{property.address}</p>
          <p className="text-gray-600">
            {property.city}, {property.state}, {property.zipcode}, {property.country}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
          <ul className="text-gray-600 space-y-1">
            <li>
              <span className="font-semibold">Type: </span>
              {property.type}
            </li>
            <li>
              <span className="font-semibold">Category: </span>
              {property.category}
            </li>
            <li>
              <span className="font-semibold">Bedrooms: </span>
              {property.bedrooms}
            </li>
            <li>
              <span className="font-semibold">Description: </span>
              {property.description}
            </li>
          </ul>
        </div>
      </div>

      {/* Map Location */}
      {property.latitude && property.longitude && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Location on Map</h3>
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <Maps
              initialPosition={{
                lat: Number(property.latitude),
                lng: Number(property.longitude),
              }}
              marker={true}
              readOnly={true}
              // Note: If Maps expects a style prop, you can remove it. 
              // The container div handles sizing via Tailwind.
            />
          </div>
        </div>
      )}

      {/* Add a Review Form */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Add Your Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              id="review-text"
              name="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>
          <div>
            <label className="font-medium text-gray-700 mr-4">Rating:</label>
            <div className="inline-flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="rating"
                    value={num}
                    checked={rating === num}
                    onChange={() => setRating(num)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <span className="text-gray-700">{num}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Existing Reviews */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((rev, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 border-b border-gray-200 pb-4 last:border-none last:pb-0"
            >
              <img
                src={
                  rev.profilepic
                    ? rev.profilepic
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="profile"
                className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-200"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    {rev.username || "User"}
                  </span>
                  <span className="text-yellow-500 font-medium">
                    Rating: {rev.rating}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{rev.review}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default View;
