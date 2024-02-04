import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThingSpeakComponent from "./thingspeak";
import AllDataComponent from "./Datacomp";

const App = () => {
  return (
    <Router>
      <div>
        <header className="w-[100%] h-[40%] bg-slate-600">
          <h1 className="w-[100%] h-[10vh] text-white text-3xl p-4">Health report</h1>
        </header>
        <Routes>
          <Route path="/" element={<ThingSpeakComponent />} />
          <Route path="/alldata" element={<AllDataComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
