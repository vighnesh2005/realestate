import { useContext, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { context } from '../context/context';

function Profile(){
    const [user,setUser] = useState({
        username:"",
        email:"",
        phoneno:"",
        profilepic:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    })

    const [username,setUsername] = useState("");
    const [profile,setProfile] = useState("");

    const url = import.meta.env.VITE_URL; 
    const {isLoggedIn} = useContext(context);
    const navigate = useNavigate();

    useEffect(()=>{
        if(isLoggedIn === 'false'){
            alert("Please Login First");
            navigate("/login");
        }

        const getprofile = async ()=>{
            try {
                const result = await axios.post(`${url}/api/edit/getprofile`,{},{
                    withCredentials: true,
                    headers: {
                    "Content-Type": "application/json",
                    } 
                })
                setUser(result.data);
                setUsername(result.data.username);
            } catch (error) {
                alert("Some error occured");
            }
        }

        getprofile();
    },[])

    const handleSubmit = (e)=>{
        e.preventDafult();
        
    }

    return(
        <div className='profile-container'>
            <img src={(user.profilepic)? user.profilepic : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" } alt="profilepic" />
            <h1>name : {user.username}</h1>
            <h1>email : {user.email}</h1>
            <h1>phoneno : {user.phoneno}</h1>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='username' value={username} onChange={(e)=>{setUsername(e.target.value)}}required/>
                <input type="file" />
            </form>
        </div>
    )

}


export default Profile;