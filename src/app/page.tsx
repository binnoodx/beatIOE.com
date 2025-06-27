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
import SplitText from "./Animations/TextAnimation01";
import { TypeAnimation } from 'react-type-animation';
import SimpleTestimonial from "@/components/Quote";




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

  if (status === "loading") {
    return (
      <>
        <div className="h-screen w-screen bg-slate-600 flex flex-col justify-center items-center">

          <Atom color="#ffffff" size="large" text="" textColor="" />
          <h1 className="mt-20 text-2xl font-bold text-white ">BeatIOE.com</h1>
        </div>

      </>
    )
  }



  return (
    <div className="">

      <LoginNavbar />



      <div className="flex flex-col h-[90vh] overflow-hidden bg-purple-500 text-white lg:flex-row w-screen max-sm:flex-col justify-center lg:justify-evenly items-center ">


        <div className="left lg:w-[50vw]">




          <section className=" h-[50vh] lg:h-[90vh]">
            <div className=" w-screen lg:w-[50vw] px-4  sm:px-6 sm:py-24  lg:py-32">
              <div className=" lg:[w-60vw] text-left">
                <SplitText
                  text="Hello, Aspirant!"
                  className="text-4xl font-semibold text-center"
                  delay={100}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
                <h1 className="text-2xl font-bold flex flex-col sm:text-5xl">



                  Just Scroll and 
                  <strong className="text-indigo-600">


                    <TypeAnimation className=" font-xl text-white"
                      sequence={[
                        'Learn', // Types 'One'
                        2000, // Waits 1s
                        'Solve', // Deletes 'One' and types 'Two'
                        2000, // Waits 2s
                        'Beat', // Types 'Three' without deleting 'Two'
                        
                      ]}
                      wrapper="span"
                      cursor={true}
                      repeat={Infinity}
                      style={{  display: 'inline-block' }}
                    />

                  </strong>
                  the IOE Entrance Questions
                </h1>

                <p className="mt-4 text-base text-pretty  sm:text-lg/relaxed">
                  Want to become better in solving complex IOE Entrance problems ? Try BeatIOE - Your Free IOE Question Test.
                </p>

                <div className="mt-4 flex gap-4 sm:mt-6">
                  <Link
                    className="inline-block rounded border border-indigo-600 bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    href="/userLogin"
                  >
                    Get Started
                  </Link>

                  <Link
                    className="inline-block rounded border bg-yellow-300 text-slate-600 border-gray-200 px-5 py-3 font-medium  shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
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

          <SimpleTestimonial/>

        </div>


      </div>




    </div>
  );
}
