'use client'; // ← optional if you're using App Router

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';


const LoginNavbar = () => {
  return (

    <>


    <div className="navbar h-[10vh] flex flex-row justify-evenly items-center w-screen bg-sky-500 text-white">


        <div className="logo flex flex-row justify-center items-center gap-4">
          <Image
                    src={logo}
                    alt="Logo"
                    width={32}
                    height={16}
                    className="object-contain"
                />
            <Link href={"/"}><h1 className='text-xl font-bold'>BeatIOE</h1></Link>
        </div>

        <div className="buttons flex flex-row justify-center gap-5">
          
  
            <Link href={"/userLogin"}>

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5   dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Start</button>
          
          </Link>
          <Link href={"https://www.instagram.com/the_binodd"}>

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5   dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">&lt; / &gt; Developer</button>
          
          </Link>
        </div>




    </div>



    </>


  )
    
};

export default LoginNavbar;
