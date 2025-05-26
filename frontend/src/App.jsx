import './styles/navbar.css'
import './styles/auth.css'
import './styles/dashboard.css'
import Navbar from './components/navbar'
import Dashboard from './components/dashboard'
import Signin from './components/signin'
import Login from "./components/login"
import Profile from './components/profile'
import {Route,Routes,BrowserRouter} from "react-router-dom"

function App() {

  return (
    <>
    <Navbar></Navbar>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard/>}></Route>
      <Route path='/signup' element={<Signin/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
