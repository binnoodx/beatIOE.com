
"use client"
import { LabelProps } from 'recharts';
import { use, useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { notFound } from "next/navigation";
import { useSession } from 'next-auth/react';
import PieChartComponent from '@/components/PieChart';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { PieLabelProps } from 'recharts/types/polar/Pie';
import Link from 'next/link';


type Props = {
  params: {
    userName: string;
  };
};

export default function ProfilePage(props: { params: Promise<{ userName: string }> }) {
  const { userName } = use(props.params);
  const [GetImage, setGetImage] = useState("")
  const [UserPoints, setUserPoints] = useState(0)
  const [UserDate, setUserDate] = useState("")
  const [Attempt, setAttempt] = useState(0)
  const [Solve, setSolve] = useState(0)
  const [Rank, setRank] = useState(0)
  const { data: session, status } = useSession();

  useEffect(() => {

    gettingData()

  }, [])


  const gettingData = async () => {

    const response = await fetch("/api/forProfile/", {   // Use environment variable
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify({
        name: userName
      })
    })
    const data = await response.json()
    console.log(data)

    setUserDate(data.joined)
    setUserPoints(data.points)
    setGetImage(data.image)
    setAttempt(data.aPoints)
    setSolve(data.sPoints)
    setRank(data.rank)


  }
  const dataforChart = [
    { name: 'Wrong', value: Attempt - Solve },
    { name: 'Solve', value: Solve },
  ];
  const COLORS = ['#00C49F', '#ff0000'];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = (props: PieLabelProps) => {
    const {
      cx = 0,
      cy = 0,
      midAngle = 0,
      innerRadius = 0,
      outerRadius = 0,
      percent = 0,
      index = 0,
    } = props;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  return (
    <>
      <div className="main h-screen  bg-gradient-to-r bg-slate-300 from-slate-400 to-slate-300 flex flex-col w-screen">

        <div className="flex justify-start ml-5">

          <Link href={"/home/Feed/"}><button className=' bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg mt-2'>Back</button></Link>
        </div>

        


        <div className="upper h-[30vh]  mt-10 flex flex-col gap-2 justify-center items-center ">
          <div className="image">

  

            <img
              src={GetImage || undefined}
              alt="Menu"
              className="w-30 h-30 cursor-pointer rounded-full object-cover"
            />

          </div>
          <div className="details flex flex-col gap-2 justify-center items-center">

            <h1>@{userName.toLowerCase()}</h1>
            <h4 className='italic text-[13px]'>Joined On {UserDate.split("T")[0]}</h4>
            <h1>Total Points : {UserPoints}</h1>
            <h1>Rank : {Rank}</h1>
            <h1></h1>

          </div>
          <div className="questionSolved flex flex-row justify-evenly gap-5">

            <h1 className='text-green-500'>Correct : {Solve}</h1>
            <h1 className='text-red-600'>Wrong : {Attempt-Solve}</h1>


          </div>


        </div>

        <div className="lower">

          


          {(Attempt + Solve > 0) ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart width={400} height={400}>
                <Pie
                  data={dataforChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataforChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 mt-4">No data available to display chart.</p>
          )}







        </div>

      </div>




    </>

  );
}
