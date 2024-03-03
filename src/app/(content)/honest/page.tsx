"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { TracingBeam } from "@/app/components/Animations/tracing-beam-animation";
import { AnimatedTooltipCard } from "@/app/components/uiFrontend/animated-tooltip";
import { SpotlightPreview } from "@/app/components/uiFrontend/spotlight";


import HonestThumbnail from "@/app/Assets/Images/HonestIntroduction.png";

export default function TracingBeamDemo() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const sections = document.querySelectorAll("[id^='content-']");
  
      sections.forEach((section, index) => {
        const { top, bottom } = section.getBoundingClientRect();
  
        // Check if the section is at least 50% visible in the viewport
        if (top < windowHeight * 0.5 && bottom > windowHeight * 0.5) {
          setActiveSection(index);
        }
      });
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col justify-between">
      <SpotlightPreview />

      <TracingBeam className="px-6 xl:max-w-5xl mx-auto my-40 overflow-y-clip">
        <div className="mx-auto antialiased pt-8 relative">
          {dummyContent.map((item, index) => (
            <div
              key={`content-${index}`}
              id={`content-${index}`}
              className="mb-10"
            >
              <h2 className="bg-black/[0.1] dark:bg-white/[0.1] text-gray-800 dark:text-gray-400 rounded-full sm:text-sm md:text-md lg:text-xl w-fit px-4 py-1 mb-4">
                {item.badge}
              </h2>

              <p className="sm:leading-loose tracking-wide sm:text-xl md:leading-loose md:text-2xl lg:leading-normal lg:text-4xl text-black dark:text-white sm:mb-4 md:mb-6 lg:mb-8">
                {item.title}
              </p>

              <div className="md:leading-normal md:text-sm lg:leading-loose lg:text-lg tracking-wide light:text-slate-600 dark:text-slate-300 prose prose-sm dark:prose-invert">
                {item.images && item.images.map((image, imgIndex) => (
                  <Image
                    key={`image-${imgIndex}`}
                    src={image as string} // Type assertion
                    alt={`blog thumbnail ${imgIndex}`}
                    height="2000"
                    width="2000"
                    className="rounded-lg mb-10 object-cover"
                  />
                ))}
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>

      <div className="hidden lg:flex fixed mx-10 my-40">
        <div ref={sidebarRef} className="flex flex-col items-start">
          <h2 className="text-slate-600 text-md uppercase font-bold mb-4">
            Content
          </h2>
          <ul className="space-y-4 w-48">
            {dummyContent.map((item, index) => (
              <li key={`sidebar-item-${index}`}>
                <a
                  href={`#content-${index}`}
                  className={`text-neutral-500 hover:text-white  ${activeSection === index ? "text-white" : ""
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
    title: "Honest Bites: Unveiling a World of Culinary Experience",
    description: (
      <>
        <p>
          In a bustling world where time is of the essence, and appetites crave authenticity, I am set out on a journey to craft an unparalleled user experience in the realm of food ordering and delivery. Welcome to the story of Honest Bites a revolutionary application that tantalizes taste buds, builds trust, and elevates convenience for every culinary explorer.
        </p>

      </>
    ),
    badge: "Overview",
    images: [HonestThumbnail],

  },

  {
    title: "Problem Context",
    description: (
      <>
        <p>
          Ever wondered, whenever we wanna explore cuisine's from known or unknown restaurant, there's is one thought that always come in mind i.e., <br />

          <b> what if food is NOT as good as shown in images ? </b> <br />

          That is the major issue consumers are facing right now.
        </p>


      </>
    ),
    badge: "Problem",
    images: ["https://cdn.sanity.io/images/loniby3f/production/db77279682dfbe04f3b636a837e45e856b13ba6e-3840x2160.png",],
  },

  {
    title: "My goals in this project",
    description: (
      <>
        <p>
          My goal during this project is to develop user-friendly food ordering and delivery application that builds trust and enhances user experience for customers by providing authentic dish representation through verified user-generated images and reviews
        </p>


      </>
    ),
    badge: "Goals",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/db77279682dfbe04f3b636a837e45e856b13ba6e-3840x2160.png",],
  },

  {
    title: "Constrains & Market Validation",
    description: (
      <>
        <p>
          Since this is my personal hobby project, there would be some technical and non-technical constrains that might happen :
        </p>

        <ol className="list-decimal">
          <li>Image Verification Process: Implementing a reliable system to verify user-generated images to ensure they represent the actual dishes accurately without any misleading stock or fake images.</li>
          <li>Restaurant Partner Collaboration: Gaining cooperation from restaurant partners to provide real and high-quality images of their dishes for an authentic representation.</li>
        </ol>

      </>
    ),
    badge: "Constrains",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/db77279682dfbe04f3b636a837e45e856b13ba6e-3840x2160.png",],
  },

  {
    title: "My Process developed and followed in this project",
    description: (
      <>

      </>
    ),
    badge: "Process",
    images: ["https://cdn.sanity.io/images/loniby3f/production/91b91bc801910b65d368e8641a91fbe362abd444-7680x4320.png",],
  },

  {
    title: "Requirements & HMW's",
    description: (
      <>
        <p>
          To understand & empathize with actual problems and pain-points consumers are facing right now in food ordering and deliverying applications , I conducted User Survey & Research to channelize the Qualtative and Quantitative data into better decision making forms. <br /> <br />

          Upon receiving my prompt, I start to emphasize cognizant of its complexities. Therefore, I try to deconstruct the prompt into tangible subproblems, which I tackled by establishing research goals.
        </p>

      </>
    ),
    badge: "Empathize",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/91b91bc801910b65d368e8641a91fbe362abd444-7680x4320.png",],
  },

  {
    title: "Research Goals & Summary",
    description: (
      <>
        <p>
          Since the product was at a very early stage, I was interested in exploring opportunities in the online food order & delivery digital products. <br />
          For the research I conducted is Primary Research through User Experience Interview & Surveys while keeping the research goals in mind. <br />
          There is been plus and minuses which I received from the user which is valuable to develop the further product. <br />
          I channelize the data into Research Insights <br />
        </p>



      </>
    ),
    badge: "Research",
    images: ["https://cdn.sanity.io/images/loniby3f/production/f85f9359360dc4860a17e37efcfad21f64e21971-3840x2160.png",],
  },

  {
    title: "Research Insights",
    description: (
      <>
        <h2 className="text-3xl">Customers UX Interview Insights :</h2>

        <p>
          Conducting User UX Interview at this particular early stage is valuable to validate the problem hypothesis as well as new problem opportunities to solve users are facing. <br />

          I channelize the valuable insights I receive from the User UX Interview into more visual and clear way by creating Empathy Mapping. <br />
        </p>
        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <p>
          Empathy Mapping makes clear that people are facing trust issues with particular food provided by particular restaurant. <br />
          To further validate my problem hypothesis, i conducted UX User Survey to understand overall user's perspective over the food ordering online <br />
        </p>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <h2 className="text-3xl">Customers UX Survey Insights :</h2>

        <p>
          There is a total of 10 Participants from different working backgrounds who mostly order food online. <br />

          Here is the link to the <a href="https://drive.google.com/file/d/19eZQM4qxmQeemnCwhn1gotOf6koN81-x/view?usp=sharing" className="hover:text-slate-400">Full Survey Result Report</a>

        </p>

      </>
    ),
    badge: "Insights",
    images: ["https://cdn.sanity.io/images/loniby3f/production/820e0e800091a29dc2dffeba1b3791e54610b791-5760x3240.png", "https://cdn.sanity.io/images/loniby3f/production/e1ac9753fe5b65587030803e8f6fe40d9832312c-3840x4850.png"],
  },

  {
    title: "Pain Points",
    description: (
      <>
        <p>From the User Research and Survey data it is easier now to conclude the pain points users are facing : <br />

          <ol className="list-decimal">
            <li>Lack of Structure & Information - Users are not able to easily navigate in menu and doesn't able to find the images of food or name</li>
            <li>Image is not authentic - Users doesn't able to trust the specific food due to stock or fake images provided from the restaurants</li>
          </ol>

          After Defining the Pain Points of the users, it's time to craft the Fictional User Personas based on Research I have done to define goals and characteristics which will represent the needs of a larger group of possible users

        </p>

      </>
    ),
    badge: "Pain Points",
    images: ["https://cdn.sanity.io/images/loniby3f/production/2d4c923f400e349ad816cef7ae0c1d49fd00820b-3840x1332.png",],
  },

];
