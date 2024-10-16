import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { collection, doc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Profile() {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [editingPostId, setEditingPostId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const postCollectionRef = collection(db, 'Posts');
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);  
      const userPostsQuery = query(postCollectionRef, where("author.id", "==", auth.currentUser.uid));
      const data = await getDocs(userPostsQuery);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);  
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

  const deletePost = async (id) => {
    const postDocRef = doc(db, 'Posts', id);
    await deleteDoc(postDocRef);
    setPostList(postList.filter((post) => post.id !== id));
  };

  const enableEditing = (post) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewText(post.posttext);
  };

  const updatePost = async (id) => {
    const postDocRef = doc(db, 'Posts', id);
    await updateDoc(postDocRef, {
      title: newTitle,
      posttext: newText,
      updatedAt: new Date(),
    });

    setPostList(
      postList.map((post) =>
        post.id === id ? { ...post, title: newTitle, posttext: newText } : post
      )
    );

    setEditingPostId(null);
    setNewTitle('');
    setNewText('');
  };

  const handleButtonClick = () => {
    navigate('/createpost');  
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {loading ? (
       
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        postList.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No blogs available. Start by creating one!
          </Typography>
        ) : (
          <Grid container spacing={6}>
            {postList.map((post) => (
              <Grid size={4} key={post.id}>
                <Item>
                  {editingPostId === post.id ? (
                    <>
                      <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <TextField
                        label="Post"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => updatePost(post.id)}
                        sx={{ marginRight: '10px' }}
                      >
                        Save
                      </Button>
                      <Button variant="outlined" onClick={() => setEditingPostId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h5">{post.title.trim().length === 0 ? '.' : post.title.trim()}</Typography>
                      <Box sx={{ marginTop: '10px' }}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => deletePost(post.id)}
                          sx={{ marginRight: '10px' }}
                        >
                          Delete
                        </Button>
                        <Button variant="outlined" onClick={() => enableEditing(post)} sx={{ marginRight: '10px' }}>
                          Edit
                        </Button>
                        <Button variant="contained" onClick={() => openModal(post)}>
                          View
                        </Button>
                      </Box>
                    </>
                  )}
                </Item>
              </Grid>
            ))}
          </Grid>
        )
      )}

      {/* Create Post Button */}
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Create Post
        </Button>
      </Box>

      {/* Material UI Dialog for Viewing Post Details */}
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

export default Profile;
