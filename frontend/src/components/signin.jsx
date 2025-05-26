import { useContext, useState } from 'react';
import axios from 'axios';
import { context } from '../context/context.js';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const url = import.meta.env.VITE_URL; 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhono] = useState("");

  const { setIsLoggedIn, setUserId } = useContext(context);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${url}/api/auth/signup`, {
        username,
        password,
        email,
        phoneno,
      });

      if (result.data.message === "User already exists") {
        alert("User already exists");
      } else if (result.data.message === "User created successfully") {
        alert("User Created Successfully");
        setIsLoggedIn(true);
        setUserId(result.data.userid);
        navigate('/');
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className='authcontainer'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          name='username'
          placeholder='Enter username'
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          name='password'
          placeholder='Enter password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          value={email}
          name='email'
          placeholder='Enter email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          value={phoneno}
          name='phoneno'
          placeholder='Enter mobile no'
          onChange={(e) => setPhono(e.target.value)}
          required
        />
        <button type='submit'>Sign Up</button>
        <a href="/login">Already have an account?</a>
      </form>
    </div>
  );
};

export default Signin;
