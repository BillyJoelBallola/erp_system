import React, { useContext, useRef, useState } from "react";
import logo from '../assets/micaella-logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import { Toast } from "primereact/toast";

const Login = () => {
  const toast = useRef(); 
  const navigate = useNavigate();
  const { setCurrentUser} = useContext(UserContext);
  const [logData, setLogData] = useState({
    email: "",
    password: ""
  })

  const signIn = async (e) => {
    e.preventDefault();
    if(logData.email === "" || logData.password === "") {
      return toast.current.show({ severity: 'info', summary: 'Login Message', detail: 'Fill up all fields.', life: 3000 });
    }
    const { data } = await axios.post("/login", logData);
    if(typeof data === "object") {
      setCurrentUser(data);
      navigate("/");
    }else{
      toast.current.show({ severity: 'warn', summary: 'Loin Message', detail: data, life: 3000 });
    }
  }

  const getInputValue = (e) => {
    setLogData({...logData, [e.target.name]: e.target.value});
  }

  return (
    <>
      <Toast ref={toast}/>
      <div className="w-screen h-screen grid place-content-center font-roboto">
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-4">
            <div>
              <img
                className="w-32"
                src={logo}
                alt="micaella's logo" />
            </div>
            <div className="h-full w-[2px] bg-gray-400"></div>
            <div className="font-bold">
              <span className="text-5xl tracking-[.5rem]">ERP</span>
                <br/>
              <span className="text-md tracking-[.5rem]">SYSTEM</span>
            </div>
          </div>
          <form className="flex flex-col gap-4 w-[300px]" onSubmit={signIn}>
            <div className="form-group">
              <label htmlFor="Email">Email</label>
              <input type="text" name="email" placeholder="Email Address" onChange={getInputValue}/>
            </div>
            <div className="form-group">
              <label htmlFor="Username">Password</label>
              <input type="password" name="password" placeholder="Password" onChange={getInputValue}/>
            </div>
            <a href="" className="text-right text-sm underline">Forget password?</a>
            <button type="submit" className="btn-dark">Sign in</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
