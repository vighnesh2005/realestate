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
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-100 rounded-xl shadow-lg text-center text-gray-800 font-sans">
  <img
    src={user.profilepic}
    alt="profilepic"
    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-500 mb-6 shadow-md"
  />
  <h1 className="text-lg font-semibold mb-1">Name : {user.username}</h1>
  <h1 className="text-lg font-semibold mb-1">Email : {user.email}</h1>
  <h1 className="text-lg font-semibold mb-6">Phone-No : {user.phoneno}</h1>

  <div className="flex justify-center gap-6 mb-8">
    <Link
      to="/addproperty"
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded transition"
    >
      Add Property
    </Link>
    <Link
      to="/myproperties"
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded transition"
    >
      My Properties
    </Link>
  </div>

  <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
    <input
      type="text"
      placeholder="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
      className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <input
      type="file"
      onChange={(e) => setProfile(e.target.files[0])}
      accept="image/*"
      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                 file:rounded file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-100 file:text-blue-700
                 hover:file:bg-blue-200"
    />

    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
    >
      Update Profile
    </button>
  </form>
</div>

  );
}

export default Profile;
