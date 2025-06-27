"use client";
import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { useState } from 'react';

interface FormInput {
  otp: Number;
}

const Page = () => {
  const [isError, setisError] = useState(false)
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    formState: { isSubmitting, isSubmitted }
  } = useForm<FormInput>();

const onSubmit: SubmitHandler<FormInput> = async (data) => {
  const response = await fetch("/api/forUsers/verifyEmail/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: data.otp }),
  });

  const responseMessage = await response.json()
  console.log(responseMessage.message);

  if (responseMessage.status) {
    const tempPassword = sessionStorage.getItem("tempPassword");
    console.log(tempPassword)

    const result = await signIn("credentials", {
      redirect: false,
      email: responseMessage.email,
      password: tempPassword,
      callbackUrl: "/askForImage",
    });

    if (result?.ok) {
      sessionStorage.removeItem("tempPassword");
      router.push("/askForImage");
    } else {
      
    }
  } else {
    setError("otp",{type:"manual",message:"Invalid OTP"})
  }
};

  return (
    <div className="body h-screen flex justify-center items-center w-screen bg-white]">

    <form
      className="flex  py-20 rounded-4xl flex-col w-[80vw] lg:w-[40vw] border-1 text-black bg-slate-300 justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-sm font-bold text-black">
        We have send you a 6-digit OPT at your Inbox !
      </h1>

      <input
        placeholder="eg. 123456"
        className="bg-gray-600 w-[70vw] lg:w-[30vw] px-10 py-2 text-white m-2 rounded-md"
        {...register("otp", { required: true, maxLength: 6 })}
      />
       {errors.otp?.type && <p className='w-full text-black text-start ml-15 text-[15px] italic'>{errors.otp.message}</p>}



      {isSubmitting?<input disabled
        value={"Loading..."}
        className="bg-green-500 rounded-xl lg:w-[25vw] w-[70vw] mt-4 mb-6 cursor-pointer py-2"
        type="submit"
      />:<input
        value={"Submit"}
        className="bg-green-500 rounded-xl w-[70vw] lg:w-[20vw] mt-4 mb-6 cursor-pointer py-2"
        type="submit"
      />}



    </form>
    </div>
  );
};

export default Page;
