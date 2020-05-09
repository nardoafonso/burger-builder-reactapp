import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {BrowserRouter, Route} from 'react-router-dom';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';

// I could've use Switch component or changed routes place instead of using exact prop

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Layout>
              <Route path="/" exact component={BurgerBuilder} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/orders" component={Orders} />
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
