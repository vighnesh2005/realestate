import { useContext, useEffect, useState } from 'react';
import { context } from '../context/context.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Maps from "./maps.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "../styles/view.css"

function View() {
    const { userId, isLoggedIn } = useContext(context);
    const property_id = parseInt(useParams().property_id);
    const url = import.meta.env.VITE_URL;
    const [photos, setPhotos] = useState([]);
    const [property, setProperty] = useState({});
    const [reviews, setReviews] = useState([]);
    const [liked, setLiked] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [review,setReview] = useState("");
    const [rating,setRating] = useState(1);

    useEffect(() => {
        const func = async () => {
            try {
                const results = await axios.post(`${url}/api/search/view`,
                    {
                        userid: userId,
                        isLoggedIn: isLoggedIn,
                        propertyid: property_id
                    },
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setPhotos(results.data.photos);
                setProperty(results.data.details);
                setReviews(results.data.reviews);
                setLiked(isLoggedIn === true ? results.data.details.liked : false);

            } catch (error) {
                console.error("Error in View component:", error);
            }
        };
        func();
    }, []);

    const handleLike = async () => {
        if (isLoggedIn !== true) {
            alert("Please login to like properties.");
            return;
        }
        setLiked(prev => !prev);
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
        }
    };

    const showPrevPhoto = () => {
        setPhotoIndex(idx => (idx === 0 ? photos.length - 1 : idx - 1));
    };

    const showNextPhoto = () => {
        setPhotoIndex(idx => (idx === photos.length - 1 ? 0 : idx + 1));
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const results = await axios.post(`${url}/api/review/addreview`,
                {
                    propertyid:property_id,
                    rating,
                    review
                },
                {
                    withCredentials:true,
                }
            );
            setReviews(results.data.reviews)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="view">
            <h1>Property Details</h1>
            <div className="photos" style={{ position: "relative", width: "fit-content", marginBottom: "24px" }}>
                {photos.length > 0 && (
                    <>
                        <img
                            src={photos[photoIndex].url}
                            alt={`Property photo ${photoIndex + 1}`}
                        />
                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={showPrevPhoto}
                                    aria-label="Previous photo"
                                >&#8592;</button>
                                <button
                                    onClick={showNextPhoto}
                                    aria-label="Next photo"
                                >&#8594;</button>
                            </>
                        )}
                        <span
                            className={`view-like-icon${liked ? " liked" : ""}`}
                            onClick={handleLike}
                            title={isLoggedIn !== true ? "Login to like" : liked ? "Unlike" : "Like"}
                        >
                            <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
                        </span>
                    </>
                )}
            </div>
            <div className="property-details">
                <h2>{property.title}</h2>
                <p>{property.description}</p>
                <p>Owner: {property.owner}</p>
                <p>price: {property.price}</p>
                <p>Phone: {property.phoneno}</p>
            </div>

            <div className='description'>
                <h2>address : {property.address}</h2>
                <p>City: {property.city}</p>
                <p>State: {property.state}</p>
                <p>Zip Code: {property.zipcode}</p>
                <p>Country: {property.country}</p>
                <p>Type: {property.type}</p>
                <p>Bedrooms: {property.bedrooms}</p>
                <p>category: {property.category}</p>
                <p>Description:{property.description}</p>
            </div>
            {property.latitude && property.longitude && (
                <div style={{ margin: "32px 0" }}>
                    <h3>Location on Map</h3>
                    <Maps
                        initialPosition={{
                            lat: Number(property.latitude),
                            lng: Number(property.longitude)
                        }}
                        marker={true}
                        style={{ height: "320px", width: "100%", borderRadius: "12px" }}
                        readOnly={true}
                    />
                </div>
            )}
            <br />
            {/*     add reviev   */}
            <div className="addreview" style={{ fontWeight: "bold" }}>
            <label htmlFor="review-text">Add your review</label>
            <form onSubmit={handleSubmit}>
                <textarea
                id="review-text"
                name="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Add your review....."
                style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
                required
                ></textarea>
                <div style={{ marginBottom: "10px" }}>
                <label style={{ marginRight: "10px" }}>Rating:</label>
                {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num} style={{ marginRight: "8px" }}>
                    <input
                        type="radio"
                        name="rating"
                        value={num}
                        checked={Number(rating) === num}
                        onChange={() => setRating(num)}
                        required
                        style={{ marginRight: "3px" }}
                    />
                    {num}
                    </label>
                ))}
                </div>
                <button
                type="submit"
                style={{
                    padding: "8px 18px",
                    fontWeight: 600,
                    background: "#1a237e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
                >
                Submit Review
                </button>
            </form>
            </div>
            
            {/*   reviews   */}
            <div className="reviews">
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                    <div key={index} className="review" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                        <img
                        src={review.profilepic ? review.profilepic : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt="profile"
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            background: "#eee",
                            border: "1px solid #e3e6ee"
                        }}
                        />
                        <div>
                        <div style={{ fontWeight: 600, color: "#1a237e", marginBottom: "2px" }}>
                            {review.username || "User"}
                        </div>
                        <p style={{ margin: 0 }}>{review.review}</p>
                        <p style={{ margin: 0, color: "#e67e22", fontWeight: 500 }}>Rating: {review.rating}</p>
                        </div>
                    </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
                </div>
        </div>
    );
}

export default View;