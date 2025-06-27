"use client"
import React from 'react'
import Link from 'next/link'
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';
import LoginNavbar from '@/components/LoginNavbar';

interface FormInput {
  userName: string;
  userPassword: string;
  userRepeatPassword: string;
  userEmail: string;
}

export default function App() {
  const router = useRouter()
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home/Feed"); // ✅ Redirect when logged in
    }
  }, [status, router]);

  const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting, isSubmitted } } = useForm<FormInput>();
  const Router = useRouter()


  const onSubmit: SubmitHandler<FormInput> = async (data) => {

    if (data.userPassword != data.userRepeatPassword) {
      setError("userRepeatPassword", { type: "manual", message: "Password doesn't match !" })
      console.log("Password Doesn't Match")
    }
    else {

      const response = await fetch("/api/forUsers/signup/", {   // Use environment variable
        method: "POST", headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify(data)
      })
      const responseMessage = await response.json()


      if (responseMessage.status === 500) {
        setError("userEmail", { type: "manual", message: "Username Already Found!" });

      }

      else if (responseMessage.status == 200) {

        sessionStorage.setItem("tempPassword", data.userPassword); // save before redirecting to OTP page

        Router.push("/askForVerification")

      }
      else {
        setError("userName", { type: "manual", message: "Username Already Found!" });

      }
    }

  };




  return (

    <div className="mainArea bg-white items-center flex-col flex justify-center h-[90vh] lg:h-[100vh]">


      <div className="belowArea">




        <div className="right w-screen flex justify-center items-center">


          <form className='flex h-[80vh]  py-5 border-1  bg-slate-300 text-black rounded-xl flex-col  w-[80vw] lg:w-[40vw]  justify-evenly items-center' onSubmit={handleSubmit(onSubmit)}>

            <h1 className='text-3xl font-bold w-full ml-20 mb-4 text-start text-black'>Sign Up</h1>


            <input
              placeholder='Enter Your Username'
              className='bg-gray-600 w-[70vw] lg:w-[35vw] px-10 py-2 text-white m-2 rounded-md'
              {...register("userName", {
                required: "Username is required",
                maxLength: 40,

                validate: (value) =>
                  !/\s/.test(value) || "Username must not contain spaces"
              })}
            />
            {errors?.userName?.type && <p className='w-full text-start ml-15 text-[15px] italic'>{errors.userName.message}</p>}
            {errors?.userName?.type === "minLength" && <p className='w-full text-start ml-15 text-[15px] italic'>{errors.userName.message}</p>}


            <input placeholder='Enter Your Email' className='bg-gray-600 lg:w-[35vw] w-[70vw] px-10 py-2 text-white m-2 rounded-md' {...register("userEmail", {
              required: true, pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid Email",
              }, maxLength: 40
            })} />
            {errors?.userEmail?.type && <p className='w-full text-start ml-15 text-[15px] italic'>{errors.userEmail.message}</p>}



            <input placeholder='Enter Your Password' className='bg-gray-600 lg:w-[35vw] w-[70vw] px-10 py-2 text-white m-2 rounded-md' type='password' {...register("userPassword", { minLength: { value: 8, message: "Password Must be Greater than 8 Letters" } })} />
            {errors?.userPassword?.type && <p className='w-full text-start ml-15 text-[15px] italic'>{errors.userPassword.message}</p>}



            <input placeholder='Repeat Password' className='bg-gray-600 w-[70vw] lg:w-[35vw] px-10 py-2 text-white m-2 rounded-md' type="password" {...register("userRepeatPassword", {})} />

            {errors?.userRepeatPassword?.type && <p className='w-full text-black text-start ml-15 text-[15px] italic'>{errors.userRepeatPassword.message}</p>}


            {isSubmitting ? <input disabled className='bg-green-500  rounded-xl lg:w-[30vw] w-[70vw] mt-4 mb-6 cursor-pointer py-2' type="submit" value={"Loading..."} /> : <input className='bg-green-500 rounded-xl w-[70vw] lg:w-[30vw] mt-4 mb-6 cursor-pointer py-2' value={"Sign Up"} type="submit" />}

            <h1 className='mb-4'>Have an account ?<Link href={"/userLogin"}> <span className='text-blue-500 underline'>Login</span></Link></h1>

            <h1>-------------------------------------------------</h1>

            <h1>or, you can sign up with </h1>


            {/* <button  type="button" className="text-black  w-[60vw] mt-2 bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
              </svg>
              Sign in with Google
            </button> */}
            <button onClick={() => signIn("google", { callbackUrl: "/askForImage" })} type="button" className="text-white bg-slate-800 cursor-pointer  flex-row  lg:w-[25vw] mt-2 ] hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex gap-2  justify-center items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
              <img className='h-[20px]' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="" /> <h1 className='text-slate-400'>Google</h1>
            </button>





          </form>
        </div>
      </div>


    </div>



  );
}
