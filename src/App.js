import React from 'react';
import './App.scss'
import 'semantic-ui-css/semantic.min.css'
import NavMenu from './components/modules/NavMenu';
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import BucketViewer from './components/modules/BucketViewer';


function App() {
  return (
    <div>
      <Router>
        <NavMenu />
        <Switch>
          <BucketViewer/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
