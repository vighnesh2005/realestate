import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyPropertyCard({ data }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const url = import.meta.env.VITE_URL;

  const handledelete = async () => {
    try {
      const results = await axios.post(
        `${url}/api/edit/deleteprop`,
        {
          propertyId: data.id,
        },
        {
          withCredentials: true,
        }
      );
      if (results.data.message === "success") setIsDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!isDeleted && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row m-10">
          {/* Image + Category Badge */}
          <div className="relative w-full md:w-1/3 h-52 md:h-auto">
            <img
              src={data.image}
              alt="property"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded-full text-sm font-semibold">
              {data.category}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col justify-between flex-1">
            {/* Price & Title */}
            <div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                ₹ {data.price}
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {data.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-3">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>
                  {data.address}, {data.city}, {data.state}
                </span>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-bed"></i>
                  <span>{data.bedrooms} BHK</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-building"></i>
                  <span>{data.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-user"></i>
                  <span>{data.owner}</span>
                </div>
              </div>
            </div>

            {/* Actions (Edit / Delete) */}
            <div className="flex gap-4">
              <Link
                to={`/editprop/${data.id}`}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </Link>
              <button
                onClick={handledelete}
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
              >
                <i className="fas fa-trash"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyPropertyCard;
