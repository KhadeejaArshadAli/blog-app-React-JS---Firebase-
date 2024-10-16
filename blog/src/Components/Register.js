import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Box, Button, TextField, Typography } from '@mui/material';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userCollectionRef = collection(db, 'Users');

      await addDoc(userCollectionRef, {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert('Account Created and User Data Stored');
      window.location.pathname = '/';
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', margin: '25px' }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          border: '1px solid #ccc',  // Same border as in Login form
          borderRadius: '8px',        // Same rounded corners
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Optional box shadow
        }}
      >
        <TextField
          label="UserName"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          label="Email"
          type="email"
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

        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          Already have an account? <Link to="/login" style={{ color: 'blue', fontSize: '15px', textDecoration: 'underline' }}>Login now</Link>
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: '20px' }}
          onClick={submit}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default Register;
