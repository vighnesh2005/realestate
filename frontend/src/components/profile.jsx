import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { context } from '../context/context';
import { Upload, Delete } from '../upload';

function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phoneno: "",
    profilepic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  });

  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);

  const url = import.meta.env.VITE_URL;
  const { isLoggedIn } = useContext(context);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn === false) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    const getprofile = async () => {
      try {
        const result = await axios.post(`${url}/api/edit/getprofile`, {}, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        });
        if(!result.data.profilepic || result.data.profilepic === ""){
          result.data.profilepic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }
        setUser(result.data);
        setUsername(result.data.username);
      } catch (error) {
        alert("Some error occurred");
      }
    };

    getprofile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Username can't be empty.");
      return;
    }

    try {
      let profilepic = user.profilepic;

      if (profile) {
        if (user.profilepic) {
          await Delete(user.profilepic);
        }
        profilepic = await Upload(profile);
        if (!profilepic) {
          alert("Upload failed");
          return;
        }
      }

      const result = await axios.post(`${url}/api/edit/editprof`, {
        username,
        profilepic
      }, {
        withCredentials: true
      });

      setUser(result.data);
      setUsername(result.data.username);
      setProfile(null); 

      alert("Profile updated successfully");
    } catch (error) {
      alert("Some error occurred");
    }
  };

  return (
    <div className='profile-container'>
      <img src={user.profilepic} alt="profilepic" />
      <h1>Name : {user.username}</h1>
      <h1>Email : {user.email}</h1>
      <h1>Phone-No : {user.phoneno}</h1>

      <div className="profile-links" style={{margin: '20px 0'}}>
        <Link to="/addproperty" className="btn-link">Add Property</Link>
        <Link to="/myproperties" className="btn-link">My Properties</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={(e) => setProfile(e.target.files[0])}
          accept="image/*"
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
