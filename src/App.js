import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';

// I could've use Switch component or changed routes place instead of using exact prop
class App extends Component {

  componentDidMount(){
    this.props.onTryAutoSignIn();
  }

  render() {

    let routes = (
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/"/>
        </Switch>
    )

    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/"/>
        </Switch>
      )
    }

    return (
      <BrowserRouter>
        <div>
          <Layout>
             {routes}
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state =>{
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    onTryAutoSignIn:()=>{dispatch(actions.authCheckState())}
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
