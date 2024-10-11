import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';



function CreatePost({ isAuth }) {

  let navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [posttext, setPostText] = useState("");

  const postCollectionRef = collection(db, "Posts")
  const createPost = async () => {
    const postId = uuidv4();
    await addDoc(postCollectionRef, {
      postId,
      title,
      posttext,
      author: {
        name: localStorage.getItem("username") || auth.currentUser.displayName,
        id: auth.currentUser.uid
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    navigate("/");
  };


  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  })




  return (
    <div className='createPostPage'>
      <div className='cpContainer'>
        <h1> CREATE A POST</h1>
        <div className='inputGp'>
          <label>Title:</label>
          <input type='text' placeholder='Title...' onChange={(event) => { setTitle(event.target.value); }} />
        </div>
        <div className='inputGp'>
          <label>Post:</label>
          <textarea placeholder='Post...'
            onChange={(event) => { setPostText(event.target.value); }} />

        </div>
        <button onClick={createPost}>Submit Post</button>

      </div>


    </div>
  )
}


export default CreatePost



