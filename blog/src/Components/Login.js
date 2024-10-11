
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import { auth,provider } from '../firebase-config';

function Login({setIsAuth}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  



  const submit = async (e) => {
    e.preventDefault();

    try {
      const user = await signInWithEmailAndPassword(auth,email, password)
      if (user) {
        localStorage.setItem("isAuth", true);
        setIsAuth(true)
        alert("Login Successful")
        navigate('/')

        
      }
    }
    catch (error) {
      alert(error)
    }
  }
  const signInWithGoogle =() =>{
   
    signInWithPopup(auth, provider).then((result) =>{
      localStorage.setItem("isAuth", true);
      setIsAuth(true)
      navigate('/');

    });
  }
  return (
    <div className='main_container'>
      <div className='header'>
        <h1>Login</h1>

        <div className='box'>
          <input type='email' value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder='Email' />

        </div>
        <div className='box'>

          <input type='password' value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        </div>
        <p>Create an account <Link to="/register">Register now</Link></p>
        <button className='mainbutton' onClick={submit}>Log in</button>
        <button className='login-with-google-btn'onClick={signInWithGoogle}>Log in with Google</button>

      </div>
    </div>
  )
}

export default Login;

