import React from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";

import './Events.css';

let socket;

  const ENDPOINT = 'localhost:5000';

  // const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

  export default function Events() {

    
    socket = io(ENDPOINT);
    // set up order socket event handlers here..
    socket.on('orders-data', function (data) 
    {   
       document.getElementById("chat").innerHTML = " Please scroll down for CHAT-HISTORY";
       
        var Obj = JSON.parse(data);
        var lengthC = Obj.length; 
        let incr = 0;

        function generate_tbl(Obj) {
          // get the reference for the body
          var body = document.getElementsByTagName("body")[0];
        
          // creates a <table> element and a <tbody> element
          var tbl = document.createElement("table");
          var tblBody = document.createElement("tbody");
        
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
        
            // add the row to the end of the table body
            tblBody.appendChild(row);
          }
        
          // put the <tbody> in the <table>
          tbl.appendChild(tblBody);
          // appends <table> into <body>
          body.appendChild(tbl);
          // sets the border attribute of tbl to 2;
          tbl.setAttribute("border", "2");
        }
        generate_tbl(Obj) ;
        // document.getElementById("test").innerHTML = Obj[0].user;
        console.log(`chat history received from server: ${data}`)});
        
    // set up order socket event handlers here..
    socket.on('events-data', function(log) 
    {   //document.getElementById("event").innerHTML = log;
    
    var ObjE = JSON.parse(log);
    console.log(ObjE[0]["type"]);
    document.getElementById("chat2").innerHTML = " Please scroll down for Event-Log";
    let incr = 0;
    let length = ObjE.length;
    function generate_table(ObjE) {
        // get the reference for the body
        var body = document.getElementsByTagName("body")[0];
      
        // creates a <table> element and a <tbody> element
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");
      
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
      
          // add the row to the end of the table body
          tblBody.appendChild(row);
        }
      
        // put the <tbody> in the <table>
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        body.appendChild(tbl);
        // sets the border attribute of tbl to 2;
        tbl.setAttribute("border", "2");
      }
      generate_table(ObjE) ;
    // document.getElementById("testE").innerHTML = ObjE[0].type;
        console.log(`event logs received from server: ${log}`)});


    return (
      <div className = "joinOuterContainer">
        {/* <div><h1>Event Log and Chat History</h1></div> */}
        <div className = "btn-group" >
        <button className = "but"
          onClick={() => socket.emit('get-orders')} >
          Chat-history
        </button> 

        <button className = "but"
          onClick={() => socket.emit('get-logs')}>
          Event-Log
        </button>
        <Link to={'/'}>
      <button  className = "but" type="submit"> Log out </button>
    </Link></div>
    <div id = "chat"></div>
    <p id = "chat2"></p>

      </div>
      
    );
  };

    