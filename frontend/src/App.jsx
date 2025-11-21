import {React,useEffect} from 'react'
import {Routes,Route} from 'react-router-dom'
import Navbar from "./components/Navbar.jsx"
import Home from "./pages/Home" 
import Signup from "./pages/Signup" 
import Login from "./pages/Login" 
import Profile from "./pages/Profile" 
import Setting from "./pages/Setting" 
import { useAuthStore} from './store/useAuthStore'
import { useThemeStore} from './store/useThemeStore'
import { Loader2 } from "lucide-react"
import { Navigate } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore()
  const {theme}=useThemeStore()
  console.log(onlineUsers)
  
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);
  if(isCheckingAuth&&!authUser){
    return(
      
      <div className="flex items-center justify-center h-screen bg-gray-100">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
     

    )
  }






  

  
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser?<Home/>:<Navigate to="/login"/>}/>
        <Route path="/Signup" element={!authUser?<Signup/>:<Navigate to="/"/>}/>
        <Route path="/login" element={!authUser?<Login/>:<Navigate to="/"/>}/>
        <Route path="/settings" element={<Setting/>}/>
        <Route path="/profile" element={authUser?<Profile/>:<Navigate to="/login"/>}/>

      </Routes>
      <Toaster/>

    </div>
    

  )
}

export default App

