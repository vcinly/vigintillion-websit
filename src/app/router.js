import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';


import Table from './Table';
import Time from  './time'


/* function BasicRoute() {
    return (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Table}/>
            <Route exact path="/time" component={Time}/>
        </Switch>
    </HashRouter>
    )
}; */

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Table}/>
            <Route exact path="/time" component={Time}/>
        </Switch>
    </HashRouter>
);


export default BasicRoute;