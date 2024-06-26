import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import ThingSpeakComponent from "./thingspeak";
import AllDataComponent from "./Datacomp";

import Login from "./login";

const App = () => {
  // Check if channelId exists in localStorage
  const channelId = localStorage.getItem('chanelId');

  return (
    <Router>
      <div>
        <header className="w-[100%] h-[10%] bg-slate-600 flex items-center  ">
          <h1 className="w-[100%] h-[10vh] text-white text-3xl p-4">
            <Link to="/">Health report</Link>
          </h1>
          <h1 className="w-[100%] h-[10vh] text-white text-lg p-4 flex items-center flex-row-reverse">
            <Link to="/alldata">Show all reports</Link>
          </h1>
        </header>
        <Routes>
          {/* Redirect based on localStorage */}
          {!channelId && <Route path="/" element={<Navigate to="/login" />} />}
          {channelId && <Route path="/" element={<ThingSpeakComponent />} />}
          <Route path="/alldata" element={<AllDataComponent />} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
