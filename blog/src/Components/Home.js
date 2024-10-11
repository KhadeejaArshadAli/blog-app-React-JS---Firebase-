import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection } from 'firebase/firestore';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Required for accessibility

function Home() {
  const [postList, setPostList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedPost, setSelectedPost] = useState(null); // To store the clicked post
  const postCollectionRef = collection(db, 'Posts');

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, [postCollectionRef]); // Empty array to prevent unnecessary re-renders

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null); // Clear the selected post when closing modal
  };

  return (
    <div className='homePage'>
      {postList.map((post) => {
        return (
          <div className='post' key={post.id}>
            <div className='postHeader'>
              <div className='title'>
                <h1>{post.title}</h1> {/* Only the title is displayed */}
              </div>
              <div className='viewposts'>
              <button onClick={() => openModal(post)}> &#128065;</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal for post details */}
      <Modal className="main_container" isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Post Details">
        {selectedPost && (
          <div className='header'>
            <h2>{selectedPost.title}</h2> {/* Display title */}
            <p>{selectedPost.posttext}</p> {/* Display post text */}
            <p>Created on: {new Date(selectedPost.createdAt.seconds * 1000).toLocaleDateString()}</p> {/* Display creation date */}
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Home;

