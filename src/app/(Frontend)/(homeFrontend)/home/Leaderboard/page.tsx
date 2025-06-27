"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type User = {
  fullName: string;
  userPoints: number;
  profileImage?: string;
};

const Page = () => {
  const { data: session, status } = useSession();

  const [topUsers, setTopUsers] = useState<User[]>([])
  const [userName, setUserName] = useState<string | null>(null)
  const [userRank, setUserRank] = useState<number | string | null>(null)
  const [userImage, setuserImage] = useState("")
  const [userPoint, setUserPoint] = useState<number | string | null>(null)



  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      getTopUser()
    }
  }, [session, status])

  const getTopUser = async () => {
    const response = await fetch("/api/forLeaderboard/", {   // Use environment variable
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify({
        email: session?.user?.email
      })
    })
    const data = await response.json()
    setTopUsers(data.users)
    setUserName(data.userNameToSent)
    setUserRank(data.userRankToSent)
    setUserPoint(data.userPointToSent)
    setuserImage(data.userImage)
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return " w-[90vw] text-sm lg:text-xl  lg:w-[90vw] py-4 h-[8vh] lg:h-[12vh] lg:py-3 bg-yellow-300  shadow-xl shadow-yellow-500";
      case 1:
        return " w-[80vw] lg:w-[70vw] h-[6vh] py-3 lg:py-2 lg:h-[10vh] bg-red-300 shadow-lg shadow-red-500 text-gray-800 ";
      case 2:
        return " w-[70vw] text-[13px] lg:w-[60vw] h-[5vh] lg:h-[8vh] py-2 lg:py-1 bg-orange-400 shadow-lg shadow-orange-500 text-sm ";
      default:
        return " bg-slate-300  py-1 h-[5vh] lg:py-0 w-[70vw] lg:h-[7vh] lg:w-[60vw]";
    }
  };

  const getRankIcon = (index: number) => {
    return [<img
                  src="https://img.icons8.com/?size=100&id=12608&format=png&color=000000"
                  alt="Menu"
                  className="w-9 h-9 cursor-pointer rounded-full object-cover"
                />, <img
                  src={"https://img.icons8.com/?size=100&id=24317&format=png&color=000000"}
                  alt="Menu"
                  className="w-8 h-8 cursor-pointer rounded-full object-cover"
                />, <img
                  src={"https://img.icons8.com/?size=100&id=24318&format=png&color=000000"}
                  alt="Menu"
                  className="w-6 h-6 cursor-pointer rounded-full object-cover"
                />][index] || `#${index + 1}`;
  };

  return (
    <div className=" overflow-scroll bg-slate-200  w-screen h-[100vh] text-sm lg:text-lg flex flex-col gap-5  items-start">
      <div className='flex fixed top-0 flex-row bg-slate-500 w-screen h-[10vh] items-center text-white justify-start  gap-10 '>
        <Link href={"/home/Feed"}><button  className='px-8 ml-6 py-2 rounded-lg bg-blue-600 cursor-pointer text-white font-sans'>Back</button></Link>
        <h1 className="text-2xl font-bold ">🏆 Top Aspirants</h1>
      </div>

      {topUsers.length > 0 && (
        <ul className="space-y-3 flex w-[100vw] mb-15 mt-20 justify-center items-center flex-col gap-6 lg:gap-4 ">
          {topUsers.map((user, index) => (
            <li
              key={index}
              className={`flex justify-center border-1 items-center gap-0 lg:gap-1 p-2 lg:p-4 rounded-lg  ${getRankStyle(index)}`}
            >
              <div  className="flex w-[90vw] items-center gap-2 lg:gap-7 ">
                <span className={index === 0 || index === 1 || index === 2 ? "text-sm rounded-md lg:text-xl" : "text-sm  lg:text-lg"}>{getRankIcon(index)}</span>



                <img
                  src={user.profileImage || undefined}
                  alt="Menu"
                  className="w-13 h-13 cursor-pointer border-2 border-black rounded-full object-cover"
                />
                <span className="">{user.fullName}</span>
              </div>
              <span className="text-sm">{user.userPoints}⭐</span>
            </li>
          ))}
        </ul>
      )}


      <div className='w-[100vw] items-center  text-start py-2 rounded-t-lg bg-cyan-500 text-gray-800 fixed bottom-0 flex flex-row justify-around gap-10'>
        <div className="1 flex flex-row justify-start gap-15 w-[70vw] items-center">
          <h1 className=' '>
          {typeof userRank === "number" && userRank !== null
            ? getRankIcon(userRank - 1)
            : "#"}
        </h1>
        <img
          src={userImage || undefined}
          alt="Menu"
          className="w-10 h-10 cursor-pointer rounded-full object-cover"
        />
        <h1 className='   '>You</h1>
        </div>
        <h1>{userPoint}⭐</h1>
      </div>

    </div>
  )
}

export default Page
