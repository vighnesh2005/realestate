import { useContext, useState } from 'react';
import axios from 'axios';
import { context } from '../context/context.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const url = import.meta.env.VITE_URL; 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setIsLoggedIn, setUserId } = useContext(context);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${url}/api/auth/login`, {
        email,
        password,
      },{
        withCredentials: true
      });

      if (result.data.message === "Invalid credentials") {
        alert("Invalid credentials");
      } else if (result.data.message === "Login successful") {
        alert("Login successful");
        setIsLoggedIn(true);
        setUserId(result.data.userid);
        navigate('/');
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className='authcontainer'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          name='username'
          placeholder='Enter username'
          onChange={(e) => setEmail(e.target.value)}
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
        <button type='submit'>Login</button>
        <a href="/login">Do not have a accout? </a>
      </form>
    </div>
  );
};

export default Login;
