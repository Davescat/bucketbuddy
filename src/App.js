import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import BucketViewer from './components/modules/BucketViewer';
import NavMenu from './components/modules/NavMenu';
import ConnectToS3Bucket from './pages/ConnectToS3Bucket';
import SchemaForm from './components/schema-form';

function App() {
  return (
    <Router>
      <NavMenu />
      <Switch>
        <Route exact path="/" component={ConnectToS3Bucket} />
        <Route exact path="/bucket-viewer" component={BucketViewer} />
        <Route exact path="/test" component={SchemaForm} />
      </Switch>
    </Router>
  );
}

export default App;
