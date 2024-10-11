
import { deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { collection, doc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Profile() {
  const [postList, setPostList] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedPost, setSelectedPost] = useState(null); 
  let navigate = useNavigate();
  const postCollectionRef = collection(db, "Posts");

  useEffect(() => {
    const getPosts = async () => {
      const userPostsQuery = query(postCollectionRef, where("author.id", "==", auth.currentUser.uid));
      const data = await getDocs(userPostsQuery);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, [postCollectionRef]);

  const handleButtonClick = () => {
    navigate('/createpost');
  };


  const deletePost = async (id) => {
    const postDocRef = doc(db, "Posts", id);
    await deleteDoc(postDocRef);
    setPostList(postList.filter(post => post.id !== id));
  };

  const enableEditing = (post) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewText(post.posttext);
  };


  const updatePost = async (id) => {
    const postDocRef = doc(db, "Posts", id);
    await updateDoc(postDocRef, {
      title: newTitle,
      posttext: newText,
      updatedAt: new Date()  
    });

    setPostList(
      postList.map(post =>
        post.id === id ? { ...post, title: newTitle, posttext: newText } : post
      )
    );

    setEditingPostId(null);
    setNewTitle('');
    setNewText('');
  };

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
              {editingPostId === post.id ? (
                <div className='cpContainer'>
                  <div className='inputGp'>
                    <label>Title</label>
                    <input 
                      type='text' 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)} 
                      placeholder='Update Title'
                    />
                  </div>
                  <div className='inputGp'>
                    <label>Post</label>
                    <textarea 
                      value={newText} 
                      onChange={(e) => setNewText(e.target.value)} 
                      placeholder='Update Post'
                    />
                  </div>
                  <button onClick={() => updatePost(post.id)}>Save</button>
                  <button onClick={() => setEditingPostId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className='title'>
                    <h1>{post.title}</h1> 
                  </div>
                  <div className='deletePost'>
                    <button className='delete' onClick={() => deletePost(post.id)}>&#128465;</button>
                    <button onClick={() => enableEditing(post)}>&#128394;</button>
                    <button onClick={() => openModal(post)}>	
                    &#128065;</button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}

      <button className='addpost' onClick={handleButtonClick}>&#10133;</button>

    
      <Modal className="main_container" isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Post Details">
        {selectedPost && (
          <div className='header'>
            <h1>{selectedPost.title}</h1>
            <div className='content'>
            <p>{selectedPost.posttext}</p>
            <div className='other'>
            <p>Created on: {new Date(selectedPost.createdAt.seconds * 1000).toLocaleDateString()}</p>
            <p> Created by : {selectedPost?.author?.name}</p>
            </div>
            </div>
            <button onClick={closeModal}>Back</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Profile;
