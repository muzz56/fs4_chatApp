import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './Signin.css';

export default function SignIn() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h3 className="heading">Welcome to Chat App</h3>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
          <button className={'button mt-20'} type="submit">Sign In</button>
        </Link>

        <Link to={'/admin'}><p>To view event log, Login as 
          <button type="submit">Admin </button> </p>
        </Link>
      </div>
    </div>
    
  );
}
