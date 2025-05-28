import './styles/navbar.css'
import './styles/auth.css'
import './styles/profile.css'
import './styles/dashboard.css'
import Navbar from './components/navbar'
import Dashboard from './components/dashboard'
import Signin from './components/signin'
import Login from "./components/login"
import Profile from './components/profile'
import Myproperties from './components/myproperties'
import {Route,Routes,BrowserRouter} from "react-router-dom"
import Results from './components/results'
import "./styles/addproperty.css"
import Addproperty from './components/addproperty'

function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
      <Route path='/' element={<Dashboard/>}></Route>
      <Route path='/signup' element={<Signin/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/myproperties' element={<Myproperties/>}></Route>
      <Route path='/results/:type' element={<Results/>}></Route>
      <Route path='/addproperty' element={<Addproperty/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
