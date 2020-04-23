import React from "react";
import io from "socket.io-client";
import {AuthButton} from '../Signin/Signin';
import './Events.css';

let socket;
let myJson = [];

  //const ENDPOINT = 'localhost:5000';
  const ENDPOINT = 'https://fs4-chat-app.herokuapp.com/';

  const Events = () => {

  socket = io(ENDPOINT);

    
    //set up order socket event handlers here..
    socket.on('orders-data', function (data) 
    {  
       document.getElementById("chat").innerHTML = "<h3>Please scroll down for CHAT-HISTORY<h3>";
       
        var Obj = JSON.parse(data);
        var lengthC = Obj.length; 
        let incr = 0;
        function generate_tbl(Obj) {
          // get the reference for the div
          var div = document.getElementsByTagName("div")[3];
        
          // creates a <table> element and a <tdiv> element
          var tbl = document.createElement("table");
          var tbldiv = document.createElement("tdiv");
        
          // creating all cells
          for (var i = 0; i < lengthC; i++) {
            // creates a table row
            var row = document.createElement("tr");
        
            for (var j = 0; j < 1; j++) {
               
              // Create a <td> element and a text node, make the text
              // node the contents of the <td>, and put the <td> at
              // the end of the table row
              var cell = document.createElement("td");
              var cellText = document.createTextNode(Obj[incr].user);
              cell.appendChild(cellText);
              row.appendChild(cell);
                // Create a <td> element and a text node, make the text
              // node the contents of the <td>, and put the <td> at
              // the end of the table row
             var cell = document.createElement("td");
              var cellText = document.createTextNode(Obj[incr].msg);
              cell.appendChild(cellText);
              row.appendChild(cell);
                // Create a <td> element and a text node, make the text
              // node the contents of the <td>, and put the <td> at
              // the end of the table row
              var cell = document.createElement("td");
              var cellText = document.createTextNode(Obj[incr].room);
              cell.appendChild(cellText);
              row.appendChild(cell);
                // Create a <td> element and a text node, make the text
              // node the contents of the <td>, and put the <td> at
              // the end of the table row
              var cell = document.createElement("td");
              var cellText = document.createTextNode(Obj[incr].created);
              cell.appendChild(cellText);
              row.appendChild(cell);
        
              incr++;
            }
        
            // add the row to the end of the table div
            tbldiv.appendChild(row);
          }
        
          // put the <tdiv> in the <table>
          tbl.appendChild(tbldiv);
          // appends <table> into <div>
          div.appendChild(tbl);
          // sets the border attribute of tbl to 2;
          tbl.setAttribute("border", "2");
        }
        generate_tbl(Obj) ;
        // document.getElementById("test").innerHTML = Obj[0].user;
        console.log(`chat history received from server: ${data}`)
      });
        
      
    // set up order socket event handlers here..
    socket.on('events-data', function(log) 
    {   //document.getElementById("event").innerHTML = log;
    
    var ObjE = JSON.parse(log);
    document.getElementById("chat2").innerHTML = " <h3>Please scroll down for Event-Log<h3>";
    let incr = 0;
    let length = ObjE.length;
    function generate_table(ObjE) {
        // get the reference for the div
        var div = document.getElementsByTagName("div")[4];
      
        // creates a <table> element and a <tdiv> element
        var tbl = document.createElement("table");
        var tbldiv = document.createElement("tdiv");
      
        // creating all cells
        for (var i = 0; i < length; i++) {
          // creates a table row
          var row = document.createElement("tr");
      
          for (var j = 0; j < 1; j++) {
             
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            var cellText = document.createTextNode(ObjE[incr].type);
            cell.appendChild(cellText);
            row.appendChild(cell);
              // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
           var cell = document.createElement("td");
            var cellText = document.createTextNode(ObjE[incr].name);
            cell.appendChild(cellText);
            row.appendChild(cell);
              // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            var cellText = document.createTextNode(ObjE[incr].socket);
            cell.appendChild(cellText);
            row.appendChild(cell);
              // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            var cellText = document.createTextNode(ObjE[incr].room);
            cell.appendChild(cellText);
            row.appendChild(cell);
              // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            var cellText = document.createTextNode(ObjE[incr].connect);
            cell.appendChild(cellText);
            row.appendChild(cell);
              // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            var cellText = document.createTextNode(ObjE[incr].disconnect);
            cell.appendChild(cellText);
            row.appendChild(cell);
            incr++;
          }
      
          // add the row to the end of the table div
          tbldiv.appendChild(row);
        }
      
        // put the <tdiv> in the <table>
        tbl.appendChild(tbldiv);
        // appends <table> into <div>
        div.appendChild(tbl);
        // sets the border attribute of tbl to 2;
        tbl.setAttribute("border", "2");
      }
      generate_table(ObjE) ;
      });
      console.log ('myJson First :' + myJson);




      return (

   <div className = "joinOuterContainer">
     <div className = "btn-group"><button
          onClick={() => socket.emit('get-orders')} >
          Chat-history
        </button> 
          <button
         onClick={() => socket.emit('get-logs')}>
          Event-Log
          </button>
           <AuthButton />
           </div>
          

            <div id = "chat"> </div>


        <div id = "chat2"> </div>
                 
        
   </div>

      
      );
    }
      
 export default Events;