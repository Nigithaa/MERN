import React from 'react';
import { useLocation } from 'react-router-dom';

const Invoice = () => {
  const location = useLocation();
  const { userId, userName, orderDate, items, totalCost } = location.state;

  return (
    <div className="invoice-container">
      <h1>Invoice</h1>
      <p>User ID: {userId}</p>
      <p>User Name: {userName}</p>
      <p>Order Date: {orderDate}</p>
      <h2>Items:</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} (Quantity: {item.quantity}) - ₹{(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <h2>Total Cost: ₹{totalCost.toFixed(2)}</h2>
    </div>
  );
};

export default Invoice;
