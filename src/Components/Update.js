import {useEffect} from "react";
const Update = (props) => {
 async function updateData() {
  var pwd = localStorage.getItem("myAuth");
  var response = await fetch("https://script.google.com/macros/s/AKfycby7pHDxW0LU4qUILHr8s06J9XiBdJpsT0P2mGEt7Dru2xuQkOCO/exec?code=" + pwd);
  var data = await response.json();

  if (data.status === "hehe") {
   //? Hmm.. Wrong Access code! => Perform Reset
   var theme = localStorage.getItem("myTheme");
   localStorage.clear();
   localStorage.setItem("myTheme", theme);
  } else {
   // Store New Links
   localStorage.setItem("myLinks@" + props.checks[1], JSON.stringify(data));
  }
  props.checks[0]();
 }

 useEffect(() => {
  updateData();
 });

 return (
  <div className="card">
   <label>Updating links..</label>
   <div className="spinner"></div>
   <h5>We're gathering the latest data for you. This process is automatic and happens whenever a change is detected.</h5>
  </div>
 );
};
export default Update;
