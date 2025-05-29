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
import View from './components/view'
import Likedproperties from './components/likedproperties';
import Editproperty from './components/editproperty'

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
      <Route path='/view/:property_id' element={<View/>}></Route>
      <Route path='/editprop/:id' element={<Editproperty/>}></Route>
      <Route path='/likedprops' element={<Likedproperties/>}></Route>
      <Route path='*' element={<h1>Page Not Found</h1>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
