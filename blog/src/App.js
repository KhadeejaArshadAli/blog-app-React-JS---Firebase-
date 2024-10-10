import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import CreatePost from './Components/CreatePost';
import Login from './Components/Login';
import Register from './Components/Register';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import Profile from './Components/Profile';


function App() {
  const [isAuth, setIsAuth] = useState(false);


  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";


    });

  };
  return (
    <Router>
      <nav>
        <Link to="/"> Home </Link>
      
        {!isAuth ? (
          <>
           <Link to="/login"> Login </Link> 
           <Link to="/register"> SignUp</Link>
          </>
         
        ) : (
          <>
          
            <Link to="/profile"> My Blogs </Link>
            <button className="Log-out"onClick={signUserOut}> SignOut</button>
          </>
        )}


      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/createpost' element={<CreatePost isAuth={isAuth} />} />
        <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
