import { useContext, useEffect, useState } from "react";
import Propertycard from "./propertycard";
import { useNavigate } from "react-router-dom";
import { context } from "../context/context";
import axios from "axios";

function Myproperties() {
    const url = import.meta.env.VITE_URL;
    const navigate = useNavigate();
    const {isLoggedIn} = useContext(context);
    const [props,setProps] = useState([]);
    
    useEffect(()=>{

        const handler = async ()=>{
            if(isLoggedIn === false){
                alert("Please login first...");
                navigate("/login");
            }     
        
            try {
                const results = await axios.post(`${url}/api/props/getmyprops`,{},{
                    withCredentials: true
                })
                setProps(results.data);
                console.log("success");
            } catch (error) {
                alert("unable to fetch data");
            }
        }

        handler();
    },[]);

    return (
        <>
            {props.length > 0 ? (
            <div>
                {props.map((property, id) => (
                <Propertycard key={id} data={property} />
                ))}
            </div>
            ) : (
            <div style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
                You have not uploaded any properties yet.
            </div>
            )}
        </>
        );
}

export default Myproperties