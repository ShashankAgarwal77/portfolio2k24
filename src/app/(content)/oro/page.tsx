"use client";

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { TracingBeam } from "@/app/components/Animations/tracing-beam-animation";
import { AnimatedTooltipCard } from "@/app/components/uiFrontend/animated-tooltip";
import { SpotlightPreview } from "@/app/components/uiFrontend/spotlight";

import OroIntroduction from "@/app/Assets/Images/OroCaseStudy/Introduction.png";
import ProblemImg from "@/app/Assets/Images/OroCaseStudy/Problem.png";
import ProcessImg from "@/app/Assets/Images/OroCaseStudy/Process.png";
import JourneyImg from "@/app/Assets/Images/OroCaseStudy/UserJourney.png";
import Thumbnail from "@/app/Assets/Images/OroCaseStudy/Thumbnailpng.png";

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
      <div className="grid grid-cols-1 content-end h-screen items-center content-end">
        <div className="flex flex-row justify-center pb-6">
          <h2 className="text-2xl xl:text-6xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">Orocorp Redefined</h2>
        </div>
        <div className="flex flex-row justify-center">
          <Image src={Thumbnail} alt="Thumbnail Alt Text" width={1400}></Image>
        </div>
      </div>

      <SpotlightPreview />

      <TracingBeam className="px-6 xl:max-w-5xl mx-auto my-40 overflow-y-clip">
        <div className="mx-auto antialiased pt-8 relative">
          {dummyContent.map((item, index) => (
            <div key={`content-${index}`} id={`content-${index}`} className="mb-10">
              <h2 className="bg-black/[0.1] dark:bg-white/[0.1] text-gray-800 dark:text-gray-400 rounded-full sm:text-sm md:text-md lg:text-xl w-fit px-4 py-1 mb-4">
                {item.badge}
              </h2>
              <p className="sm:leading-loose tracking-wide sm:text-xl md:leading-loose md:text-xl lg:leading-normal lg:text-4xl text-black dark:text-white sm:mb-4 md:mb-6 lg:mb-8">
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
        <div ref={sidebarRef} className="flex flex-col relative items-start">
          <h2 className="text-slate-600 text-md uppercase font-bold mb-4">Content</h2>
          <ul className="space-y-4 w-48">
            {dummyContent.map((item, index) => (
              <li key={`sidebar-item-${index}`}>
                <a
                  href={`#content-${index}`}
                  className={`text-neutral-500 hover:text-white ${activeSection === index ? "text-white" : ""}`}
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
        <p>
          In January 2022, Oro decided to redesign their product offerings &amp;
          expand their business to new cities. To achieve this they need to ship
          more refined and polished product which users can easily use. <br />
          <br />
          I worked as a Product designer, designing &amp; leading the end-to-end
          design direction of the mobile experience for core users which drive
          the main business of the company. <br />
          <br />
          The app and website launch was met with outstanding end customer
          response, alongside 127% increase in user engagement in the first
          month itself. <br />
        </p>


      </>
    ),
    badge: "Introduction",
    images: [OroIntroduction],
  },

  {
    title:
      "Transforming Gold Loan Services: Enhancing User Experience and Streamlining Interfaces in India",
    description: (
      <>
        <p>
          In India, there is no seamless experience that handles doorstep gold
          loan service that customers are truly satisfied with. <br />
          <br />
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
    title: "Simplifying Doorstep Gold Loans for Indians with Enhanced UI/UX",
    description: (
      <>
        <p>
          Research, strategize &amp; design an mobile application to help
          Indian&apos;s get doorstep gold loans, with a focus to improve UI
          &amp; UX in-app. Which results reduce the gold loan application time
          from 45 minutes to ~28 minutes.
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
          Following a user-centered design approach, we embarked on a
          comprehensive design process. We ideated, prototyped, and iterated on
          various solutions, considering user feedback and stakeholder input at
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
    title: "Lacked understanding of app navigation which leads too much time to complete booking appointment",
    description: (
      <>
        <ul className="list-disc">
          <li>Based on the data metrics I received from product & design managers and data analysts.</li>
          <li>Defined the problems such as complicated loan booking appointment, unclear loan terms & lack of transparency and navigation.</li>
          <li>End users are looking for easy to navigate app.</li>
          <li>End users need well designed application.</li>
        </ul>

      </>
    ),
    badge: "Empathize",
    // image:
    //   "https://cdn.sanity.io/images/loniby3f/production/144f349e74ee8395acef78dd7d33693ccc099220-3840x2160.png",
  },

  {
    title: "After taking enough insights from users, managers & analytics team. It’s time to defined the process",
    description: (
      <>
        <ul className="list-disc">
          <li>Based on the gathered data, it is important to recreated the user journey mapping of targeted audience</li>
          <li>So I created user persona & new user journey mapping (optimized the whole flow from 12 phases into 9 phases)</li>
          <li>User Journey includes : Journey Phases, Actions, Experience, Pain Points, Opportunities and Emotions Touchpoints</li>
          <li>Presented our insights in front of stakeholders, PMs and tech team to align and show the vision of revamped flow</li>
        </ul>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <h4 className="text-2xl pb-4">Key Takeaways from Customer Journey Mapping</h4>

        <ul className="list-disc">
          <li>Customer feels lack of trust when installed app first time</li>
          <li>Customer are struggling by pressing the small CTA that is hard to reach</li>
          <li>Customer find it hard to understand all of the terms of gold loan</li>
          <li>Customer find it hard to manage gold loan for repayments</li>
          <li>Customer feels insecure about gold stored at faculity</li>
        </ul>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />


        <h4 className="text-3xl pb-4">Once mapping is done, it’s time to understand what competitors are doing ?</h4>
        <p>
          I conducted competitor analysis on Google Sheets and categorized this activitiy into sub modules such as :
        </p>
        <ul className="list-disc">
          <li>General Information : Competitor Type, Location, Product Offering, Price, Business Size and Targeted Audience</li>
          <li>First Impression : Desktop Website Experience, Mobile and App Experience</li>
          <li>Interaction : Features, Accessibility, User Flow and Navigation</li>
          <li>Visual Design : Brand Identity</li>
          <li>Content : Tone and Descriptiveness</li>
        </ul>
        <br />
        <p>Insights : I found even competitors have great product features but the execution such as well designed product is still main concern, so this could be our opportinuity to create more seamless well designed product</p>

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
        <ul className="list-disc">
          <li>So we sit for kickoff call and start gathering inspiration from multiple apps out there</li>
          <li>Once wireframes of particular phase is finalized with start with the content finalization</li>
          <li>Once content is finalized, we started with the visual UI design</li>
          <li>There are certain spacing, icons and font guidelines which are defined. so we use them for our visual design</li>
          <li>Using the visual design system helps me to create UI faster</li>
        </ul>
      </>
    ),
    badge: "Design",
    images:
      ["https://cdn.sanity.io/images/loniby3f/production/2f2d0be6fed39d415e488e3f4e9ba60ca3711204-3864x2184.png", "https://cdn.sanity.io/images/loniby3f/production/f8bc264455f340f9a4c9124343bc59ee269e6d87-3864x2184.png"]


  },

  {
    title: "Once product & design requirements are done. It’s our duty to give proper guidelines to the developers for polished development",
    description: (
      <>
        <p>
          Throughout the journey, I was collaborating closely with developers and product managers, we implemented the redesigned interfaces for the Customer App, Partner App, and Admin Dashboard. Throughout the implementation phase, we conducted rigorous testing to ensure the usability and functionality of the new designs. Any issues or challenges that arose were addressed promptly, resulting in a seamless transition to the enhanced user interfaces.
        </p>
        <ul className="list-disc">
          <li>Hand off the designs by creating DesignPRD in linear and UX Audits in notion which includes the updated designs, typography, color and spacing guidelines which gradually reduces the many queries from developers</li>
        </ul>
      </>
    ),
    badge: "Deliver",
    images:
      ["https://cdn.sanity.io/images/loniby3f/production/8186a6d61181c956ce13aff184cf3776a466caca-2000x1208.png"]

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
      ["https://cdn.sanity.io/images/loniby3f/production/258845651104cc46d8161f0c6043744a1606c0f2-2876x1608.gif", "https://cdn.sanity.io/images/loniby3f/production/9e94a1e7453604e2d21285f8da97aefa0d9592dc-3840x2160.png", "https://cdn.sanity.io/images/loniby3f/production/1f99306611d4ecd2711765549851fb90379baf3d-3840x4486.png", "https://cdn.sanity.io/images/loniby3f/production/159cb63a2b2fcc7635829dfdcbd79add9dcad81a-951x716.png"]

  },

  {
    title: "Lessons Learned, Conclusion & Other Projects I have worked on",
    description: (
      <>
        <p>
          Throughout these projects, I learned valuable lessons about the importance of user feedback, collaboration with stakeholders, and continuous iteration. User insights played a pivotal role in guiding our design decisions and prioritizing features. I also recognized the value of involving stakeholders early on to align expectations and ensure smooth project execution.
        </p>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <ul className="list-disc"> Other than Customer App, I have worked on multiple products throughout my time period @ Oro. Other products / projects are :
          <li>Partner App Revamp</li>
          <li>Admin Dashboard Revamp</li>
          <li>Quali - Lead Management Application Design</li>
          <li>Landing Page Designs</li>
          <li>Aurum Design System</li>
        </ul>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <p>
          In conclusion, my work at Oro involved creating customer journey maps, revamping UIs, and redesigning landing pages to enhance the overall user experience. By addressing pain points, streamlining processes, and improving transparency, we achieved higher customer satisfaction and business success. These projects not only showcased the value of UX but also contributed to my professional growth as a UX professional in delivering impactful solutions.
        </p>

      </>
    ),
    badge: "Conclusion",

  },
];
