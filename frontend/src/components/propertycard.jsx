import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyPropertyCard({ data }) {
  const [isDeleted,setIsDeleted] = useState(false);
  const url = import.meta.env.VITE_URL;
  const handledelete = async ()=>{
    try {
      const results = await axios.post(`${url}/api/edit/deleteprop`,{
        propertyId:data.id
      },{
        withCredentials:true
      })
      if(results.data.message === 'success')
        setIsDeleted(true);
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <>
    {!isDeleted? (
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
          <Link to={`/editprop/${data.id}`} style={{margin:"10px" , backgroundColor:"#0077B6", padding:"2px" , border:"solid 2px black",  borderRadius:"5px", color:"black"}}>Edit Property</Link>
          <button onClick = {handledelete} style={{margin:"10px" , backgroundColor:"#0077B6", padding:"2px" , border:"solid 2px black",  borderRadius:"5px"}}> DELETE </button>
        </div>
      </div>
    </div>  
    ):("")}
    </>
  );
}

export default MyPropertyCard;

