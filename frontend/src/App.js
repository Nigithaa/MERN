import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import UserDetails from './components/UserDetails';
import FlowerShop from './components/FlowerShop';
import OrderSummary from './components/OrderSummary';
import Invoice from './components/Invoice';

import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<UserDetails />} />
            <Route path="/flowershop" element={<FlowerShop />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/ordersummary" element={<OrderSummary />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;

