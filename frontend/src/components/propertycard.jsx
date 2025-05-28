import { Link } from "react-router-dom";

function MyPropertyCard({ data }) {
  return (
    <div className="myproperty-card-outer">
      <img
        src={data.image}
        alt="property"
        className="myproperty-card-img"
      />

      <div className="myproperty-card-body">
        <div className="myproperty-card-header">
          <h2 className="myproperty-card-title">{data.title}</h2>
          <p className="myproperty-card-address">{data.address}</p>
        </div>

        <div className="myproperty-card-details">
          <div><strong>RS: {data.price}</strong></div>
          <div>City: {data.city}</div>
          <div>State: {data.state}</div>
          <div>Category: {data.category}</div>
          <div>Bedrooms: {data.bedrooms} BHK</div>
          <div>Owner: {data.owner}</div>
        </div>

        <div className="myproperty-card-edit-link">
          <Link to={`/edit/${data.id}`}>Edit Property</Link>
        </div>
      </div>
    </div>
  );
}

export default MyPropertyCard;