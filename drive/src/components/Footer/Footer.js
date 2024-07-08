import React from 'react'
import './Footer.css';
import { FaHome, FaTasks, FaUserFriends } from 'react-icons/fa';

const Footer = () => {
    return (
      <footer className="footer">
        <div className="icon-container">
          <a className="footer-icon">
            <FaHome />
            <span className="icon-label">Home</span>
          </a>
          <a className="footer-icon">
            <FaTasks />
            <span className="icon-label">Tasks</span>
          </a>
          <a className="footer-icon">
            <FaUserFriends />
            <span className="icon-label">Friends</span>
          </a>
        </div>
      </footer>
    );
  }

export default Footer