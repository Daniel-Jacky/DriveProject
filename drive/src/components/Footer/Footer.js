import React from 'react'
import './Footer.css';
import { FaHome, FaTasks, FaUserFriends, FaWallet, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
      <footer className="footer">
      <div className="icon-container">
        <Link to="/" className="footer-icon">
          <FaHome />
          <span className="icon-label">Home</span>
        </Link>
        <Link to="/tasks" className="footer-icon">
          <FaTasks />
          <span className="icon-label">Tasks</span>
        </Link>
        <Link to="/friends" className="footer-icon">
          <FaUserFriends />
          <span className="icon-label">Crew</span>
        </Link>
        {/* <Link to="/wallet" className="footer-icon">
          <FaWallet />
          <span className="icon-label">Wallet</span>
        </Link>
        <Link to="/shop" className="footer-icon">
          <FaShoppingCart />
          <span className="icon-label">NFT Shop</span>
        </Link> */}
      </div>
    </footer>
    );
  }

export default Footer