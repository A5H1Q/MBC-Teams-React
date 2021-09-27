import {useState, useEffect} from "react";
import {ReactComponent as ArrowIcon} from "../Icons/arrow.svg";

const Timeline = (props) => {
 var now = new Date();

 const FrilastPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 50);
 const GenlastPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 20);

 const [timeline, setTimeline] = useState([]); // Subjects List
 const [fSwitch, setFSwitch] = useState(false); // Friday Kill switch
 const [day, setDay] = useState(0);

 const weeks = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
 const Today = now.getDay();

 const isPast = (x) => {
  if (Today === 0 || Today === 6) {
   return "item";
  } else if (now.getTime() > GenlastPeriod.getTime() && day === Today - 1) {
   // General Afternoon
   return "item bw";
  } else if (day === Today - 1) {
   // Strike out Finished classes from Present dayline
   if (props.next >= x) {
    return "item bw";
   } else {
    return "item";
   }
  } else if (day < Today - 1) {
   // Strike out Past days
   return "item bw";
  } else {
   return "item";
  }
 };

 useEffect(() => {
  Today === 0 || Today === 6 ? setDay(0) : setDay(Today - 1);
  if (now.getDay() === 5 && now.getTime() > FrilastPeriod.getTime()) {
   // Friday Afternoon
   setFSwitch(true);
   setDay(0);
  } else {
   setTimeline(props.data.timetable[weeks[day]]);
  }
  // eslint-disable-next-line
 }, []);

 useEffect(() => {
  setTimeline(props.data.timetable[weeks[day]]);
  // eslint-disable-next-line
 }, [day]);

 return (
  <div className="timelineBox card">
   <div className="titlebar_1">
    <ArrowIcon
     className={day === 0 ? "disabled" : null}
     title="Go Backward"
     onClick={() => {
      setDay(day - 1);
     }}
    />
    <h3>{Today !== 5 && day === Today - 1 ? "Today" : weeks[day]}</h3>
    <ArrowIcon
     className={day === weeks.length - 1 ? "disabled" : null}
     title="Go Forward"
     onClick={() => {
      setDay(day + 1);
     }}
    />
   </div>

   <div className="timeline">
    {timeline.map((x, i) => (
     <div key={i} className={fSwitch ? "item" : isPast(i)}>
      <div className="strike"></div>
      <img className="dot" src={"Images/" + props.data.links[x].id + ".jpg"} alt="Faculty thumb" />
      <div
       className="content"
       onClick={() => {
        props.data.links[x].link !== "nope" ? (window.location.href = props.data.links[x].link) : alert("No link Assigned, Yet");
       }}
      >
       {props.spin ? <div className="mini spinner"></div> : props.att !== 0 ? <div className={props.att[x] < 80 ? "att danger" : "att cool"}>{props.att[x]}%</div> : null}
       <h3>{x}</h3>
       <span>{props.data.links[x].tchr}</span>
      </div>
     </div>
    ))}
   </div>
  </div>
 );
};

export default Timeline;
