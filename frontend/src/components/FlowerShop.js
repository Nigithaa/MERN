import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style.css';
import axios from 'axios';

import {
  incrementQuantity,
  decrementQuantity,
  addToCart,
  removeFromCart,
  selectDate,
  setSelectedCurrency,
  fetchCurrencyConversion,
  fetchFlowers
} from '../actions/flowerActions';

class FlowerShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  componentDidMount() {
    this.props.fetchFlowers();
    this.props.fetchCurrencyConversion();
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.toString() };
  }

  handleCheckout = async () => {
    const { flowers, selectedDate, navigate } = this.props;
    const cartItems = flowers.filter(flower => flower.inCart);
  
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }
  
    const userId = localStorage.getItem('userId') || 'N/A';
    const userName = localStorage.getItem('userName') || 'N/A';
  
    const orderData = {
      userId: userId,
      name: userName,
      date: selectedDate,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      console.log('Order placed successfully:', response.data);
  
      let totalCost = 0;
      cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalCost += itemTotal;
      });
  
      const invoiceData = {
        userId,
        userName,
        orderDate: selectedDate,
        items: cartItems,
        totalCost,
      };
  
      navigate('/invoice', { state: invoiceData });
  
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error details:', error);
      alert(`Error placing order: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.errorMessage}</h1>;
    }

    const { flowers, selectedDate, currencyRates, selectedCurrency } = this.props;

    if (!flowers || flowers.length === 0) {
      return <div>Loading...</div>;
    }

    const totalCost = flowers
      .filter(flower => flower.inCart)
      .reduce((acc, flower) => acc + (flower.price * flower.quantity), 0);

    const convertedCost = selectedCurrency && currencyRates[selectedCurrency]
      ? (totalCost * currencyRates[selectedCurrency]).toFixed(2)
      : totalCost.toFixed(2);

    return (
      <div className="shop-container">
        <header className="shop-header">
          <h1 className="shop-name">A.M.K.A Flower Shop</h1>
        </header>

        <h2>Total Cost: ₹{totalCost.toFixed(2)} (Converted: {selectedCurrency} {convertedCost})</h2>

        <div className="date-selector">
          <label htmlFor="order-date">Select Date:</label>
          <input 
            type="date" 
            id="order-date" 
            value={selectedDate} 
            onChange={(e) => this.props.selectDate(e.target.value)}
          />
        </div>

        <div className="currency-selector">
          <label htmlFor="currency-select">Select Currency:</label>
          <select
            id="currency-select"
            value={selectedCurrency}
            onChange={(e) => this.props.setSelectedCurrency(e.target.value)}
          >
            {Object.keys(currencyRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        <div className="flower-cards">
          {flowers.map(flower => (
            <div key={flower.id} className="flower-card">
              <img 
                src={require(`../images/${flower.image}`)}
                alt={flower.name} 
                className="flower-image" 
              />
              <h2>{flower.name}</h2>
              <p>Price: ₹{flower.price}</p>
              <div className="quantity-control">
                <button onClick={() => this.props.decrementQuantity(flower.id)}>-</button>
                <span>{flower.quantity}</span>
                <button onClick={() => this.props.incrementQuantity(flower.id)}>+</button>
              </div>
              <p>Total: ₹{(flower.price * flower.quantity).toFixed(2)}</p>
              <div className="cart-buttons">
                <button 
                  className="add-to-cart" 
                  onClick={() => this.props.addToCart(flower.id)} 
                  disabled={flower.inCart}
                >
                  Add to Cart
                </button>
                <button 
                  className="remove-from-cart" 
                  onClick={() => this.props.removeFromCart(flower.id)} 
                  disabled={!flower.inCart}
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="checkout-button" onClick={this.handleCheckout}>
          Checkout
        </button>
      </div>
    );
  }
}

FlowerShop.propTypes = {
  flowers: PropTypes.array.isRequired,
  selectedDate: PropTypes.string.isRequired,
  currencyRates: PropTypes.object.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
  incrementQuantity: PropTypes.func.isRequired,
  decrementQuantity: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  selectDate: PropTypes.func.isRequired,
  setSelectedCurrency: PropTypes.func.isRequired,
  fetchCurrencyConversion: PropTypes.func.isRequired,
  fetchFlowers: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  flowers: state.flowerShop.flowers,
  selectedDate: state.flowerShop.selectedDate,
  currencyRates: state.flowerShop.currencyRates,
  selectedCurrency: state.flowerShop.selectedCurrency
});

const mapDispatchToProps = {
  incrementQuantity,
  decrementQuantity,
  addToCart,
  removeFromCart,
  selectDate,
  setSelectedCurrency,
  fetchCurrencyConversion,
  fetchFlowers
};

const withHooks = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    return <Component {...props} navigate={navigate} location={location} />;
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withHooks(FlowerShop));
