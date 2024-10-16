import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

function CreatePost({ isAuth }) {
  let navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [posttext, setPostText] = useState('');

  const postCollectionRef = collection(db, 'Posts');
  
  const createPost = async () => {
    if(title.trim().length === 0){
      alert("Can't post without a title ");
      return;
    }
    const postId = uuidv4();
    await addDoc(postCollectionRef, {
      postId,
      title,
      posttext,
      author: {
        name: localStorage.getItem('username') || auth.currentUser.displayName,
        id: auth.currentUser.uid,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    navigate('/');
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        marginTop: '25px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        CREATE A POST
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          padding: '20px',
          border: '1px solid #ccc', 
          borderRadius: '8px',       
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
        }}
      >
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <TextField
          label="Post"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={posttext}
          onChange={(event) => setPostText(event.target.value)}
          required
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: '20px' }}
          onClick={createPost}
        >
          Submit Post
        </Button>
      </Box>
    </Box>
  );
}

export default CreatePost;