import React from "react";
class Classwork extends React.Component {
 state = {isSignedIn: null};

 componentDidMount() {
  window.gapi.load("client:auth2", () => {
   window.gapi.client
    .init({
     clientId: "1078243481673-i0s7ojl6edh7ljn13v1vg92fth4n06g3.apps.googleusercontent.com",
     scope: "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    })
    .then(() => {
     console.log("hi");
     this.auth = window.gapi.auth2.getAuthInstance();
     this.handleAuthChange();
     this.auth.isSignedIn.listen(this.handleAuthChange);
    });
  });
 }

 handleAuthChange = () => {
  this.setState({isSignedIn: this.auth.isSignedIn.get()});
 };

 handleSignIn = () => {
  this.auth.signIn();
 };

 handleSignOut = () => {
  this.auth.signOut();
 };

 handleData = () => {
  return null;
 };

 renderAuthButton() {
  if (this.state.isSignedIn === null) {
   return null;
  } else if (this.state.isSignedIn) {
   console.log("Spinner");
   /*
   window.gapi.client.setApiKey("AIzaSyC7hUvLIATJ3-DH3qIvIxf7k5hOQ3hkxe0");
   window.gapi.client.load("https://classroom.googleapis.com/$discovery/rest?version=v1").then(
    function () {
     console.log("window.gapi client loaded for API");
     window.gapi.client.classroom.courses.courseWork.studentSubmissions
      .list({
       courseId: "301391202547",
       courseWorkId: "-",
       states: ["CREATED", "RECLAIMED_BY_STUDENT", "NEW"],
      })
      .then(
       function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
       },
       function (err) {
        console.error("Execute error", err);
       }
      );
    },
    function (err) {
     console.error("Error loading window.gapi client for API", err);
    }
   );
*/
   return <button onClick={this.handleSignOut}>Sign Out</button>;
  } else {
   return <button onClick={this.handleSignIn}>Sign in with Google</button>;
  }
 }
 render() {
  return (
   <div className="classworkBox card">
    <div className="titlebar_2">
     <h4>Assignments</h4>
    </div>
    <div className="text">Account checking.. Add Mbcbot to use this feature {this.renderAuthButton()}</div>
   </div>
  );
 }
}

export default Classwork;
