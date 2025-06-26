'use client'; // ← optional if you're using App Router

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LoginNavbar = () => {
  return (

    <>


    <div className="navbar h-[10vh] flex flex-row justify-evenly items-center w-screen bg-slate-700 text-white">


        <div className="logo">
            <Link href={"/"}><h1 className='text-xl'>CrackIOE</h1></Link>
        </div>

        <div className="buttons flex flex-row justify-center gap-5">
          
  
            <Link href={"/userLogin"}>

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5   dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</button>
          
          </Link>
          <Link href={"/userSignup"}>

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5   dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign Up</button>
          
          </Link>
        </div>




    </div>



    </>


  )
    
};

export default LoginNavbar;
