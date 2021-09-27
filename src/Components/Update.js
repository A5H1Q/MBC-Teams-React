import {useEffect} from "react";

const Update = (props) => {
 async function updateData() {
  var pwd = localStorage.getItem("myAuth");
  var response = await fetch("https://script.google.com/macros/s/AKfycby7pHDxW0LU4qUILHr8s06J9XiBdJpsT0P2mGEt7Dru2xuQkOCO/exec?code=" + pwd);
  var data = await response.json();

  if (data.status === "hehe") {
   //? Gormo: Huh.. Look, the Server giggles!
   // Yoda: Perform Reset, you Must!

   var theme = localStorage.getItem("myTheme");
   localStorage.clear();
   localStorage.setItem("myTheme", theme);
  } else {
   // Let' Store the New Data
   localStorage.setItem("myLinks@" + props.checks[1], JSON.stringify(data));
  }
  props.checks[0]();
 }

 useEffect(() => {
  updateData();
  // eslint-disable-next-line
 }, []);

 return (
  <div className="dialogBox">
   <label>Updating links..</label>
   <div className="mega spinner"></div>
   <h5>We're collecting the latest data for you, This process is automatic and happens whenever a change is detected on cloud.</h5>
  </div>
 );
};

export default Update;
