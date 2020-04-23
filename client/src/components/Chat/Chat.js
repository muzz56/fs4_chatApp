import React, { useState, useEffect } from "react";
//import queryString from 'query-string';
import io from "socket.io-client";

import {
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";



//import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//import Accordion from 'react-bootstrap/Accordion';
//import Card from 'react-bootstrap/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import Container from 'react-bootstrap/Container';

// import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';




import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
//import {log} from '../Signin/Signin';

import './Chat.css';

let socket;
let uname ;
let uroom;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  //const ENDPOINT = 'localhost:5000';
  const ENDPOINT = 'https://fs4-chat-app.herokuapp.com/';
 
    console.log('Just after chat declaration: ' + room);
    console.log(name);


  useEffect(() => {
    
    // const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    const name = uname;
    const room = uroom;

    setRoom(room);
    setName(name);

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  },[ENDPOINT, '/chat']);

  //   socket.emit('join', { name, room }, (error) => {
  //     if(error) {
  //       alert(error);
  //     }
  //   });
  // }, [ENDPOINT, location.search]);
  
  useEffect(() => {

    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
    // chat data socket event handlers here..
    socket.on('chat-data-added', function() 
    { console.log('Chat data added to server')});
  }

  return (
    <div className="outerContainer">
      {/* <TextContainer users={users}/> */}
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
          
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export const JoinButton = (props) => {
  uname = props.uname;
  uroom = props.uroom;
  //Join room

  let his = useHistory();
  let loc = useLocation();

  let { fr } = loc.state || { fr: { pathname: "/chat" } };
  const log = (ev) => { ev.preventDefault();


  if (!uname || !uroom) {
    alert ("Please Key in particulars");
  } else
  {
    fakeAuth.authenticate(() => {
      his.replace(fr);
    });
  }
}


  return(
     <Button variant="primary" type="submit" onClick = {ev => log(ev)}>
   Submit
 </Button> 
  );
}

// AuthExample related functions

export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

export function AhButton() {
  let his = useHistory();

  return fakeAuth.isAuthenticated ? (
      <button
        onClick={() => {
          fakeAuth.signout(() => his.push("/"));  
        }}
      >
        Leave Room
      </button>
  ): 
   (
     <p>You are not logged in.</p>
  );
}

export function PRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ loc }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { fr: loc }
            }}
          />
        )
      }
    />
  );
}

export default Chat;
