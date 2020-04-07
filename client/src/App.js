import React from 'react';

import Chat from './components/Chat/Chat';
import Signin from './components/Signin/Signin';
import Admin from './components/Admin/Admin';
import Events from './components/Events/Events';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Signin} />
      <Route path="/chat" component={Chat} />
      <Route path="/admin" component={Admin} />
      <Route path="/events" component={Events} />
    </Router>
  );
}



export default App;

