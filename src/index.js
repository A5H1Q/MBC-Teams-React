import "./index.css";
import "./Components/calender.css";
import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {ReactComponent as LightIco} from "./Icons/bright.svg";
import {ReactComponent as DarkIco} from "./Icons/dark.svg";
import {ReactComponent as GraphIco} from "./Icons/graph.svg";
import Testing from "./Components/Testing.js";
import Login from "./Components/Login.js";
import Update from "./Components/Update.js";
import Classwork from "./Components/Classwork.js";
import Redirect from "./Components/Redirect.js";
import Timeline from "./Components/Timeline.js";
import {Calendar} from "@natscale/react-calendar";

const Ver = 1.0; // API Data Version
const Bug = 0; // Invoke Maintenance Mode

const App = () => {
 const [mode, applyDark] = useState(false);
 const [testing, showMaintenanceBox] = useState(false);
 const [login, showLogin] = useState(false);
 const [update, showUpdate] = useState(false);
 const [homepage, showHomeUI] = useState(false);
 const [calval, setCalVal] = useState(new Date());
 const [minispin, showMiniSpinner] = useState(false);
 const [attendence, setAttendence] = useState(0);
 const [index, setIndex] = useState(0);

 // Calender Configs see: @natscale/react-calender
 const [calOptions] = useState({
  useDarkMode: false,
  startOfWeek: 0,
  disablePast: true,
 });

 // Startup Checks
 const initChecks = () => {
  var theme;
  // 1. Theme Check
  if (localStorage.getItem("myTheme") === null) {
   localStorage.setItem("myTheme", "light");
   theme = "light";
  } else {
   theme = localStorage.getItem("myTheme");
   theme === "dark" ? applyDarkTheme(true) : applyDarkTheme(false);
  }

  if (Bug >= 1) {
   // 2. Maintenance Mode Check
   showMaintenanceBox(true);
  } else if (localStorage.getItem("myAuth") === null) {
   // 3. Authorization Check

   showUpdate(false);
   showLogin(true);
  } else {
   // 4. Data Version Check
   //! Version Conflict => Request an update
   if (localStorage.getItem("myLinks@" + Ver) === null) {
    var pwd = localStorage.getItem("myAuth");
    var Ad = localStorage.getItem("myAdmsn") !== null ? localStorage.getItem("myAdmsn") : 0;
    localStorage.clear(); // Clear All Prev Keys
    localStorage.setItem("myTheme", theme);
    localStorage.setItem("myAuth", pwd);
    if (Ad !== 0) {
     localStorage.setItem("myAdmsn", Ad);
    }
    showUpdate(true);
   } else {
    showLogin(false);
    showUpdate(false);
    showHomeUI(true); // Welcome Home Señor
   }
  }
 };

 // Toggle Dark mode
 const applyDarkTheme = (x) => {
  x ? (calOptions.useDarkMode = true) : (calOptions.useDarkMode = false);
  applyDark(x);
  var root = document.querySelector(":root");
  if (x) {
   root.style.setProperty("--nav", "#202020");
   root.style.setProperty("--card", "#282828");
   root.style.setProperty("--txt", "#fff");
   root.style.setProperty("--bg", "#4e4e4e");
   root.style.setProperty("--shadow", "#363636");
   localStorage.setItem("myTheme", "dark");
  } else {
   root.style.setProperty("--nav", "#fff");
   root.style.setProperty("--card", "#fff");
   root.style.setProperty("--txt", "#000");
   root.style.setProperty("--bg", "#d2d2d2");
   root.style.setProperty("--shadow", "#a9a9a9");
   localStorage.setItem("myTheme", "light");
  }
 };

 // Scrap Attendence from Portal
 const mbcPortal = () => {
  if (localStorage.getItem("myAdmsn") === null) {
   var x = parseInt(prompt("Enter Admission No."), 10);
   if (isNaN(x)) {
    alert("Invalid Admission No");
   } else {
    localStorage.setItem("myAdmsn", x);
    showMiniSpinner(true);
    fetchApi();
   }
  } else {
   showMiniSpinner(true);
   fetchApi();
  }
 };

 async function fetchApi() {
  var response = await fetch("https://script.google.com/macros/s/AKfycby7pHDxW0LU4qUILHr8s06J9XiBdJpsT0P2mGEt7Dru2xuQkOCO/exec?Ad=" + localStorage.getItem("myAdmsn"));
  var data = await response.json();
  console.log(data);
  if (data.sta === "failed") {
   localStorage.removeItem("myAdmsn");
   alert("Invalid Admission No.");
  } else {
   setAttendence(data);
  }
  showMiniSpinner(false);
 }

 useEffect(() => {
  initChecks(); // Routine Initial Checks (onstartup)
  // eslint-disable-next-line
 }, []);

 return (
  <div className="App">
   <header>
    <h3>One Link</h3>
    <div>
     {homepage && <GraphIco title="Check Attendence" onClick={mbcPortal} />}
     {mode ? (
      <LightIco
       title="Apply Lightmode"
       onClick={() => {
        applyDarkTheme(false);
       }}
      />
     ) : (
      <DarkIco
       title="Apply Darkmode"
       onClick={() => {
        applyDarkTheme(true);
       }}
      />
     )}
    </div>
   </header>

   {testing && <Testing />}
   {login && <Login checks={[initChecks, Ver]} />}
   {update && <Update checks={[initChecks, Ver]} />}
   {homepage && (
    <div className="container">
     <Redirect calc={[index, setIndex]} data={JSON.parse(localStorage.getItem("myLinks@" + Ver))} />
     <Classwork />
     <Timeline spin={minispin} next={index} att={attendence} data={JSON.parse(localStorage.getItem("myLinks@" + Ver))} />
     <div className="calenderBox">
      <Calendar
       {...calOptions}
       value={calval}
       onChange={(value) => {
        setCalVal(value);
       }}
      />
     </div>
    </div>
   )}

   <footer className={!homepage ? "footer-fixed" : null}>Copyright © 2022. MBC Teams Inc</footer>
  </div>
 );
};

ReactDOM.render(
 <React.StrictMode>
  <App />
 </React.StrictMode>,
 document.getElementById("root")
);
