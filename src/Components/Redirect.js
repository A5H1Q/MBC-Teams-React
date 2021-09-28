import {useState, useEffect} from "react";

const Redirect = (props) => {
 const [today, setToday] = useState("Monday");
 const [redirect, setAutoRedirect] = useState(false);
 const [flag, randomFlag] = useState(true);

 const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
 var now = new Date();

 const t1 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 50);
 const t2 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 50);
 const t3 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 50);
 const t4 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 50);
 const t5 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 20);
 const sub = props.data.timetable[today][props.calc[0] + 1];

 const calcSub = () => {
  // For [Sa-Su]*days
  if (now.getDay() === 0 || now.getDay() === 6) {
   props.calc[1](-1);
   setToday("Monday");
   randomFlag(false);
  } else {
   // For [M-T-W-Th-F]*days
   setToday(weeks[now.getDay()]);
   setAutoRedirect(true);
   if (now.getTime() < t1.getTime()) {
    props.calc[1](-1);
   } else if (now.getTime() < t2.getTime()) {
    props.calc[1](0);
   } else if (now.getTime() < t3.getTime()) {
    props.calc[1](1);
   } else if (now.getTime() < t4.getTime()) {
    props.calc[1](2);
   } else if (now.getDay() !== 5 && now.getTime() < t5.getTime()) {
    props.calc[1](3);
   } else {
    // Class Finished 😭 Auto-select Next-Day as default

    setAutoRedirect(false);
    randomFlag(false);
    if (now.getDay() === 5) {
     // Friday Afternoon
     setToday(weeks[1]);
    } else {
     // Normal Noons..
     setToday(weeks[now.getDay() + 1]);
    }
    props.calc[1](-1);
   }
  }
 };

 useEffect(() => {
  calcSub();
  if (flag && props.data.links[sub].link !== "nope" && localStorage.getItem("myRedirect") === "true") {
   setAutoRedirect(true);
  } else {
   setAutoRedirect(false);
  }
  // eslint-disable-next-line
 }, [flag, sub]);

 useEffect(() => {
  let timer1 = setTimeout(() => {
   redirect ? (window.location.href = props.data.links[sub].link) : console.log("Redirection Aborted");
  }, 3000);
  return () => {
   clearTimeout(timer1);
  };
 }, [redirect]);

 return (
  <div className="RedirectBox card">
   <div className="titlebar_2">
    <h4>
     Upcoming class..
     {redirect && <div className="mini spinner"></div>}
    </h4>
   </div>
   <div>
    <div className="R-wrap">
     <img className="R-pic" src={"Images/" + props.data.links[sub].id + ".jpg"} alt="Thumb" />
     <div className="R-text">
      <h3>{sub}</h3>
      <span>{props.data.links[sub].tchr}</span>
     </div>
    </div>
    <div className="R-action">
     {props.data.links[sub].link === "nope" ? (
      <div className="R-404">- No link Assigned :(</div>
     ) : redirect ? (
      <button
       onClick={() => {
        setAutoRedirect(false);
       }}
       className="cancel btn"
      >
       Cancel
      </button>
     ) : (
      <a href={props.data.links[sub].link} target="_self" className="join btn">
       Join Meet
      </a>
     )}
    </div>
   </div>
  </div>
 );
};

export default Redirect;
