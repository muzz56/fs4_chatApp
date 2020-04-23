
import React, { useState }  from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import {JoinButton} from '../Chat/Chat';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';



function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionToggle(eventKey, () =>
    console.log(''),
  );

  return (
    <Button
    
      type="button"
      variant="outline-info"
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

const Signin = () => {

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');


  const [username, setUname] = useState('');
  const [password, setPassword] = useState('');

  let history = useHistory();
  let local = useLocation();

  let { from } = local.state || { from: { pathname: "/events" } };
  let login = (e) => {
    e.preventDefault();
    if ( ( password === 'pass123') && (username === 'admin')) {
    fakeAuth.authenticate(() => {
      history.replace(from);
    });
  }
  else { alert ("username or password is not correct")}
  };

    return ( 
<>

<Container>
  <Row>
    <Col>  <div><h1>Project Chat-App</h1></div>
</Col>
  </Row>
  <Row>
    <Col> 
    
    {/* Accordian for Chat Room entrance */}


    <Accordion defaultActiveKey="0">
     <Card>
       <Card.Header>
         <CustomToggle eventKey="0">Join the Chat</CustomToggle>
       </Card.Header>
       <Accordion.Collapse eventKey="0">
         <Card.Body>


          <Form>
 <Form.Group controlId="formBasicEmail">
   <Form.Label>Username</Form.Label>
   <Form.Control type="text" placeholder="username" onChange={(event) => setName(event.target.value)}/>
   
   <Form.Text className="text-muted">
   </Form.Text>
 </Form.Group>

 <Form.Group controlId="formBasicPassword">
   <Form.Label>Room</Form.Label>
   <Form.Control type="text" placeholder="Room" onChange={(event) => setRoom(event.target.value)} />
 </Form.Group>

{/* Join Room */}
{console.log ('User:' + name + 'Room :' + room)}
<JoinButton uname = {name} uroom = {room}/>

 
 {/* <Button variant="primary" type="submit" onClick = {ev => log(ev)}>
   Submit
 </Button>  */}






 {/* <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
 <Button variant="primary" type="submit">
   Submit
 </Button> 
</Link> */}





 </Form>

 </Card.Body>
    </Accordion.Collapse>
    </Card>


{/* Accordion for Admin Login page */}


    <Card>
      <Card.Header>
       <CustomToggle eventKey="1">Admin Login</CustomToggle>
      </Card.Header>
     <Accordion.Collapse eventKey="1">
       <Card.Body>
{/* Start AuthEample() here */}

<Router>
      <div>

<Form>
 <Form.Group controlId="formBasicEmail-1">
   <Form.Label>Username</Form.Label>
   <Form.Control type="text" placeholder="Enter username" onChange={(event) => setUname(event.target.value)}/>
   <Form.Text className="text-muted">
   </Form.Text>
 </Form.Group>

 <Form.Group controlId="formBasicPassword-1">
   <Form.Label>Password</Form.Label>
   <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
 </Form.Group>
 <Button variant="primary" type="submit" onClick = {login}>
   Submit
 </Button>
</Form> 
</div>
    </Router>


</Card.Body>
       </Accordion.Collapse>
     </Card>
   </Accordion>

    
    </Col>
  </Row>
  {/* <Row>
    <Col>App built by Nas_Muzz and copyrighted@2020</Col>
  </Row> */}
</Container>

</>            
 
    )
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

export function AuthButton() {
  let history = useHistory();

  return fakeAuth.isAuthenticated ? (
      <button
        onClick={() => {
          fakeAuth.signout(() => history.push("/"));  
        }}
      >
        Sign out
      </button>
  ): 
   (
     <p>You are not logged in.</p>
  );
}

export function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ local }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: local }
            }}
          />
        )
      }
    />
  );
}


export default Signin;
