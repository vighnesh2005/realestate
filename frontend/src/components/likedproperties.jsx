import axios from "axios";
import { useEffect, useState } from "react";
import Resultprop from "./resultprop.jsx"


function Likedproperties() {
  const [properties,setProperties] = useState([]);
  const url = import.meta.env.VITE_URL;

  useEffect(()=>{
    const func = async ()=>{
      try{
        const results = await axios.post(`${url}/api/props/getliked`,{}
          ,{
            withCredentials:true
          }
        );
        setProperties(results.data);
        console.log(results.data);
      }catch(e){
        console.log(e);
      }
    }
    func();
  },[])
    return (
      <>
        {properties.length === 0 ? (
          <div style={{textAlign: "center", marginTop: "2rem", color: "#888"}}>
            You have not liked any properties yet.
          </div>
        ) : (
          properties.map((property, ind) => (
            <Resultprop key={ind} data={property} />
          ))
        )}
      </>
    );
}

export default Likedproperties;