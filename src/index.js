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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const DOMPurify = require("dompurify")(window);
const MySwal = withReactContent(Swal);
const Ver = 4.0; // API Data Version
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
 const [redirectOption, setredirectOption] = useState();
 const [noteTracker, setnoteTracker] = useState(null);
 const highlights = []
 const preHighlight = JSON.parse(localStorage.getItem("myNoteDb"))
 if(preHighlight)
 {
preHighlight.map((data,index) => {
    highlights.push(new Date(data.id))
})
 }
 // Calender Configs see: @natscale/react-calender
 const [calOptions] = useState({
  useDarkMode: false,
  startOfWeek: 0,
  disablePast: true,
  highlights: highlights,
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
    setredirectOption(localStorage.getItem("myRedirect"));
    setnoteTracker(JSON.parse(localStorage.getItem("myNoteDb")));
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
 // Checking Redirect option
 function changeRedirectOption() {
  if (localStorage.getItem("myRedirect") === "true") {
   localStorage.setItem("myRedirect", "false");
   setredirectOption(false);
  } else {
   localStorage.setItem("myRedirect", "true");
   setredirectOption(true);
  }
 }
 // Add and Display Calander Notes
 function remainderBook(value) {
  setCalVal(value);
  let securePrecheck;
  var displayNote;
  if (noteTracker) {
   securePrecheck = noteTracker.findIndex((e) => e.id === value.valueOf());
  } else {
   securePrecheck = -1;
  }
  if (securePrecheck < 0) {
   displayNote = "No Notes";
  } else {
   displayNote = noteTracker[securePrecheck].noteData;
  }
  MySwal.fire({
   title: "Notes",
   html: DOMPurify.sanitize(displayNote),
   footer: "Powered By ⚡ MBC Teams",
   input: "text",
   inputPlaceholder: "Add New Note",
   showCancelButton: true,
   cancelButtonText:
    '<i class="fa fa-thumbs-up"></i> Clear Notes',
   didOpen: () => {
    MySwal.clickConfirm();
   },
  }).then((result) => {
    if(result.dismiss==="cancel")
    {
        let currentDb = JSON.parse(localStorage.getItem("myNoteDb"));
        let outputArray = currentDb.filter(notesData => notesData.id !== value.valueOf());
        localStorage.setItem("myNoteDb",JSON.stringify(outputArray));
        setnoteTracker(JSON.parse(localStorage.getItem("myNoteDb")));
    
    }
   if (result.value !== undefined && result.value !== "") {
    let oldData = JSON.parse(localStorage.getItem("myNoteDb"));
    if (typeof oldData == "object" && oldData !== null) {
     let newData = {
      id: value.valueOf(),
      noteData: DOMPurify.sanitize(result.value),
     };
     if (securePrecheck >= 0) {
      let replaceModifiedData = [...oldData];
      replaceModifiedData[securePrecheck].noteData = DOMPurify.sanitize(result.value);
      localStorage.setItem("myNoteDb", JSON.stringify(replaceModifiedData));
      setnoteTracker(replaceModifiedData);
     } else {
      let moddifiedData = [...oldData, newData];
      setnoteTracker(moddifiedData);
      localStorage.setItem("myNoteDb", JSON.stringify(moddifiedData));
     }
    } else {
     let newData = [
      {
       id: value.valueOf(),
       noteData: DOMPurify.sanitize(result.value),
      },
     ];
     setnoteTracker(newData);
     localStorage.setItem("myNoteDb", JSON.stringify(newData));
    }
   }
  });
 }
 return (
  <div className="App">
   <header>
    <h3
     onClick={() => {
      window.location.reload();
     }}
    >
     MBC Teams
    </h3>
    <div className="Iconbox">
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
     {homepage && (
      <label className="switch" title="Toggle Auto Redirect">
       <input type="checkbox" onClick={changeRedirectOption} defaultChecked={redirectOption === "true" ? true : false} id="togBtn" />
       <div className="slider round"></div>
      </label>
     )}
    </div>
   </header>

   {testing && <Testing />}
   {login && <Login checks={[initChecks, Ver]} />}
   {update && <Update checks={[initChecks, Ver]} />}
   {homepage && (
    <div className="container">
     <Redirect calc={[index, setIndex]} data={JSON.parse(localStorage.getItem("myLinks@" + Ver))} />
     <Classwork data={JSON.parse(localStorage.getItem("myLinks@" + Ver))} />
     <Timeline spin={minispin} next={index} att={attendence} data={JSON.parse(localStorage.getItem("myLinks@" + Ver))} />

     <div className="calenderBox">
      <Calendar {...calOptions} value={calval} onChange={(value) => remainderBook(value)} />
     </div>
    </div>
   )}

   <footer className={!homepage ? "footer-fixed" : null}>Copyright © 2022. MBC Teams 4.0 Inc</footer>
  </div>
 );
};

ReactDOM.render(
 <React.StrictMode>
  <App />
 </React.StrictMode>,
 document.getElementById("root")
);
