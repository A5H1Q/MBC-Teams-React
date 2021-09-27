import {useState} from "react";

const Login = (props) => {
 const [input, setInputCode] = useState(""); // Keyboard Input
 const [loader, showLoader] = useState(false);
 const [error, setErrMsg] = useState("");

 async function onFormSubmit(e) {
  e.preventDefault();
  if (input === "") return;

  showLoader(true);
  var response = await fetch("https://script.google.com/macros/s/AKfycby7pHDxW0LU4qUILHr8s06J9XiBdJpsT0P2mGEt7Dru2xuQkOCO/exec?code=" + input);
  var data = await response.json();

  if (data.status === "hehe") {
   setErrMsg("#ff4a4a"); // Red HexCode
   showLoader(false);
  } else {
   localStorage.setItem("myAuth", input);
   localStorage.setItem("myLinks@" + props.checks[1], JSON.stringify(data));
   props.checks[0]();
  }
 }

 return (
  <form className="dialogBox" onSubmit={onFormSubmit}>
   {loader ? (
    <div>
     <label htmlFor="pwd">Loading..</label>
     <div className="mega spinner"></div>
    </div>
   ) : (
    <div>
     <label htmlFor="pwd">Access Code</label>
     <input
      onInput={(e) => {
       setInputCode(e.target.value);
      }}
      style={{color: error}}
      value={input}
      placeholder="Enter code here"
      type="number"
      name="pwd"
     />
     {error !== "" ? <div id="err">Yup, Thats a Wrong code.</div> : null}
     <h5>
      This is a one time password, to help secure meeting links from strangers.
      <br />
      <br />
      <a target="_blank" rel="noreferrer" href="https://script.google.com/a/mbcpeermade.com/macros/s/AKfycbxW9FJiofU_4ArUpddBIbR0pfMPjPJ6BwZ7zttTJsHx9SesLL8/exec">
       Don't have a code? Request your code
      </a>
     </h5>
    </div>
   )}
  </form>
 );
};

export default Login;
