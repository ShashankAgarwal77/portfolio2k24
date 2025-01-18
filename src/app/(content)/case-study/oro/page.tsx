"use client";

import React from 'react';

export default function HaulkarCaseStudy() {
    return (
        <div className="flex justify-center items-center h-screen p-10">
            <div className='w-full h-full rounded-md overflow-hidden '
                dangerouslySetInnerHTML={{
                    __html: `<iframe style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius:inherit;" width="100%" height="100%" src="https://embed.figma.com/proto/pfd6MQguGv2xmtPQ28XJoC/%F0%9F%92%BB-Portfolio-Presentation?page-id=317%3A157&node-id=328-3481&node-type=frame&viewport=1257%2C481%2C0.39&scaling=contain&content-scaling=fixed&embed-host=share&footer=false&theme=system" allowfullscreen></iframe>`,
                }}
            />
        </div>

    );
}