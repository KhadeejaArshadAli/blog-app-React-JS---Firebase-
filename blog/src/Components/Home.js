import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection } from 'firebase/firestore';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function Home() {
  const [postList, setPostList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const postCollectionRef = collection(db, 'Posts');
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <Box sx={{ padding: '20px' }}>

      <Grid container spacing={6}>
        {postList.map((post) => (
          <Grid size={4}>
            <Item>
              <Typography variant="h5">{post.title.trim().length == 0 ? "." : post.title.trim()}</Typography>
              <Button variant="contained" color="primary" onClick={() => openModal(post)} sx={{ marginTop: '10px' }}>
                View Post
              </Button>
            </Item>
          </Grid>
        ))}
      </Grid>

      {/*       
      {postList.map((post) => (
        <Box key={post.id} sx={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
          <Typography variant="h5">{post.title}</Typography>
          <Button variant="contained" color="primary" onClick={() => openModal(post)} sx={{ marginTop: '10px' }}>
            View Post
          </Button>
        </Box>
      ))} */}

      {/* Material UI Dialog for Post Details */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        {selectedPost && (
          <>
            <DialogTitle>{selectedPost.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                {selectedPost.posttext}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created on: {new Date(selectedPost.createdAt.seconds * 1000).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created by: @{selectedPost?.author?.name}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} color="secondary" variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Home;