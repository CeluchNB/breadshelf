import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import BreadShelf from './BreadShelf';
import * as ROUTES from './constants/routes.js';

function App() {
  return (
    <Router>
        <Route exact path={ROUTES.LANDING} component={LoginPage} />
        <Route path={ROUTES.BREADSHELF} component={BreadShelf} />
    </Router>
  );
}

export default App;
