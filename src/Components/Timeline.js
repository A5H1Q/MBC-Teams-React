import {useState, useEffect} from "react";

const Timeline = (props) => {
 const [msg, setMsg] = useState("No Logs");

 const paintTimeline = () => {
  //   //   var activSub;
  var now = new Date();
  var curr_Hour = now.getHours();
  var curr_Min = now.getMinutes();
  var curr_Tym = "No Logs";
  var myLinks = JSON.parse(localStorage.getItem("myLinks@" + props.version));
  for (var i = 0; i < myLinks.timetable.hrsEnd.length; i++) {
   if (curr_Hour < myLinks.timetable.hrsEnd[i][0]) {
    if (curr_Min < myLinks.timetable.hrsEnd[i][1]) {
     curr_Tym = i + 1 + " Period, Time: " + myLinks.timetable.hrsEnd[i][0] + " : " + myLinks.timetable.hrsEnd[i][1];
     break;
    }
   }
  }
  setMsg(curr_Tym);
  //   //   console.log(myLinks.timetable.hrsEnd[0][0]);
  //   //   const t1 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 50);
  //   //   const t2 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 50);
  //   //   const t3 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 50);
  //   //   const t4 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 50);
  //   //   const t5 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30);
  //   //   var weeks = ["mon", "tue", "wen", "thu", "fri"];
  //   //     // Handle Saturday and Sunday
  //   //     if(now.getDay() == 0 || now.getDay() == 6){
  //   //       // Timeline-Painter 🖌
  //   //     }else{
  //   //       // Handle Rest of the days [M-T-W-Th-F]
  //   //       if(now.getTime() < t1.getTime()){activSub=weeks[now.getDay()][0];}
  //   //       else if(now.getTime() < t2.getTime()){activSub=weeks[now.getDay()][1];}
  //   //       else if(now.getTime() < t3.getTime()){activSub=weeks[now.getDay()][2];}
  //   //       else if(now.getTime() < t4.getTime()){activSub=weeks[now.getDay()][3];}
  //   //       else if(now.getDay() !== 5 && now.getTime() < t5.getTime()){activSub=weeks[now.getDay()][4];}
  //   //       else{
  //   //         // Class Finished :[
  //   //         // Auto-select Next-Day as default
  //   //         activSub= weeks[now.getDay()+1][0];
  //   //         if(now.getDay() == 5){
  //   //           document.getElementById("header").innerHTML="Monday<div id='dot'></div><span id='clk'>9:00 AM</span>";
  //   //         }else{
  //   //           Today=weeks[now.getDay()+1];
  //   //           document.getElementById("header").innerHTML=Today[Today.length-1]+"<div id='dot'></div><span id='clk'>9:00 AM</span>";
  //   //         }
  //   //       }
  //   //       // Timeline-Painter 🖌
  //   //     }
 };

 useEffect(() => {
  paintTimeline();
 });

 return <div className="card">{msg}</div>;
};
export default Timeline;
