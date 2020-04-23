import React from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
import {AhButton} from '../Chat/Chat';

import './InfoBar.css';

const InfoBar = ({ room }) => (

  <div className="infoBar">
    <div className="leftInnerContainer">

      <img className="onlineIcon" src={onlineIcon} alt="online icon" />

      <h4>Current Room: {room}</h4>
    </div>
    <div className="rightInnerContainer">
      <AhButton />
    </div>
  </div>
);

export default InfoBar;