import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
// import TestComponent from './containers/TestComponent';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import TestComponent from "./containers/TestComponent/TestComponent";

const routing = (
    <Router>
        <div>
            <Route exact path="/" component={() => <App someData={"Test"}/>} />
            <Route path="/test" component={TestComponent} />
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
