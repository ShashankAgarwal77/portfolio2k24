"use client";

import { useEffect, useState } from 'react';

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
          <div className="bg-gradient-to-b from-blue-600 p-0.5 rounded-lg">
            <div className='overflow-hidden rounded-lg shadow-lg'>
              <img src={shot.images.hidpi} alt={shot.title} className='w-full  object-cover transform group-hover:scale-105 transition-transform duration-200' />
              <div className='px-6 py-4 bg-white'>
                <div className='text-slate-700 font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors duration-200'>{shot.title}</div>
              </div>
            </div>

          </div>

        </a>
      ))}
    </div>
  );
}
