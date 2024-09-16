import React from 'react'
import './Footer.css';
import { FaHome, FaTasks, FaUserFriends } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
      <footer className="footer">
      <div className="icon-container">
        <Link to="/DriveProject" className="footer-icon">
          <FaHome />
          <span className="icon-label">Home</span>
        </Link>
        <Link to="/tasks" className="footer-icon">
          <FaTasks />
          <span className="icon-label">Tasks</span>
        </Link>
        <Link to="/friends" className="footer-icon">
          <FaUserFriends />
          <span className="icon-label">Friends</span>
        </Link>
      </div>
    </footer>
    );
  }

export default Footer