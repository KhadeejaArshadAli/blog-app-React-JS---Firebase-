import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { collection } from 'firebase/firestore';

function Home() {
  const [postList, setPostList]= useState([]);
  const postCollectionRef = collection(db, "Posts")
   useEffect(()=> {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
     
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      
    };
    getPosts();
  
   })

  return (
   
    <div className='homePage'>
      {postList.map((post) =>{
        return <div className='post'>
          
          <div className='postHeader'>
          
            <div className='title'><h1>{post.title}</h1></div>
           
          </div>
          <div className='postTextContainer'>{post.posttext}</div>
          
         </div>

      })}
    </div>
  )
}

export default Home
