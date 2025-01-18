"use client";

import React from 'react';
import Image from 'next/image';

export default function HaulkarCaseStudy() {
    return (
        <div className="flex justify-center items-center h-screen p-10">
            <div className='w-full h-full rounded-md overflow-hidden '
                dangerouslySetInnerHTML={{
                    __html: `<iframe style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius:inherit;" width="100%" height="100%" src="https://embed.figma.com/deck/6p8Q1ccyFQpDu6KoR4XxTS/Simplifying-gig-work-in-logistics-presentation?node-id=1-618&node-type=canvas&viewport=-1876%2C-2574%2C0.54&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share&footer=false&theme=system" allowfullscreen></iframe>`,
                }}
            />
        </div>

    );
}

 // client-id=muds0emC09G4KReBWgDnIe