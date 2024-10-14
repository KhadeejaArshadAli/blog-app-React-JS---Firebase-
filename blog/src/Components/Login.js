
// import React, { useState,useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import { auth, db, provider } from '../firebase-config';
// import { collection, getDocs, query, where } from 'firebase/firestore';

// function Login({ setIsAuth }) {

//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState();
//   let navigate = useNavigate();


//   const userRef = collection(db, "Users");


//   const submit = async (e) => {
//     e.preventDefault();

//     try {
//       const login = await signInWithEmailAndPassword(auth, email, password)

//       if (login) {
//         localStorage.setItem("isAuth", true);
//         setIsAuth(true);
//         const user = query(userRef, where("uid", "==", login.user.uid));
//         const data = await getDocs(user);
//         localStorage.setItem("username", data.docs[0].data().name);
//         alert("Login Successful")
//         navigate('/')


//       }
//     }
//     catch (error) {
//       alert(error)
//     }
//   }
//   const signInWithGoogle = () => {

//     signInWithPopup(auth, provider).then((result) => {
//       localStorage.setItem("isAuth", true);
//       setIsAuth(true)
//       navigate('/');

//     });
    
//   }

//   return (
//     <div className='main_container'>
//       <div className='header'>
//         <h1>Login</h1>

//         <div className='box'>
//           <input type='email' value={email}
//             onChange={(e) => setEmail(e.target.value)} placeholder='Email' />

//         </div>
//         <div className='box'>

//           <input type='password' value={password}
//             onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
//         </div>
//         <p>Create an account <Link to="/register">Register now</Link></p>
//         <button className='mainbutton' onClick={submit}>Log in</button>
//         <button className='login-with-google-btn' onClick={signInWithGoogle}>Log in with Google</button>

//       </div>
//     </div>
//   )
// }

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';


import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';

function Login({ setIsAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const userRef = collection(db, "Users");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const login = await signInWithEmailAndPassword(auth, email, password);
      if (login) {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);

        const user = query(userRef, where("uid", "==", login.user.uid));
        const data = await getDocs(user);
        localStorage.setItem("username", data.docs[0]?.data().name);

        alert("Login Successful");
        navigate('/');
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then(() => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate('/');
      })
      .catch(() => {
        setError("Failed to log in with Google.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', margin: '25px'}}>
//       <Typography variant="h4" gutterBottom>
//         Login
//       </Typography>

//       <Box sx={{ width: '100%', maxWidth: '400px'}}>
//         <TextField
//           label="Email"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <Typography color="error" sx={{ marginTop: '10px' }}>{error}</Typography>}

//         <Typography variant="body2" sx={{ marginTop: '10px' }}>
//           Create an account <Link to="/register" style={{color: 'blue', fontSize: '15px', textDecoration:'underline'}} >Register now</Link>
//         </Typography>

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ marginTop: '20px' }}
//           onClick={submit}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Log in'}
//         </Button>

//         <Button
//           variant="outlined"
//           color="secondary"
//           fullWidth
//           sx={{ marginTop: '10px' }}
//           onClick={signInWithGoogle}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Log in with Google'}
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// export default Login;


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', margin: '25px'}}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          border: '1px solid #ccc',  
          borderRadius: '8px',       
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <Typography color="error" sx={{ marginTop: '10px' }}>{error}</Typography>}

        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Create an account <Link to="/register" style={{color: 'blue', fontSize: '15px', textDecoration:'underline'}}>Register now</Link>
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: '20px' }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Log in'}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ marginTop: '10px' }}
          onClick={signInWithGoogle}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Log in with Google'}
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
