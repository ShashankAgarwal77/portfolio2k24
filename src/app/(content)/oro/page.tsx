"use client";

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { TracingBeam } from "@/app/components/Animations/tracing-beam-animation";
import { AnimatedTooltipCard } from "@/app/components/uiFrontend/animated-tooltip";
import { SpotlightPreview } from "@/app/components/uiFrontend/spotlight";

import Introduction01 from "@/app/Assets/Images/OroCaseStudy/Introduction/Introduction01.png";
import Introduction02 from "@/app/Assets/Images/OroCaseStudy/Introduction/Introduction02.png";
import Introduction03 from "@/app/Assets/Images/OroCaseStudy/Introduction/Introduction03.png";
import ProblemImg from "@/app/Assets/Images/OroCaseStudy/Problem.jpg";

// Objective Images
import ObjectiveImg from '@/app/Assets/Images/OroCaseStudy/Objective/Objective.png';
import ResultImg from '@/app/Assets/Images/OroCaseStudy/Objective/Result.png';

import ProcessImg from "@/app/Assets/Images/OroCaseStudy/Process.png";

// Conceptualize Images
import JourneyImg from "@/app/Assets/Images/OroCaseStudy/Conceptualize/UserJourney.png";
import UserTakeaways from "@/app/Assets/Images/OroCaseStudy/Conceptualize/KeyTakeaways.png";
import CompetitionImg from "@/app/Assets/Images/OroCaseStudy/Conceptualize/Competitive.png";
import Thumbnail from "@/app/Assets/Images/OroCaseStudy/Thumbnailpng.png";
import EmpathiseImg from "@/app/Assets/Images/OroCaseStudy/Empathise.png";

// Design Images
import DesignWorkflowImg from "@/app/Assets/Images/OroCaseStudy/Design/DesignWorkflow.png";
import RevampMockup01 from "@/app/Assets/Images/OroCaseStudy/Design/RevampMockups_01.png";
import RevampMockup02 from "@/app/Assets/Images/OroCaseStudy/Design/RevampMockups_02.png";

//Deliver Images
import Deliver01 from "@/app/Assets/Images/OroCaseStudy/Deliver/Deliver01.png";

