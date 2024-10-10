import { deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { collection,doc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [postList, setPostList] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  let navigate = useNavigate();
  const postCollectionRef = collection(db, "Posts");

  useEffect(() => {
    const getPosts = async () => {
  
      const userPostsQuery = query(postCollectionRef, where("author.id", "==", auth.currentUser.uid));
      const data = await getDocs(userPostsQuery);
      
    
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  });

  const handleButtonClick = () => {
    navigate('/createpost');
  };

  // Function to delete a post
  const deletePost = async (id) => {
    const postDocRef = doc(db, "Posts", id);
    await deleteDoc(postDocRef);
    setPostList(postList.filter(post => post.id !== id)); // Update state after deletion
  };

  // Function to enable editing mode for a post
  const enableEditing = (post) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewText(post.posttext);
  };

  // Function to update a post
  const updatePost = async (id) => {
    const postDocRef = doc(db, "Posts", id);
    await updateDoc(postDocRef, {
      title: newTitle,
      posttext: newText,
      updatedAt: new Date()  // Update the timestamp for the update
    });

    // Manually update the post in the state after successful update
    setPostList(
      postList.map(post =>
        post.id === id ? { ...post, title: newTitle, posttext: newText } : post
      )
    );

    // Reset editing state after the update
    setEditingPostId(null);
    setNewTitle('');
    setNewText('');
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
                    <button onClick={() => enableEditing(post)}>	
                    &#128394;</button>
                  </div>
                </>
              )}
            </div>
            <div className='postTextContainer'>
              {editingPostId === post.id ? null : post.posttext}
            </div>
          </div>
        );
      })}
      <button className='addpost' onClick={handleButtonClick}>	
      &#10133;</button>
    </div>
  );
}

export default Profile;
