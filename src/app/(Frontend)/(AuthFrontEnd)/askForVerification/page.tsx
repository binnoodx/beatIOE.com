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

    console.log("Very Close")

    if (result?.ok) {
      sessionStorage.removeItem("tempPassword");
      router.push("/askForImage");
    } else {
      console.log("Auto login failed", result);
    }
  } else {
   console.log("Not Even Close Baby")
  }
};

  return (
    <div className="body h-screen flex justify-center items-center w-screen bg-[#060e17]">

    <form
      className="flex  py-5 rounded-4xl flex-col w-[80vw] justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-sm font-bold text-white">
        We have send you a 6-digit OPT at your Inbox !
      </h1>

      <input
        placeholder="eg. 123456"
        className="bg-gray-600 w-[70vw] px-10 py-2 text-white m-2 rounded-md"
        {...register("otp", { required: true, maxLength: 6 })}
      />
       {isError && <p className='w-full text-white text-start ml-15 text-[15px] italic'>Invalid OTP</p>}



      {isSubmitting?<input disabled
        value={"Loading..."}
        className="bg-green-500 rounded-xl w-[70vw] mt-4 mb-6 cursor-pointer py-2"
        type="submit"
      />:<input
        value={"Submit"}
        className="bg-green-500 rounded-xl w-[70vw] mt-4 mb-6 cursor-pointer py-2"
        type="submit"
      />}



    </form>
    </div>
  );
};

export default Page;
