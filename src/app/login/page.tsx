'use client';
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, FocusEvent } from "react";
import validator from "validator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (e: FocusEvent<HTMLInputElement>) => {
    const tempEmail = email;
    if (!tempEmail) {

      setError("Email is required");

    } else if (!validator.isEmail(tempEmail)) {

      setError("Email has invalid format");
      
    } else {
      setError("");
    }
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !validator.isEmail(email)) {
      //setError("Email has invalid format");
      return;
    }
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
  } 

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white">
       <Link href={'/'} className="return-btn ">
        <h1>Go back to Home Page</h1>
      </Link>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <div className="flex flex-row text-black">
          <h1 className="text-[#22d3ee]">Login Page</h1>
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
           (error && error.length!=0) 
           ? (<text className="text-error">
            {error}
           </text>)
            : null
          }
          

          <label className="label-style">Password</label>
          <input type="password" id="password" name="password" className="input-style"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>

          <button className="button-style" 
            type="submit">
            Login
          </button>
        </form>
        <div className="flex flex-row text-black">
          <p>Don't have account?</p>
          <span className="mx-1"></span>
          <Link href="/register"
            className="text-[#1d4ed8]">
            Sign up now!
          </Link>
        </div>
        
      </main>
    </div>
  );
}
