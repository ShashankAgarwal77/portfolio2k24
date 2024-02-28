"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { TracingBeam } from "@/app/components/Animations/tracing-beam-animation";
import { MacbookScrollComp} from "@/app/components/uiFrontend/macbook-scroll";

import OroThumbnail from '@/app/Assets/Images/Introduction.png';

export default function TracingBeamDemo() {
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const [activeSection, setActiveSection] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
          const scrollPosition = window.scrollY;
          const sections = document.querySelectorAll("[id^='content-']");
    
          sections.forEach((section, index) => {
            const top = section.getBoundingClientRect().top;
            const bottom = section.getBoundingClientRect().bottom;
    
            if (scrollPosition >= top && scrollPosition < bottom) {
              setActiveSection(index);
            }
          });
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    
    return (


        <div className="flex flex-col justify-between">

      <MacbookScrollComp />

      <TracingBeam className="px-6 mx-auto my-40 overflow-y-clip">
        <div className="max-w-7xl mx-auto antialiased pt-8 relative">
          {dummyContent.map((item, index) => (
            <div key={`content-${index}`} id={`content-${index}`} className="mb-10">
              <h2 className="bg-white/[0.1] text-gray-400 rounded-full sm:text-sm md:text-md lg:text-xl w-fit px-4 py-1 mb-4">
                {item.badge}
              </h2>

              <p className="sm:text-xl md:text-4xl lg:text-5xl text-white sm:mb-4 md:mb-6 lg:mb-8">
                {item.title}
              </p>

              <div className="sm:text-sm md:text-md lg:text-lg text-slate-300 prose prose-sm dark:prose-invert">
                {item?.image && (
                  <Image
                    src={item.image}
                    alt="blog thumbnail"
                    height="2000"
                    width="2000"
                    className="rounded-lg mb-10 object-cover"
                  />
                )}
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>

      <div className="hidden lg:flex fixed mx-20 my-80">
        <div ref={sidebarRef} className="flex flex-col items-end">
          <ul className="space-y-4 w-48">
            {dummyContent.map((item, index) => (
              <li key={`sidebar-item-${index}`}>
                <a
                  href={`#content-${index}`}
                  className={`text-gray-400 hover:text-white ${
                    activeSection === index ? "font-bold" : ""
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const dummyContent = [
  {
    title: "Orocorp - Redefining the way people get gold loan in India",
    description: (
      <>
      <div className="flex sm:flex-col lg:flex-row space-between justify-between gap-x-16">
        <div className="flex flex-col gap-y-6">
            <h4 className="text-4xl">My Roles & Responsibilites</h4>
            <ul className="list-disc">
              <li><b> UX Analysis :</b> Curating Customer Journey Mapping, Card Sorting Analysis, Heuristic Evaluation, Implimenting UX Laws and much more</li>
              <li>UI Design : Multiple Iterations and Ideation on Low & High Fidelity Wireframes and Mockups..</li>
              <li>Make vision easily understand to the Stakeholders, PMs, Developers in (UX, Software, Product).</li>
            </ul>
          </div>
          <div className="flex flex-col justify-between content-between">
            <h4 className="text-4xl">My Roles & Responsibilites</h4>
            <ul className="list-disc">
              <li>UX Analysis : Curating Customer Journey Mapping, Card Sorting Analysis, Heuristic Evaluation, Implimenting UX Laws and much more</li>
              <li>UI Design : Multiple Iterations and Ideation on Low & High Fidelity Wireframes and Mockups..</li>
              <li>Make vision easily understand to the Stakeholders, PMs, Developers in (UX, Software, Product).</li>
            </ul>
          </div>
      </div>
      </>
    ),
    badge: "UI/UX Case Study",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Hello Amigo, Hola",
    description: (
      <>
        <p>
          Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat
          deserunt cupidatat aute. Enim cillum dolor et nulla sunt exercitation
          non voluptate qui aliquip esse tempor. Ullamco ut sunt consectetur
          sint qui qui do do qui do. Labore laborum culpa magna reprehenderit ea
          velit id esse adipisicing deserunt amet dolore. Ipsum occaecat veniam
          commodo proident aliqua id ad deserunt dolor aliquip duis veniam sunt.
        </p>
        <p>
          In dolore veniam excepteur eu est et sunt velit. Ipsum sint esse
          veniam fugiat esse qui sint ad sunt reprehenderit do qui proident
          reprehenderit. Laborum exercitation aliqua reprehenderit ea sint
          cillum ut mollit.
        </p>
      </>
    ),
    badge: "Changelog",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Lorem Ipsum Dolor Sit Amet",
    description: (
      <>
        <p>
          Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat
          deserunt cupidatat aute. Enim cillum dolor et nulla sunt exercitation
          non voluptate qui aliquip esse tempor. Ullamco ut sunt consectetur
          sint qui qui do do qui do. Labore laborum culpa magna reprehenderit ea
          velit id esse adipisicing deserunt amet dolore. Ipsum occaecat veniam
          commodo proident aliqua id ad deserunt dolor aliquip duis veniam sunt.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
   {
    title: "Lorem Ipsum Dolor Sit Amet",
    description: (
      <>
        <p>
          Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat
          deserunt cupidatat aute. Enim cillum dolor et nulla sunt exercitation
          non voluptate qui aliquip esse tempor. Ullamco ut sunt consectetur
          sint qui qui do do qui do. Labore laborum culpa magna reprehenderit ea
          velit id esse adipisicing deserunt amet dolore. Ipsum occaecat veniam
          commodo proident aliqua id ad deserunt dolor aliquip duis veniam sunt.
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  
];