//Result Images 
import Result01 from "@/app/Assets/Images/OroCaseStudy/Result/Result01.png";
import Result02 from "@/app/Assets/Images/OroCaseStudy/Result/Result02.png";
import Result03 from "@/app/Assets/Images/OroCaseStudy/Result/Result03.png";
import Blockquote from '@/app/components/uiFrontend/blockquote';
import HorizontalLine from '@/app/components/uiFrontend/horizontal-rule';
import FigmaEmbedLogistics from '../figmaSlides/logistics';

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
      <FigmaEmbedLogistics />

      <div className="grid grid-cols-1 content-end h-screen items-center content-end">
        <div className="flex flex-row justify-center pb-6">
          <h2 className="text-2xl xl:text-6xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text font-medium">Orocorp Redefined</h2>
        </div>
        <div className="flex flex-row justify-center">
          <Image src={Thumbnail} alt="Thumbnail Alt Text" width={1080}></Image>
        </div>
      </div>

      <SpotlightPreview />

      <TracingBeam className="px-6 xl:max-w-5xl mx-auto my-40 overflow-y-clip">
        <div className="mx-auto antialiased pt-8 relative">
          {dummyContent.map((item, index) => (
            <div key={`content-${index}`} id={`content-${index}`} className="mb-10">
              <h2 className="bg-black/[0.1] dark:bg-white/[0.1] text-gray-800 dark:text-gray-400 rounded-full sm:text-sm md:text-md lg:text-xl w-fit px-4 py-1 mb-4 font-bold">
                {item.badge}
              </h2>
              <p className="sm:leading-loose tracking-wide sm:text-xl md:leading-loose md:text-xl lg:leading-normal lg:text-4xl text-black dark:text-white sm:mb-4 md:mb-6 lg:mb-8 font-semibold">
                {item.title}
              </p>
              <div className="md:leading-normal md:text-sm lg:leading-loose lg:text-lg tracking-wide text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert">
                {item.images && item.images.map((image, imgIndex) => (
                  <Image
                    key={`image-${imgIndex}`}
                    src={image as any} // Type assertion
                    alt={`blog thumbnail ${imgIndex}`}
                    height="2000"
                    width="2000"
                    className="rounded-lg object-cover"
                  />
                ))}
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>

      <div className="hidden lg:flex fixed mx-10 my-40">
        <div ref={sidebarRef} className="flex flex-col relative items-start">
          <h2 className="text-slate-200 dark:text-slate-600 text-md uppercase font-bold mb-4">Content</h2>
          <ul className="space-y-4 w-48">
            {dummyContent.map((item, index) => (
              <li key={`sidebar-item-${index}`}>
                <a
                  href={`#content-${index}`}
                  className={`text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-white ${activeSection === index ? "text-slate-900 dark:text-white" : ""}`}
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
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h4 className="text-2xl pb-4">My Roles &amp; Responsibilities</h4>
          <ul className="list-disc text-justify leading-loose text-normal">
            <li>
              <b>UX Analysis :</b> Curating Customer Journey Mapping, Card Sorting Analysis, Heuristic Evaluation, Implementing UX Laws and much more
            </li>
            <li>
              <b>UI Design :</b> Multiple Iterations and Ideation on Low &amp; High Fidelity Wireframes and Mockups..
            </li>
            <li>
              Make vision easily understand to the Stakeholders, PMs, Developers in (UX, Software, Product).
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-2xl pb-4">Shoutouts</h4>
          <div className=" flex flex-col ">
            <AnimatedTooltipCard />
          </div>
          <h4 className="text-2xl pb-4">Status &amp; Timeline</h4>
          <ul className="list-disc text-justify leading-loose text-normal">
            <li>2 Months, Designed Handoff done in March 2022</li>
            <li>Overall Work Period : January 2022 to October 2023</li>
            <li>
              Product Designer @ Orocorp, Tech Office is in Chennai, I worked remotely
            </li>
          </ul>
        </div>
      </div>
    ),
    badge: "Overview",
    // image: Orothumbnail,
  },

  {
    title: "It all started in January 2022",
    description: (
      <>
        <Blockquote content="Revamped UI of the core product of Orocorp" type="Image" />
        <br />

        <p>
          In January 2022, Oro decided to redesign their product offerings &amp;
          expand their business to new cities. To achieve this they need to ship
          more refined and polished product which users can easily use.
        </p>

        <br />
        <Image src={Introduction02} alt="alt" className="rounded-xl py-2" />
        <Blockquote content="Component Hightlights of multiple products of oro" type="Image" />
        <br />

        <p>
          Designing &amp; leading the end-to-end design direction of the mobile experience for core users which drive the main business of the company.
        </p>

        <br />
        <Image src={Introduction03} alt="alt" className="rounded-xl py-2" />
        <Blockquote content="All of the products I have worked while at Oro" type="Image" />
        <br />

        <p>
          The app and website launch was met with outstanding end customer response, alongside <span className="text-2xl">127% increase</span> in user engagement in the first month itself.
        </p>

      </>
    ),
    badge: "Introduction",
    images: [Introduction01],
  },

  {
    title: "Some Assumptions I had before designing",
    description: (
      <>
      <ul className="list-disc">
        <li><b>Ease of Use :</b> Previous Customer App is not user-friendly & easy to navigate for customers</li>
        <li><b>Trust :</b> Previous Customer App doesn't generate higher level of trust in customers</li>
        <li><b>Transparency :</b> Previous Customer App doesn't provide clear and transparent loan information to customers</li>
      </ul>
      </>
    ),
    badge: "Assumptions",
  },

  {
    title:
      "In India, there is no seamless experience that handles doorstep gold loan service that customers are truly satisfied with.",
    description: (
      <>
        <Blockquote content='Generate this image using Microsoft Designer AI' type="Image" />
        <br />

        <p>
          One of the key challenges we aimed to address was improving the
          overall user experience for our customers seeking instant gold loans.
          By understanding their pain points and needs, we strived to create a
          seamless borrowing journey that instilled trust and confidence in our
          services. Additionally, we aimed to streamline the interfaces of our
          Customer App, Partner App, and Admin Dashboard, making them more
          intuitive and user-friendly. <br />
        </p>

      </>
    ),
    badge: "Problem",
    images:
      [ProblemImg,]
  },

  {
    title:
      "Simplifying Doorstep Gold Loans for Indians with the marvellous result",
    description: (
      <>

        <Blockquote content='This is the overview we formed & Result we get' type="Image" />

      </>
    ),
    badge: "Objective",
    images:
      [ObjectiveImg, ResultImg]
  },

  {
    title: "Design process I followed is Double Diamond",
    description: (
      <>
        <Blockquote content='I diverge & converge basis on the task particular task I am doing' type="Image" />
        <br />
        <p>
          Following a user-centered design approach, we embarked on a
          comprehensive design process. We ideated, prototyped, and iterated on
          various solutions, considering stakeholder's input at
          each stage. We created customer journey maps that visualized the
          borrower&apos;s end-to-end experience, enabling us to identify
          opportunities for improvement and streamline the loan application
          process.
        </p>

      </>
    ),
    badge: "Process",
    images:
      [ProcessImg,]
  },

  {
    // title: "Design process I followed is Double Diamond",
    description: (
      <>

      </>
    ),
    badge: "Empathize",
    images:
      [EmpathiseImg,]
  },

  {
    title: "After taking enough insights from stakeholders. It’s time to defined the process",
    description: (
      <>
        <br />
        <ul className="list-disc">
          <li>Based on the gathered data, it is important to recreated the user journey mapping of targeted audience</li>
          <li>So I created user persona & new user journey mapping (optimized the whole flow from 12 phases into 9 phases)</li>
          <li>User Journey includes : Journey Phases, Actions, Experience, Pain Points, Opportunities and Emotions Touchpoints</li>
          <li>Presented our insights in front of stakeholders, PMs and tech team to align and show the vision of revamped flow</li>
        </ul>

        <HorizontalLine />

        <h4 className="text-xl lg:text-3xl">Key Takeaways from Customer Journey Mapping</h4>

        <br />
        <Image src={UserTakeaways} alt="alt" className="rounded-xl py-2" />


        <HorizontalLine />

        <h4 className="text-3xl pb-4">Once mapping is done, it’s time to understand what competitors are doing ?</h4>
        <p>
          I conducted competitor analysis on Google Sheets and categorized this activitiy into sub modules such as :
        </p>

        <br />
        <Image src={CompetitionImg} alt="alt" className="rounded-xl py-2"></Image>

      </>
    ),
    badge: "Conceptualize",
    images:
      [JourneyImg,]
  },

  {
    title: "We were on a tight deadline and developers need to start developing soon.",
    description: (
      <>
        <Image src={DesignWorkflowImg} alt="alt" className="rounded-xl py-2"></Image>
        <Blockquote content='My Design Workflow for designing Customer App' type='Image'></Blockquote>
        <br />

        <h4 className="text-3xl">Here is the glimpse of some of the final mockups at different stages of Oro Consumer App</h4>

        <br />
        <Image src={RevampMockup01} alt="alt" className="rounded-xl py-2"></Image>
        <Blockquote content='Visual Mockups of Bunch of Screens as the part of Gold Loan Flow in Cx App' type='Image'></Blockquote>
        <br />

        <Image src={RevampMockup02} alt="alt" className="rounded-xl py-2"></Image>
        <Blockquote content='Every UI design has been done with all consideration of the edgecases' type='Image'></Blockquote>
        <br />
      </>
    ),
    badge: "Design",
  },

  {
    title: "Once product & design requirements are done. It’s our duty to give proper guidelines to the developers for polished development",
    description: (
      <>
      <Blockquote content='Hand off the designs has been done by creating DesignPRD in linear (Product Management Tool) and UX Audits in Notion. This gradually reduces the many queries from developers regarding the flow or user interaction.' type='image'></Blockquote>

      </>
    ),
    badge: "Deliver",
    images:
      [Deliver01]

  },

  {
    title: "Redesign the Customer App for Oromoney Product reduced the gold loan booking time from 45 minutes to ~28 minutes",
    description: (
      <>
        <p>
          The implementation of the revamped interfaces and improved user experience had a significant positive impact. Customer satisfaction increased as they found it easier to navigate the loan application process, understand the loan terms, and access relevant information. We observed a substantial reduction in customer drop-offs during the loan application as well as new customer journey through landing pages, leading to a higher conversion rate and increased business success.
        </p>
      </>
    ),
    badge: "Result",
    images:
      [Result01, Result02, Result03]

  },

  {
    title: "Lessons Learned, Conclusion & Other Projects I have worked on",
    description: (
      <>
        <p>
          Throughout these projects, I learned valuable lessons about the importance of user feedback, collaboration with stakeholders, and continuous iteration. User insights played a pivotal role in guiding our design decisions and prioritizing features. I also recognized the value of involving stakeholders early on to align expectations and ensure smooth project execution.
        </p>

        <HorizontalLine />

        <ul className="list-disc"> Other than Customer App, I have worked on multiple products throughout my time period @ Oro. Other products / projects are :
          <li>Partner App Revamp</li>
          <li>Admin Dashboard Revamp</li>
          <li>Quali - Lead Management Application Design</li>
          <li>Landing Page Designs</li>
          <li>Aurum Design System</li>
        </ul>

        <HorizontalLine />

        <p>
          In conclusion, my work at Oro involved creating customer journey maps, revamping UIs, and redesigning landing pages to enhance the overall user experience. By addressing pain points, streamlining processes, and improving transparency, we achieved higher customer satisfaction and business success. These projects not only showcased the value of UX but also contributed to my professional growth as a UX professional in delivering impactful solutions.
        </p>

      </>
    ),
    badge: "Conclusion",

  },
];
