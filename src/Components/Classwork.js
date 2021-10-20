import React, {useState, useEffect, useRef} from "react";
import {ReactComponent as Add} from "../Icons/plus.svg";
import {ReactComponent as Remove} from "../Icons/minus.svg";

const Classwork = (props) => {
 const [isSignedIn, setSignedIn] = useState(null);
 const [isComplete, setCompleted] = useState(false);
 const [pending, setPending] = useState([]);
 const [msg, setMsg] = useState("");
 const auth = useRef({});

 useEffect(() => {
  window.gapi.load("client:auth2", () => {
   window.gapi.client
    .init({
     clientId: props.data.CID,
     scope: "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    })
    .then(() => {
     auth.current = window.gapi.auth2.getAuthInstance();
     handleAuthChange();
     auth.current.isSignedIn.listen(handleAuthChange);
    });
  });
  // eslint-disable-next-line
 }, []);

 useEffect(() => {
  if (isSignedIn) {
   window.gapi.client.setApiKey(props.data.APK);
   window.gapi.client.load("https://classroom.googleapis.com/$discovery/rest?version=v1").then(
    () => {
     var count = 0;
     for (let i = 0; i < props.data.CORS.length; i++) {
      window.gapi.client.classroom.courses.courseWork.studentSubmissions
       .list({
        courseId: props.data.CORS[i],
        courseWorkId: "-",
        states: ["CREATED", "RECLAIMED_BY_STUDENT", "NEW"],
       })
       .then(
        // eslint-disable-next-line no-loop-func
        (resp1) => {
         if (resp1.status === 200 && resp1.result.studentSubmissions) {
          for (let j = 0; j < resp1.result.studentSubmissions.length; j++) {
           window.gapi.client.classroom.courses.courseWork
            .list({
             courseId: resp1.result.studentSubmissions[j].courseId,
             orderBy: "dueDate",
            })
            .then(
             (resp2) => {
              for (let k = 0; k < resp2.result.courseWork.length; k++) {
               if (resp2.result.courseWork[k].id === resp1.result.studentSubmissions[j].courseWorkId) {
                setPending((pending) => [...pending, {title: resp2.result.courseWork[k].title, link: resp2.result.courseWork[k].alternateLink}]);
                setCompleted(true);
               }
              }
             },
             (err3) => {
              console.log(err3);
              setMsg("Exec code-3");
              setCompleted(true);
             }
            );
          }
         } else {
          count++;
          // console.log(count);
          if (count === props.data.CORS.length) {
           setMsg("No Pending Assignments :)");
           setCompleted(true);
          }
         }
        },
        (err2) => {
         console.log(err2);
         setMsg("Exec code-2");
         setCompleted(true);
        }
       );
     }
    },
    (err1) => {
     console.log(err1);
     setMsg("Error code-1");
     setCompleted(true);
    }
   );
  }
  // eslint-disable-next-line
 }, [isSignedIn]);

 const handleAuthChange = () => {
  setSignedIn(auth.current.isSignedIn.get());
 };

 const handleSignIn = () => {
  auth.current.signIn();
 };

 const handleSignOut = () => {
  auth.current.signOut();
  setPending([]);
  setMsg("");
 };

 const RenderIcon = () => {
  if (isSignedIn === null) {
   return <div className="spinner mini"></div>;
  } else if (isSignedIn) {
   return <Remove title="Disconnect" onClick={handleSignOut} />;
  } else {
   return <Add title="Connect bot" onClick={handleSignIn} />;
  }
 };
 const LoadingMsg = () => {
  if (!isComplete) {
   if (isSignedIn == null) {
    return <div className="text">Loading.. Please wait..</div>;
   } else {
    if (isSignedIn) {
     return <div className="text">Looking for pending Assignments...</div>;
    } else {
     return <div className="text">Account not connected.. Add Mbcbot to use this feature</div>;
    }
   }
  } else {
   return null;
  }
 };
 const Tasks = () => {
  if (isComplete) {
   if (isSignedIn) {
    return (
     <ul className="tasks">
      {pending.map((x, i) => (
       <li key={i}>
        <a target="_blank" rel="noreferrer" href={x.link + "?authuser=1"}>
         {x.title}
        </a>
       </li>
      ))}
     </ul>
    );
   } else {
    return <div className="text">Account not connected.. Add Mbcbot to use this feature</div>;
   }
  } else {
   return null;
  }
 };
 return (
  <div className="classworkBox card">
   <div className="titlebar_2">
    <RenderIcon />
    <h4>Assignments</h4>
   </div>
   <LoadingMsg />
   {msg !== "" ? <div className="text">{msg}</div> : null}
   <Tasks />
   <div className="text hidden">User Data is fetched from Mbcbot</div>
  </div>
 );
};

export default Classwork;
