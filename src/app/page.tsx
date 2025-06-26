// app/page.tsx
'use client';
import Link from "next/link";
import DashboardCard from "@/components/card";
import LoginNavbar from "@/components/LoginNavbar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Atom } from "react-loading-indicators";
import { useQuestionStore } from "./store/questionStore";



export default function HomePage() {
  const { data: session, status } = useSession();
    const fetchQuestions = useQuestionStore((s) => s.fetchQuestions);

  const router = useRouter();

  useEffect(() => {
    
    if (status === "authenticated") {
      router.push("/home/Feed"); // ✅ Redirect when logged in
    }
  });
    useEffect(() => {
    if (session?.user?.email) {
      fetchQuestions(session.user.email, 1); // Prefetch first page
    }
  }, [session]);

  if(status === "loading"){
      return (
        <>
        <div className="h-screen w-screen bg-slate-900 flex flex-col justify-center items-center">

          <Atom color="#ffffff" size="large" text="" textColor="" />
        <h1 className="mt-20 text-2xl font-bold text-white ">BeatIOE.com</h1>
        </div>
        
        </>
      )
    }



  return (
    <div className=""
      style={{
        backgroundImage:
          'linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%)',
      }} >

      <LoginNavbar />

      <div className="flex flex-col lg:flex-row w-screen max-sm:flex-col justify-evenly items-center bg-white">


        <div className="left">
          <section className="bg-white pt-[5vh] h-[70vh] lg:h-[90vh]">
            <div className=" w-screen lg:w-[50vw] px-4 py-16 sm:px-6 sm:py-24  lg:py-32">
              <div className="max-w-prose text-left">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  Just Scroll and
                  <strong className="text-indigo-600"> Solve </strong>
                  the IOE Entrance Questions
                </h1>

                <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                  Want to become better in solving complex IOE Entrance problems ? Try BeatIOE - Your Free IOE Question Test.
                </p>

                <div className="mt-4 flex gap-4 sm:mt-6">
                  <Link
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    href="/userSignup"
                  >
                    Get Started
                  </Link>

                  <Link
                    className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
                    href="/"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>



        <div className="rignt">

          <DashboardCard />

        </div>


      </div>




    </div>
  );
}
