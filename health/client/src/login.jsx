// Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [chanelId, setChanelId] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // You can implement your login logic here, such as sending a request to a backend API
    // For this example, I'm just storing the chanelId in localStorage
    localStorage.setItem("chanelId", chanelId);
    window.location.href = "/";
    console.log("Chanel ID:", chanelId);
  };

  return (
    <div className=" flex flex-col h-[90vh] justify-center items-center p-40 bg-gray-100 ">
      <form onSubmit={handleLogin} className="shadow-full bg-white px-20 py-5">
        <h1 className="flex justify-center items-center py-6 text-slate-600 font-bold text-xl">
          Welcome Back
        </h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="chanelId" className="font-semibold ">
            Channel ID
          </label>
          <input
            type="text"
            id="chanelId"
            placeholder="Enter Your Channel Id"
            value={chanelId}
            className="border border-black px-1 py-1"
            onChange={(e) => setChanelId(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="border px-2 py-2 text-white bg-slate-600 rounded-lg  my-4 w-full"
        >
          Login
        </button>
        <div className="flex flex-col justify-center items-center py-4 ">
          <p className="text-gray-400 cursor-pointer">Forgot your Id?</p>
          <p className="text-gray-400 cursor-pointer">Don't you have an account?</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
