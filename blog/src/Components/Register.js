import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const submit = async (e) => {
   
    e.preventDefault();

    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userCollectionRef= collection(db,"Users")
     
     
      // Store the user's data in Firestore, including the name
      await addDoc(userCollectionRef, {
        uid: user.uid,
        name: name,  // The name entered during registration
        email: email,
        createdAt: serverTimestamp(), // Server-generated timestamp for the creation
        updatedAt: serverTimestamp()   // Or use serverTimestamp() from Firestore for server-side timestamps
      })

      alert("Account Created and User Data Stored");
       window.location.pathname = "/"
      
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className='main_container'>
      <div className='header'>
        <h1>Register</h1>

        <div className='box'>
          <input type='text' value={name} placeholder='UserName' onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='box'>
          <input type='email' value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder='Email' />

        </div>
        <div className='box'>

          <input type='password' value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        </div>
        <p>Alerady Have an account <Link to="/login">Login now</Link></p>
        <button onClick={submit}>Sign Up</button>

      </div>
    </div>
  )
}

export default Register;

