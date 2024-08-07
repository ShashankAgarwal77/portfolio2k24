"use client";

import { useEffect, useState } from 'react';
import { MdArrowOutward } from "react-icons/md";

interface Shot {
  id: number;
  title: string;
  images: {
    hidpi: string;
    normal: string;
    teaser: string;
  };
  // Add any other fields you need
  html_url: string;
}

export function DribbbleShots() {
  const [shots, setShots] = useState<Shot[]>([]);

  useEffect(() => {
    async function fetchAndSetShots() {
      const response = await fetch('/api/fetchDribbbleShots');
      const shots = await response.json();
      console.log(shots);
      setShots(shots);
    }

    fetchAndSetShots();
  }, []);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' data-aos="fade-up">
      {shots && shots.map((shot) => (
        <a href={shot.html_url} key={shot.id} target='_blank' rel='noopener noreferrer' className='group'>

          <div className="wrapper">
            <div className="w-full h-full bg-gradient-to-b from-slate-300 dark:from-neutral-800 p-0.5 rounded-lg">

              <div className='border border-black/[0.2] group/canvas-card flex flex-col dark:border-white/[0.2] w-full relative h-auto relative overflow-hidden'>

                <div className="icons-wrapper">
                  <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                  <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                  <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                  <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
                </div>

                <div className='lg:m-1 lg:transition-translate lg:duration-300 lg:ease-out lg:group-hover:scale-105 rounded-xl'>
                  <img src={shot.images.hidpi} alt={shot.title} className='p-2 w-full object-cover rounded-xl' />
                </div>


                <div className="title-wrapper relative">
                  <div className='p-6 absolute bottom-0 bg-gradient-to-t from-slate-200 dark:from-slate-900 w-full transform opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0'>
                    <div className='text-slate-900 dark:text-slate-50 font-bold text-base md:text-xl'>
                      <style className='line-clamp-1'>
                        {shot.title}
                        <MdArrowOutward className='inline' />
                      </style>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>


        </a>
      ))}
    </div>

  );
}

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
