import "./index.css";
import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {ReactComponent as LightIco} from "./Icons/bright.svg";
import {ReactComponent as DarkIco} from "./Icons/dark.svg";
import Login from "./Components/Login.js";
import Update from "./Components/Update.js";
import Timeline from "./Components/Timeline.js";
// import List from "./Components/List.js";
// import Redirect from "./Components/Redirect.js";

const Ver = 5; // Software Version

const App = () => {
 const [mode, applyDark] = useState(false);
 const [login, showLogin] = useState(false);
 const [update, showUpdate] = useState(false);
 const [timeline, showTimeline] = useState(false);

 const initChecks = () => {
  var theme;
  // 1. Check Theme
  if (localStorage.getItem("myTheme") === null) {
   localStorage.setItem("myTheme", "light");
   theme = "light";
  } else {
   theme = localStorage.getItem("myTheme");
   theme === "dark" ? applyDarkTheme(true) : applyDarkTheme(false);
  }

  // 2. Check Authorization
  if (localStorage.getItem("myAuth") === null) {
   showUpdate(false);
   showLogin(true);
  } else {
   // 3. Check Version
   // Version Conflict => Request an update
   if (localStorage.getItem("myLinks@" + Ver) === null) {
    var pwd = localStorage.getItem("myAuth");
    localStorage.clear(); // Clear All Prev Keys
    localStorage.setItem("myTheme", theme);
    localStorage.setItem("myAuth", pwd);
    showUpdate(true);
   } else {
    showLogin(false);
    showUpdate(false);
    showTimeline(true);
   }
  }
 };

 // Toggle Dark mode
 const applyDarkTheme = (x) => {
  applyDark(x);
  var root = document.querySelector(":root");
  if (x) {
   root.style.setProperty("--nav", "#202020");
   root.style.setProperty("--txt", "#fff");
   root.style.setProperty("--bg", "#4e4e4e");
   root.style.setProperty("--shadow", "#363636");
   localStorage.setItem("myTheme", "dark");
  } else {
   root.style.setProperty("--nav", "#fff");
   root.style.setProperty("--txt", "#000");
   root.style.setProperty("--bg", "#d2d2d2");
   root.style.setProperty("--shadow", "#a9a9a9");
   localStorage.setItem("myTheme", "light");
  }
 };

 useEffect(() => {
  initChecks(); // Routine Initial Checks onstartup
 });

 return (
  <div className="App">
   <header>
    <h3>One Link</h3>
    <div>
     {mode ? (
      <LightIco
       onClick={() => {
        applyDarkTheme(false);
       }}
      />
     ) : (
      <DarkIco
       onClick={() => {
        applyDarkTheme(true);
       }}
      />
     )}
    </div>
   </header>

   {login && <Login checks={[initChecks, Ver]} />}
   {update && <Update checks={[initChecks, Ver]} />}
   {timeline && <Timeline version={Ver} />}

   <footer>Copyright © 2022. Onelink Inc</footer>
  </div>
 );
};

ReactDOM.render(
 <React.StrictMode>
  <App />
 </React.StrictMode>,
 document.getElementById("root")
);
/*


var jsonData = {
 status: "ok",
 links: {
  CG: {
   id: ["ac"],
   title: "Computer Graphics",
   tchr: ["Annie chacko"],
   link: "nope",
  },
  PP: {
   id: ["sj"],
   title: "Programming Paradigms",
   tchr: ["Sijimol A.S."],
   link: "nope",
  },
  CSA: {
   id: ["jg"],
   title: "Computer System Architecture",
   tchr: ["Josmy George"],
   link: "nope",
  },
  DC: {
   id: ["jmp"],
   title: "Distributed Computing",
   tchr: ["Jyolsna Mary P."],
   link: "nope",
  },
  CNS: {
   id: ["umj"],
   title: "Cryptography and Network Security",
   tchr: ["Ushus Mara Joseph"],
   link: "nope",
  },
  ML: {
   id: ["ar"],
   title: "Machine Learning",
   tchr: ["Aryalakshmi R."],
   link: "nope",
  },
  SEM: {
   id: ["ac", "ar"],
   title: "Seminar and Project Preliminary",
   tchr: ["Annie Chacko", "Aryalakshmi R."],
   link: "nope",
  },
  PT: {
   id: ["aro"],
   title: "Placement and Training",
   tchr: ["Anju Rachel Oommen"],
   link: "nope",
  },
  CDLAB: {
   id: ["aro"],
   title: "Compiler Design Lab",
   tchr: ["Anju Rachel Oommen"],
   link: "nope",
  },
 },
 timetable: {
  hrsEnd: [
   ["9", "50"],
   ["10", "50"],
   ["11", "50"],
   ["12", "50"],
   ["14", "30"],
  ],
  duration: 50,
  mon: ["CNS", "CSA", "PP", "CG", "ML"],
  tue: ["CG", "CNS", "ML", "PT", "DC"],
  wen: ["ML", "CNS", "CG", "PP", "DC"],
  thu: ["CSA", "SEM", "SEM", "CG", "PP"],
  fri: ["DC", "CSA", "PP", "CNS"],
 },
};

*/
