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
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
      {shots && shots.map((shot) => (
        <a href={shot.html_url} key={shot.id} target='_blank' rel='noopener noreferrer' className='group'>
          <div className="bg-gradient-to-b w-full h-full from-neutral-800 p-0.5 rounded-lg">
            <div className='overflow-hidden group-hover:visible rounded-lg bg-gradient-to-b from-neutral-800'>
              <img src={shot.images.hidpi} alt={shot.title} className='p-1 w-full  object-cover transform group-hover:scale-105 transition-transform duration-200 rounded-lg mb-2' />
              <div className='px-6 py-4'>
                <div className='text-slate-700 font-bold text-xl group-hover:text-slate-400 transition-colors duration-200'>{shot.title} <MdArrowOutward /> </div>
              </div>
            </div>

          </div>

        </a>
      ))}
    </div>
  );
}
