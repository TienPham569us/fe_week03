'use client';
import { ApiManager } from "@/api_manager/ApiManager";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, FocusEvent } from "react";
import validator from "validator";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (e: FocusEvent<HTMLInputElement>) => {
    const tempEmail = email;
    if (!tempEmail) {

      setInvalidEmail("Email is required");

    } else if (!validator.isEmail(tempEmail)) {

      setInvalidEmail("Email has invalid format");
      
    } else {
      setInvalidEmail("");
    }
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!email || !validator.isEmail(email)) {
      return;
    }
    try {
      const response = await ApiManager.register({ email, password, username });
      const data = await response.json();
      //console.log(response);
      console.log(data);
      console.log(response.status);
      if (400 <= response.status && response.status < 500) {
        if (data.message && Array.isArray(data.message)) {

          const formattedMessages = data.message.map((msg: string) => {
            if (msg.includes("username must match /^[a-zA-Z0-9_]+$/ regular expression")) {
              return "invalid username";
            }
            return msg;
          });

          setError(formattedMessages.join(", \n "));
          setMessage("");
        } else if (data.message && typeof data.message === "string") {
          setError(data.message);
          setMessage("");
        } else {
          setError('An unknown error occurred.');
        }
      } else if (200 <= response.status && response.status < 300) {
        setError("");
        setMessage(data.data.success);
        setPassword("");
        //window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
      return;
    }
    
  } 

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white">
      <Link href={'/'} className="return-btn ">
        <h1>Go back to Home Page</h1>
      </Link>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <div className="flex flex-row text-black">
          <h1 className="text-[#22d3ee]">Register Page</h1>
        </div>
        <form method="POST" //action={"/api/register"}
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col justify-center flex-wrap">
          <label className="label-style">Email</label>
          <input type="text" id="email" name="email" 
            className="input-style"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateEmail(e)}
            required/>
          {
           (invalidEmail && invalidEmail.length!=0) 
           ? (<text className="text-error">
            {invalidEmail}
           </text>)
            : null
          }

          <label className="label-style">Username</label>
          <input type="text" id="email" name="email" 
            className="input-style"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required/>
         
          

          <label className="label-style">Password</label>
          <input type="password" id="password" name="password" className="input-style"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>

          <button className="button-style" 
            type="submit" >
              Register
          </button>
          {
            (message && message.length!=0) 
            ? (<text className="msg-success">
              {message}
            </text>)
            : null
          }

          {
            (error && error.length!=0) 
            ? (<text className="text-error font-bold">
              {error}
            </text>)
            : null
          }
        </form>
        <div className="flex flex-row text-black">
          <p>Already have account?</p>
          <span className="mx-1"></span>
          <Link href="/login"
            className="text-[#1d4ed8]">
            Login now!
          </Link>
        </div>
        
      </main>
    </div>
  );
}
