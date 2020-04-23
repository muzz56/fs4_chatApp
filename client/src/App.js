import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Chat, {PRoute} from './components/Chat/Chat';
import Signin, {PrivateRoute} from './components/Signin/Signin';
import Events from './components/Events/Events';
import Error from './components/Error/Error';

const App = () => {
  return (
    <Router>
      <Switch>
      <Route path="/" exact component={Signin} />
      <PRoute path="/chat" >
        <Chat />
        </PRoute>
      <PrivateRoute path="/events" >
        <Events />
        </PrivateRoute>

    <Route component={Error} />
    </Switch>
    </Router>
  );
}



export default App;

