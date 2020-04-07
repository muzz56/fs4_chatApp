import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './Admin.css';

export default function SignIn() {
  const [username, setUname] = useState('');
  const [password, setPasswrd] = useState('');

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h3 className="heading">Admin Login</h3>
        <div>
          <input placeholder="Username" className="joinInput" type="text" onChange={(event) => setUname(event.target.value)} />
        </div>
        <div>
          <input placeholder="Password" className="joinInput mt-20" type="password" onChange={(event) => setPasswrd(event.target.value)} />
        </div>
        <Link onClick={e => (username !== 'admin'  && password !== 'password') ? e.preventDefault(alert('username or password not correct'))  : null} to= {`/events`} >
          <button className={'button mt-20'} type="submit" >Login</button>
        </Link>
      </div>
    </div>
    
  );
}


