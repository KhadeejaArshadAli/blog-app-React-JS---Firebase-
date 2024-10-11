import React, { useEffect, useState } from 'react';
import {addDoc, collection,serverTimestamp,} from 'firebase/firestore';
import { db,auth } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';



 function CreatePost({isAuth}) {

  let navigate= useNavigate();
  const [title, setTitle]= useState("");
  const [posttext, setPostText]= useState("");
 
  const postCollectionRef = collection(db, "Posts")

//     const createPost =async ()=>{
//         let username = "Anonymous"; // Fallback value in case name is not available
  
//         // Check if user is authenticated via popup (Google, etc.)
//         if (auth.currentUser?.displayName) {
//           username = auth.currentUser.displayName; // For popup sign-in, displayName exists
//         } else {
//           // If the user registered with email/password, fetch their username from Firestore
//           const userDocRef = doc(db, "Users", auth.currentUser.uid);
//           const userDocSnap = await getDoc(userDocRef);
//           if (userDocSnap.exists()) {
//             username = userDocSnap.data().name || "Anonymous"; // Get the name from Firestore, with fallback to "Anonymous"
//           } else {
//             console.log("No such user document found!");
//           }
//         }
//       const postId = uuidv4();
//      await addDoc(postCollectionRef, {
//       postId,
//       title,
//       posttext, 
//       author: {
//         name: username,
//        id: auth.currentUser.uid 
//       },
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     });
//     navigate("/")

    
//   };
const createPost = async () => {
    const postId = uuidv4();
    // let username = "Anonymous";  // Default value
  
    // // Check if user is authenticated via popup (Google, etc.)
    // if (auth.currentUser.displayName) {
    //   username = auth.currentUser.displayName; // Use displayName for Google sign-in
    // } else {
    //   // If the user registered with email/password, fetch their username from Firestore
    //   const userDocRef = doc(db, "Users", auth.currentUser.uid);
    //   const userDocSnap = await getDoc(userDocRef);
  
    //   if (userDocSnap.exists()) {
    //     username = userDocSnap.data().name || "Anonymous"; // Get the name from Firestore, fallback to "Anonymous"
    //   } else {
    //     console.log("No such user document found!");
    //   }
    // }
  
    // Now create the post with the correct username
    await addDoc(postCollectionRef, {
      postId,
      title,
      posttext,
      author: {
        // name: username,  // Store the username (displayName or custom)
        id: auth.currentUser.uid  // Store the user ID
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  
    navigate("/");
  };
  

  useEffect(() =>{
    if(!isAuth){
      navigate("/login");
    }
  })

 


  return (
    <div className='createPostPage'>
      <div className='cpContainer'>
        <h1> CREATE A POST</h1>
        <div className='inputGp'>
          <label>Title:</label>
          <input type='text' placeholder='Title...' onChange={(event) =>{setTitle(event.target.value);}} />
        </div>
        <div className='inputGp'>
          <label>Post:</label>
          <textarea placeholder='Post...'
          onChange={(event) =>{setPostText(event.target.value);}} />

        </div>
        <button onClick={createPost}>Submit Post</button>

      </div>
    
      
    </div>
  )}


export default CreatePost



