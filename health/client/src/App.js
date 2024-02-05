import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ThingSpeakComponent from "./thingspeak";
import AllDataComponent from "./Datacomp";

const App = () => {
  return (
    <Router>
      <div>
        <header className="w-[100%] h-[10%] bg-slate-600 flex items-center  ">
          <h1 className="w-[100%] h-[10vh] text-white text-3xl p-4">
            <Link to="/">Health report</Link>
          </h1>
          <h1 className="w-[100%] h-[10vh] text-white text-xl p-4 flex flex-row-reverse">
            <Link to="/alldata">Show all reports</Link>
          </h1>
        </header>
        <Routes >
          <Route path="/" element={<ThingSpeakComponent />} />
          <Route path="/alldata" element={<AllDataComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
