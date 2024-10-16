import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import CreatePost from './Components/CreatePost';
import Login from './Components/Login';
import Register from './Components/Register';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import Profile from './Components/Profile';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

function App() {
  const [isAuth, setIsAuth] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">
              <Typography variant="h6">Home</Typography>
            </Button>
          </Box>

          {!isAuth ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                <Typography variant="h6">Login</Typography>
              </Button>
              <Button color="inherit" component={Link} to="/register">
                <Typography variant="h6">SignUp</Typography>
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/profile">
                <Typography variant="h6">My Blogs</Typography>
              </Button>
              <Button color="inherit" onClick={signUserOut}>
                <Typography variant="h6">SignOut</Typography>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/createpost' element={<CreatePost isAuth={isAuth} />} />
        <Route path='/login' element={isAuth ? <Navigate to="/" /> : <Login setIsAuth={setIsAuth} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={isAuth ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
