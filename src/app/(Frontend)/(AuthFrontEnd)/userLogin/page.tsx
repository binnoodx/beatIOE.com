"use client"
import React from 'react'
import Link from 'next/link'
import { useForm, SubmitHandler } from "react-hook-form";
import Router, { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import LoginNavbar from '@/components/LoginNavbar';
import { useSession } from "next-auth/react";
import { useEffect } from 'react';



interface FormInput {
  userEmail: string;
  userPassword: string;
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
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const response = await signIn("credentials", {
      redirect: false,
      email: data.userEmail,
      password: data.userPassword,
    });

    if (response?.ok) {
      console.log("Correct Credentials")
      router.push("/home/Feed")
    }
    else {
      console.log("incorrect credentials")
    }


  };

  return (

        <div className="mainArea bg-[#090d14] h-[100vh]">



      <div className="belowArea">

        


        <div className="right w-screen  flex justify-center items-center h-[90vh]">


          <form className='flex border py-15 text-white bg-[#060e17] rounded-xl flex-col  w-[80vw]  justify-center items-center' onSubmit={handleSubmit(onSubmit)}>

            <h1 className='text-3xl font-bold w-full ml-20 mb-4 text-start text-white'>Sign In</h1>

            <input placeholder='Enter Your Email' className='bg-gray-600 w-[70vw] px-10 py-2 text-white m-2 rounded-md' {...register("userEmail", { required: true, maxLength: 40 })} />
            <input placeholder='Enter Your Password' className='bg-gray-600 w-[70vw] px-10 py-2 text-white m-2 rounded-md' type='text' {...register("userPassword", { minLength: 6 })} />
            {errors?.userPassword?.type === "minLength" && <p>Password must be greater than 6 letters</p>}
            {isSubmitting ? <input value={"Loading..."}  className='bg-green-500 rounded-xl w-[70vw] mt-4 mb-6 cursor-pointer py-2' disabled type="submit" />:<input value={"Login"} className='bg-green-500 rounded-xl w-[70vw] mt-4 mb-6 cursor-pointer py-2' type="submit" />}

            <h1 className='mb-4'>Forget Your Password ?<Link href={"/"}> <span className='text-blue-500 underline'>Reset</span></Link></h1>

            <h1>-------------------------------------------------</h1>

            <h1>or, you can Login with </h1>


            <button onClick={() => signIn("google", { callbackUrl: "/askForImage" })} type="button" className="text-white bg-slate-600 cursor-pointer  flex-row  w-[40vw] mt-2 ] hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex gap-2  justify-center items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
              <img className='h-[20px]' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="" /> <h1 className='text-slate-400'>Google</h1>
            </button>

            <h1 className='mt-4'>Don't have an account ?<Link href={"/userSignup"}> <span className='text-blue-500 underline'>Signup</span></Link></h1>





          </form>
        </div>
      </div>


    </div>
  );
}
