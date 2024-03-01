"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { TracingBeam } from "@/app/components/Animations/tracing-beam-animation";
import { AnimatedTooltipCard } from "@/app/components/uiFrontend/animated-tooltip";

import Orothumbnail from '@/app/Assets/Images/Introduction.png';


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

      {/* <MacbookScrollComp /> */}

      <TracingBeam className="px-6 mx-auto my-40 overflow-y-clip">
        <div className="max-w-6xl mx-auto antialiased pt-8 relative">
          {dummyContent.map((item, index) => (
            <div key={`content-${index}`} id={`content-${index}`} className="mb-10">
              <h2 className="bg-white/[0.1] text-gray-400 rounded-full sm:text-sm md:text-md lg:text-xl w-fit px-4 py-1 mb-4">
                {item.badge}
              </h2>

              <p className="sm:leading-loose tracking-wide sm:text-xl md:leading-loose md:text-2xl lg:leading-normal lg:text-4xl text-white sm:mb-4 md:mb-6 lg:mb-8">
                {item.title}
              </p>

              <div className="md:leading-normal md:text-sm lg:leading-loose lg:text-lg tracking-wide light:text-neutral-600 dark:text-neutral-300 prose prose-sm dark:prose-invert">
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

      <div className="hidden lg:flex fixed mx-10 my-40">
        <div ref={sidebarRef} className="flex flex-col items-start">
        <h2 className="text-neutral-600 text-md uppercase font-bold mb-4">Content</h2>
          <ul className="space-y-4 w-48">
            {dummyContent.map((item, index) => (
              <li key={`sidebar-item-${index}`}>
                <a
                  href={`#content-${index}`}
                  className={`text-neutral-500 hover:text-white  ${
                    activeSection === index ? "text-white" : ""
                  }`}
                >
                  {item.badge}
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
    title: "Orocorp - Redefining the way people get gold loans in India",
    description: (
      <>
        <div className="flex sm:flex-col lg:flex-row justify-between">
          <div className="flex flex-col gap-y-6 mr-20">
            <h4 className="text-4xl">My Roles &amp; Responsibilities</h4>
            <ul className="list-disc text-justify leading-loose text-normal">
              <li><b>UX Analysis:</b> Curating Customer Journey Mapping, Card Sorting Analysis, Heuristic Evaluation, Implementing UX Laws, and much more</li>
              <li><b>UI Design:</b> Multiple Iterations and Ideation on Low &amp; High Fidelity Wireframes and Mockups</li>
              <li>Make vision easily understandable to the Stakeholders, PMs, Developers in (UX, Software, Product)</li>
            </ul>
          </div>
          <div className="flex flex-col gap-y-6">
            <h4 className="text-4xl">Shoutouts</h4>
            <div className=" flex flex-col ">
              <AnimatedTooltipCard />
            </div>
            <div className="flex flex-col gap-y-6">
              <h4 className="text-4xl">Status &amp; Timeline</h4>
              <ul className="list-disc text-justify leading-loose text-normal">
                <li>2 Months, Designed Handoff done in March 2022</li>
                <li>Overall Work Period: January 2022 to October 2023</li>
                <li>Product Designer @ Orocorp, Tech Office is in Chennai, I worked remotely</li>
              </ul>
            </div>
          </div>
        </div>
      </>
    ),
    badge: "Overview",
    // image: Orothumbnail,
  },

  {
    title: "It all started in January 2022",
    description: (
      <>
        <p>
          In January 2022, Oro decided to redesign their product offerings &amp; expand their business to new cities. To achieve this, they needed to ship a more refined and polished product which users can easily use. <br />
          <br />
          I worked as a Product designer, designing &amp; leading the end-to-end design direction of the mobile experience for core users which drive the main business of the company. <br />
          <br />
          The app and website launch were met with an outstanding end-customer response, alongside a 127% increase in user engagement in the first month itself. <br />
        </p>
      </>
    ),
    badge: "Introduction",
    image: Orothumbnail,
  },


  {
    title: "Transforming Gold Loan Services: Enhancing User Experience and Streamlining Interfaces in India",
    description: (
      <>
        <p>
          In India, there is no seamless experience that handles doorstep gold loan service that customers are truly satisfied with. <br />
          <br />
          One of the key challenges we aimed to address was improving the overall user experience for our customers seeking instant gold loans. By understanding their pain points and needs, we strived to create a seamless borrowing journey that instilled trust and confidence in our services. Additionally, we aimed to streamline the interfaces of our Customer App, Partner App, and Admin Dashboard, making them more intuitive and user-friendly. <br />
        </p>
      </>
    ),
    badge: "Problem",
    image: "https://cdn.sanity.io/images/loniby3f/production/869d098d3a409093a549b5ecb29c2aba5a94c2bd-3840x2160.png",
  },

  {
    title: "Simplifying Doorstep Gold Loans for Indians with Enhanced UI/UX",
    description: (
      <>
        <p>
          Research, strategize & design a mobile application to help Indians get doorstep gold loans, with a focus to improve UI & UX in the app. This resulted in reducing the gold loan application time from 45 minutes to ~28 minutes.
        </p>
      </>
    ),
    badge: "Objective",
    // image: Orothumbnail,
  },

  {
    title: "Design process I followed is Double Diamond",
    description: (
      <>
        <p>
          Following a user-centered design approach, we embarked on a comprehensive design process. We ideated, prototyped, and iterated on various solutions, considering user feedback and stakeholder input at each stage. We created customer journey maps that visualized the borrower's end-to-end experience, enabling us to identify opportunities for improvement and streamline the loan application process.
        </p>
      </>
    ),
    badge: "Process",
    image: "https://cdn.sanity.io/images/loniby3f/production/144f349e74ee8395acef78dd7d33693ccc099220-3840x2160.png",
  }
  
  
];
