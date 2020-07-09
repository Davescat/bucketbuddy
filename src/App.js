import React from "react";
import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import NavMenu from "./components/modules/NavMenu";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BucketViewer from "./components/modules/BucketViewer";
import ConnectToS3Bucket from "./components/pages/ConnectToS3Bucket";

function App() {
  return (
    <div>
      <Router>
        <NavMenu />
        <Switch>
          <Route exact path="/" component={ConnectToS3Bucket} />
          <Route exact path="/bucket-viewer" component={BucketViewer} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
