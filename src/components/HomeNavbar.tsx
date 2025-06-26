import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import logo from '@/public/logo.png';
import Link from 'next/link';
import { Dropdown } from "flowbite-react";
import { DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/navigation';



interface FormInput {
    searchUser: string;
}





const HomeNavbar = () => {
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting, isSubmitted } } = useForm<FormInput>();

    const Router = useRouter()

    const { data: session, status } = useSession();
    const [userImageUrl, setUserImageUrl] = useState("")
    const [name, setname] = useState("")
    const [open, setOpen] = useState(false);


    const onSubmit: SubmitHandler<FormInput> = async (data) => {


        Router.push(`/home/Profile/${data.searchUser}`)

   

            

        }




    useEffect(() => {

        if (session?.user?.email) {
            userImage()
        }


    }, [session])


    const userImage = async () => {
        console.log("the sent email is " + session?.user?.email)
        const response = await fetch('/api/sendImage/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session?.user?.email }),
        });
        const message = await response.json()
        setUserImageUrl(message.image)
        setname(message.name)


    }

    return (
        <div className='h-[10vh] bg-slate-600 text-white w-screen flex flex-row gap-2 justify-evenly'>
            <div className="first flex flex-row justify-center items-center gap-1">

                <Image
                    src={logo}
                    alt="Logo"
                    width={32}
                    height={16}
                    className="object-contain"
                />
                <h2 className='font-bold  lg:flex '>BeatIOE</h2>

                <form className='flex text-white   rounded-xl flex-row gap-2   justify-center items-center' onSubmit={handleSubmit(onSubmit)}>


       <input
              placeholder='Search Aspirants'
              className='bg-gray-600 border-1  text-white py-2 px-8 text-sm rounded-md'
              {...register("searchUser", {
              })}
            />


            {isSubmitting ? <input disabled className='bg-green-500  rounded-xl cursor-pointer' type="submit" value={"Loading..."} />:<input className='bg-slate-600 rounded-sm cursor-pointer' value={"🔍"} type="submit" />}






          </form>

            </div>

            <div className="second flex flex-row justify-center items-center gap-2 lg:gap-5">

                <div className="menu  z-0">

                    <Dropdown

                        label="" dismissOnClick={false} renderTrigger={() => <img
                            src={userImageUrl || undefined}
                            alt="Menu"
                            className="w-12 h-12 cursor-pointer rounded-full object-cover"
                        />}

                        className="w-[50vw] lg:w-[10vw]"
                    >
                        <DropdownHeader>
                            <span className="block text-sm">{session?.user?.name}</span>
                            <span className="block truncate text-sm font-medium">{session?.user?.email}</span>
                        </DropdownHeader>
                        <DropdownItem>Analysis</DropdownItem>
                        <DropdownItem>Leaderboard</DropdownItem>
                        <DropdownItem>Developer</DropdownItem>
                        <DropdownItem>Achievements</DropdownItem>

                        <DropdownItem>Edit Profile</DropdownItem>
                        <DropdownItem> Profile</DropdownItem>

                        <Link href={`/home/Profile/${name}`}><DropdownItem >My Profile</DropdownItem></Link>
                        <DropdownDivider />
                        <DropdownItem onClick={() => { signOut({ callbackUrl: '/userLogin' }) }}>Sign Out</DropdownItem>
                    </Dropdown>


                </div>

                <div className="forPC hidden lg:flex   items-center justify-center gap-10">
                    <Link
                        className="inline-block rounded border border-indigo-600 bg-blue-600 lg:px-5 lg:py-3 px-2 font-normal text-white shadow-sm transition-colors hover:bg-indigo-700"
                        href="/home/Analysis"
                    >
                        Analysis
                    </Link>
                    <Link
                        className="inline-block rounded border border-indigo-600 bg-blue-600 lg:px-5 lg:py-3 px-2  font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                        href="/home/Leaderboard/"
                    >
                        Leaderboard
                    </Link>


                    <Dropdown

                        label="" dismissOnClick={false} renderTrigger={() => <img
                            src={userImageUrl || undefined}
                            alt="Menu"
                            className="w-15 h-15 cursor-pointer hidden rounded-full object-cover"
                        />}

                        className="hidden w-[10vw] lg:flex "
                    >
                        <DropdownHeader>
                            <span className="block text-sm">{session?.user?.name}</span>
                            <span className="block truncate text-sm font-medium">{session?.user?.email}</span>

                        </DropdownHeader>


                        <Link href={`/home/Profile/${session?.user?.name}`}><DropdownItem>My Profile</DropdownItem></Link>
                        <DropdownItem>Edit Details</DropdownItem>
                        <DropdownItem>Achievements</DropdownItem>
                        <Link href={"https://instagram.com/the_binodd"}><DropdownItem>Developer</DropdownItem></Link>
                        <Link href={`/home/Profile/${name}`}><DropdownItem >My Profile</DropdownItem></Link>
                        <DropdownDivider />
                        <DropdownItem onClick={() => { signOut({ callbackUrl: '/userLogin' }) }}>Sign Out</DropdownItem>
                    </Dropdown>
                </div>


            </div>
        </div>
    )
}

export default HomeNavbar
