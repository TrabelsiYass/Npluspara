// Components/FancyPreloader/index.js
import React from 'react';
import './index.css';

const FancyPreloader = () => {
  return (
    <div className="fancy-preloader-container">
      <div className="loader-motion">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      <p className="loading-text">NPlusPara est en train de charger...</p>
    </div>
  );
};

export default FancyPreloader;