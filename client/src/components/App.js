import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "../styles/App.css";

import Nav from "../components/Layout/Nav";
import Landing from "../components/Layout/Landing";
import Footer from "../components/Layout/Footer";

import "../styles/App.css";
import "semantic-ui-css/semantic.min.css";

import Register from "./Auth/Register";
import Login from "./Auth/Login";

class App extends Component {
  state = { users: [] };

  render() {
    return (
      <Router>
        <div className="App">
          <Nav />
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
