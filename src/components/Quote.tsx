import React from "react";

const SimpleTestimonial = () => {
  return (
    <div className="text-left mx-auto bg-white w-[90vw] lg:w-[30vw] rounded-xl h-full">
      <div className="p-4 text-black">
        <svg
          height="35px"
          className="mb-2"
          fill="#5a67d8"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 32 32"
        >
          <g>
            <g id="right_x5F_quote">
              <g>
                <path d="M0,4v12h8c0,4.41-3.586,8-8,8v4c6.617,0,12-5.383,12-12V4H0z"></path>
                <path d="M20,4v12h8c0,4.41-3.586,8-8,8v4c6.617,0,12-5.383,12-12V4H20z"></path>
              </g>
            </g>
          </g>
        </svg>
        <p className="mt-2 text-base leading-6">
          Made for Aspirants , Made By Aspirant. Just Scroll The Problems and be top on Leaderboard.
        </p>
        <div className="text-sm mt-5">
          <a
            href="#"
            className="font-medium leading-none text-indigo-600 hover:text-black transition duration-500 ease-in-out"
          >
            Binod Sharma
          </a>
          <p>Developer</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestimonial;