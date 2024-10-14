import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection } from 'firebase/firestore';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

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
    <div className='homePage'>
      {postList.map((post) => {
        return (
          <div className='post' key={post.id}>
            <div className='postHeader'>
              <div className='title'>
                <h1>{post.title}</h1> 
              </div>
            
              {/* <div className='viewposts'>
              <button onClick={() => openModal(post)}> &#128065;</button>
              </div> */}
            </div>
            <div className='postTextContainer'>
                {post.posttext}
                </div>
              <h3>@{post.author.name}</h3>
          </div>
        );
      })}

  
      <Modal className="postTextContainer" isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Post Details">
    
        {selectedPost && (
          <div className='article-title'>
            <h2>{selectedPost.title}</h2> 
            <div className='article clearfix'>
            <p>{selectedPost.posttext}</p>
            <div className='other'>
            <p>Created on: {new Date(selectedPost.createdAt.seconds * 1000).toLocaleDateString()}</p>
            <p> Created by : {selectedPost?.author?.name}</p>
            </div>
           
            </div>
            
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Home;

