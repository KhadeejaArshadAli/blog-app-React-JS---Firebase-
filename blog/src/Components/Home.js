// import { getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase-config';
// import { collection } from 'firebase/firestore';
// import Modal from 'react-modal';

// Modal.setAppElement('#root'); 

// function Home() {
//   const [postList, setPostList] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false); 
//   const [selectedPost, setSelectedPost] = useState(null);
//   const postCollectionRef = collection(db, 'Posts');

//   useEffect(() => {
//     const getPosts = async () => {
//       const data = await getDocs(postCollectionRef);
//       setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//     };
//     getPosts();
//   }, [postCollectionRef]); 

//   const openModal = (post) => {
//     setSelectedPost(post);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedPost(null);
//   };

//   return (
//     <div className='homePage'>
//       {postList.map((post) => {
//         return (
//           <div className='post' key={post.id}>
//             <div className='postHeader'>
//               <div className='title'>
//                 <h1>{post.title}</h1> 
//               </div>
            
//               <div className='viewposts'>
//               <button onClick={() => openModal(post)}> &#128065;</button>
//               </div>
//             </div>
//             {/* <div className='postTextContainer'>
//                 {post.posttext}
//                 </div> */}
//               {/* <h3>@{post.author.name}</h3> */}
//           </div>
//         );
//       })}

  
//       <Modal className="post" isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Post Details">
    
//         {selectedPost && (
//           <div className='postHeader'>
//             <h2>{selectedPost.title}</h2> 
//             <div className='postTextContainer'>
//             <p>{selectedPost.posttext}</p>
//             <div className='other'>
//             <p>Created on: {new Date(selectedPost.createdAt.seconds * 1000).toLocaleDateString()}</p>
//             <p> Created by : @{selectedPost?.author?.name}</p>
//             </div>
           
//             </div>
            
//             <button onClick={closeModal}>Close</button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default Home;

import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection } from 'firebase/firestore';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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
  }, [postCollectionRef]);

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
      {postList.map((post) => (
        <Box key={post.id} sx={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
          <Typography variant="h5">{post.title}</Typography>
          <Button variant="contained" color="primary" onClick={() => openModal(post)} sx={{ marginTop: '10px' }}>
            View Post
          </Button>
        </Box>
      ))}

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
