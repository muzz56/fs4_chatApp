import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
  
    <div>
    </div>
    {
      users
        ? (
           <div className='textContainer'>
          
         <div>
            <h4> Online</h4>
             <div className="activeContainer">
              <div>
                {users.map(({name}) => (
                  <div key={name} className="activeItem"> 
                  <div key={name} >
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        )
        : null
      
    }
    
  </div>
        );

export default TextContainer;