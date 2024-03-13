"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { TracingBeam } from "@/app/components/Animations/tracing-beam-animation";
import { AnimatedTooltipCard } from "@/app/components/uiFrontend/animated-tooltip";
import { SpotlightPreview } from "@/app/components/uiFrontend/spotlight";


//Import Image
import HonestThumbnail01_Img from "@/app/Assets/Images/HonestIntroduction.png";

//Problem Section Images
import ProblemImg from "@/app/Assets/Images/HonestCaseStudy/Problem.png";

//Hypothesis Section Images
import Hypothesis01_Img from "@/app/Assets/Images/HonestCaseStudy/Hypothesis.png";

//Constrains Section Images
import Constrains01_img from "@/app/Assets/Images/HonestCaseStudy/Constrains.png";



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
        <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-transparent">

          <p className="text-lg italic font-medium leading-relaxed text-gray-900 dark:text-gray-400">Highlights of the UI of core consumer product</p>

          <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-gray-900 uppercase tracking-wide text-gray-500 text-lg'>Image</p>

        </blockquote>
        <p>
          In a bustling world where time is of the essence, and appetites crave authenticity, I am set out on a journey to craft an unparalleled user experience in the realm of food ordering and delivery. Welcome to the story of Honest Bites a revolutionary application that tantalizes taste buds, builds trust, and elevates convenience for every culinary explorer.
        </p>


      </>
    ),
    badge: "Introduction",
    images: [HonestThumbnail01_Img],

  },
  {
    title: "Quick info about the project",
    description: (
      <>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 md:gap-16 lg:gap-32">
          <div>
            <h4 className="text-2xl pb-4">My Roles &amp; Responsibilities</h4>
            <ul className="list-disc text-justify leading-loose text-normal">
              <li>
                <b>UX Analysis :</b> Problem Hypothesis Ideation & Validation, Curating Customer Journey Mapping, Heuristic Evaluation, Implementing UX Laws and much more.
              </li>
              <li>
                <b>UI Design :</b> Multiple Iterations and Ideation on Low &amp; High Fidelity Wireframes and Mockups.
              </li>
              <li>
                Make vision easily understandable to the Stakeholders, PMs, Developers in (UX, Software, Product).
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl pb-4">Status &amp; Timeline</h4>
            <ul className="list-disc text-justify leading-loose text-normal">
              <li>First Version designed back from June 2021 to August 2021</li>
              <li>Second Version designed back in Decemeber 2023</li>
            </ul>
          </div>
        </div>
      </>
    ),
    badge: "Overview",

  },
  {
    title: "Major issue faced by consumers right now.",
    description: (
      <>

      </>
    ),
    badge: "Problem",
    images: [ProblemImg,],


  },
  {
    title: "Some of the Hypothesis I formed before working on the problem",
    description: (
      <>

      </>
    ),
    badge: "Hypothesis",
    images: [Hypothesis01_Img],

  },
  {
    title: "Some of the Constrains I Need to bear before designing the solution",
    description: (
      <>

      </>
    ),
    badge: "Constrains",
    images: [Constrains01_img],

  },
  {
    title: "",
    description: (
      <>

      </>
    ),
    badge: "Success",
    // images: [HonestThumbnail],

  },
  {
    title: "",
    description: (
      <>

      </>
    ),
    badge: "Process",
    // images: [HonestThumbnail],

  },
  {
    title: "",
    description: (
      <>

      </>
    ),
    badge: "Ideation",
    // images: [HonestThumbnail],

  },
  {
    title: "",
    description: (
      <>

      </>
    ),
    badge: "User Testing",
    // images: [HonestThumbnail],

  },
  {
    title: "",
    description: (
      <>

      </>
    ),
    badge: "Outcome",
    // images: [HonestThumbnail],

  },
  {
    title: "",
    description: (
      <>

      </>
    ),
    badge: "Key Learnings",
    // images: [HonestThumbnail],

  },

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
    // images: [HonestThumbnail],

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

  {
    title: "Persona Hypothesis I created",
    description: (
      <>
        <p>It is important to channelize all of the data I received from Research into a singular person  persona to clarify user goals & frustrations with their background story </p> <br />

        <p>To Empathize more with users I tried to create a User Story that will tell users a fictional story in one sentence from the Persona's Point of View based on Who, What, and Why.</p>


      </>
    ),
    badge: "Personas",
    images: ["https://cdn.sanity.io/images/loniby3f/production/9b60ae14f4432bc5fcbb7441c4ec660ab0a69325-3840x2160.png",],
  },

  {
    title: "User Story Formed",
    description: (
      <>
        <h2 className="text-3xl"> Sahil Rajput</h2>
        <br />
        <p>
          <b>As a/an</b> Software engineer in Urban Bengaluru <br />
          <b>I want to</b> experience diverse cuisines with accurate representation of dishes <br />
          <b>so that</b> it will satisfy my adventurous palate with my taste preferences <br />
        </p>
        <br />
        <p>Now it was pretty clear about the user needs through Persona & User Story, I started to visualize the User Journey Mapping</p>
      </>
    ),
    badge: "Story",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/9b60ae14f4432bc5fcbb7441c4ec660ab0a69325-3840x2160.png",],
  },

  {
    title: "User Journey Mapping",
    description: (
      <>
        <p>User Journey Mapping helps me to understand multiple aspects of users tasks performance and more importantly their emotional feelings and improvement opportunities for the product</p>
        <br />
        <p><b>Insights:</b> </p> <br />
        <ul className="list-disc">
          <li>User's total journey is divided into 8 phases</li>
          <li>Improvement Opportunity : Inclusion of Personalized, Transparecy , Informative & Trust into product</li>
        </ul>
      </>
    ),
    badge: "Journey",
    images: ["https://cdn.sanity.io/images/loniby3f/production/92ff8bccaf587e66197b0424a87846984af59a12-7680x6624.png",],
  },

  {
    title: "Problem Statement",
    description: (
      <>
        <p>Now i have enough data to empathize, i stated the pain points of the consumers into Problem Statement by defining Who, What, Where, When, Why and How of the problem <br />

          By Defining this framework I was able to clearly state the user characteristics, the user needs, and what particular insight I gain from it
        </p> <br />

        <h2 className="text-2xl leading-10">Problem Statement - Sahil Rajput</h2>
        <p>
          Sahil Rajput <b>is/an</b> software engineer who needs to order cuisines online with trusted representation of dishes because he want to be an explorer of new cuisines from multiple restaurants
        </p> <br />
        <p>Now, I understand what user pain points are and define a problem statement that covers a large group of targeted users <br />

          It's time to do a Competitive Audit to understand what potential direct and indirect competitors doing for this particular problem</p>
      </>
    ),
    badge: "Problem",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/92ff8bccaf587e66197b0424a87846984af59a12-7680x6624.png",],
  },

  {
    title: "Competitive Audit",
    description: (
      <>
        <p>
          I have done the audit between 3 Companies i.e., Swiggy, Zomato, and Hello Green in which Swiggy and Zomato are Direct Competitors and Hello Green is Indirect Competitor. <br />

          I tried to Audit their Product Offerings, Business Size, Targeted Audience, USPs, First Impressions, Interaction, Visual Design, and Content. <br />

          You can view the whole excel sheet <a href="https://drive.google.com/file/d/1ill-txIR4WjzosMIGLluKgvxMKay-8hv/view" className="hover:text-gray-500">Report Here</a>
        </p> <br />
        <br />

        <h2 className="text-2xl">Competitive Audit Report</h2>
        <ul className="list-disc">After doing the extensive audit of each competitor, I create the Competitive Audit Report which summarizes the <br />
          <li>Competitive Audit Goals</li>
          <li>Who are the Key Competitors?</li>
          <li>What are the type and quality of competitor's products?</li>
          <li>How do competitors position themselves in the market?</li>
          <li>How do competitors talk about themselves?</li>
          <li>Competitors' strengths</li>
        </ul>

        <p>You can read the whole <a href="https://drive.google.com/file/d/1ill-txIR4WjzosMIGLluKgvxMKay-8hv/view" className="hover:text-gray-500">Report Here</a></p>
      </>
    ),
    badge: "Audit",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/92ff8bccaf587e66197b0424a87846984af59a12-7680x6624.png",],
  },

  {
    title: "Goal Statement",
    description: (
      <>
        <p>
          It's time to finalize the problem statement and user pain points into the Final Statement as my Goal Statement
        </p>
        <h2 className="text-3xl leading-10 py-8">Our HonestBites will let users order food with trust and transparency which will affect users like sahil who are explorer of different cuisines from different restuarants by satisfy there adventurous palate with their taste preferences. We will measure effectiveness by analyzing the consumer loyalty towards the platform</h2>
      </>
    ),
    badge: "Goal",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/92ff8bccaf587e66197b0424a87846984af59a12-7680x6624.png",],
  },


  {
    title: "Storyboard",
    description: (
      <>
        <p>I use storyboard to visualize and ideate the product scenario</p>
      </>
    ),
    badge: "Story",
    images: ["https://cdn.sanity.io/images/loniby3f/production/f882216c7db4b643e37bbda51ddda35fcc2d90cd-3840x2146.png",],
  },

  {
    title: "Information Architecture(IA) & User Flow",
    description: (
      <>
        <p>Now as I have clear in my mind about user & product scenario of pain points and opportunities , I have started to created the information architecture
          <br />
          Information Architecture really helps me to create the structure of navigation & components I will use in the user-flow journey.
          <br />
          You can preview the whole IA by <a href="https://www.figma.com/file/pIdmfbNQDwkJ8lJKyc7rX8/HonestBites---UX-Case-Study?type=design&node-id=274%3A1702&mode=design&t=zY0XaOncAy5QCPNh-1" className="hover:text-rgay-500">Click Here</a> <br />

          After, <br />
          <ul className="list-disc">
            <li>Empathize with users about their needs and pain points</li>
            <li>Defining the Problem Statement and Goal Statement</li>
            <li>Ideating about the scenario using Crazy's 8 and Storyboards</li>
            <li>Developing the Information Architecture (IA)</li>
          </ul>
          <br />
          It's time to start the designing process <br />
        </p>
      </>
    ),
    badge: "IA",
    images: ["https://cdn.sanity.io/images/loniby3f/production/ee5245efd2186017a857fe32e0587155c42b18bd-7680x21272.png",],
  },

  {
    title: "Low Fiedility Wireframes",
    description: (
      <>
        <p>Creating Paper Wireframes really helps me to brainstorm ideas on how can particular component can be placed in content architecture.<br /> <br />

          <h2 className="text-3xl">My Goals:</h2>
          I tried to create 5 different Versions of a Single Page and Pick the Best Component I like from each of the different versions and create the final version.

          <h2 className="text-3xl">My Thoughts:</h2>
          Finding the best possible way to organize the content structure so that users can easily able to access and navigate through pages.
        </p>

      </>
    ),
    badge: "Low-Fi",
    images: ["https://cdn.sanity.io/images/loniby3f/production/f99cdc857564e73130a68b616532bf0be6711977-2560x2180.png",],
  },

  {
    title: "Design System",
    description: (
      <>
        <p>
          Once my wireframes are finalized, i started to create the mini design system for my project, started with the basics of defining the fundamentals such as color pallete, typography, iconography & basic components. <br />

          Aim is to build the foundation first, so future designed elements can be easily added and documented <br />
        </p>

      </>
    ),
    badge: "DS",
    images: ["https://cdn.sanity.io/images/loniby3f/production/3129006f755af3adbea887bbd0e5932235683c2e-11264x7008.png",],
  },

  {
    title: " High Fiedility Mockups",
    description: (
      <>
        <h2 className="text-3xl">Points to be explained :</h2> <br />
        <ul className="list-decimal">
          <li>Food Overview - Provided by restaurant to summarize about the dish in words</li>
          <li>Images Uploaded by Restaurant - Curated photos and videos uploaded by the restaurant of particular food</li>
          <li>Ratings & Reviews - Provided by the customers with the option to for customer to upload their rating & reviews of particular dish</li>
          <li>Overall Customers Rating - Channelize way to show all of the ratings provided by the customers</li>
          <li>All Customer Reviews - Show All images and reviews shared by the customers</li>
          <li>Sort Funtionality - Filter out the reviews by multiple filter options such as High to Low or Low to High Rating</li>
          <li>Review Media Share - Each review have option for user to upload photo or video of the image</li>
          <li>Header & sub-caption - Each review is divided into smaller contextual heading with the sub-caption which supports the heading</li>
          <li>User Verification - User Profile and Name will be reflected with the verified user badge which verifies the authencitiy of the review from HonestBites</li>
          <li>Report Issue - If user have any issue with the food information, reviews or food itself they can report to the HonestBites as well as Restaurant regarding the issue</li>
        </ul> <br />
        <p>Once Mockups are ready, it's time for usability testing of these designs but due to less time i have after my job i decided to give an AI try. I use AI tools such as Attention Insights to get an heatmap about how might users will react/behave on particular screen</p>
      </>
    ),
    badge: "High-Fi",
    images: ["https://cdn.sanity.io/images/loniby3f/production/ada757caa300eb4e4b1e68c4cee7e131cf107143-7680x4320.png", "https://cdn.sanity.io/images/loniby3f/production/96c93f42fe991f9999f3a0da16c95c606b20f84a-7680x4320.png", "https://cdn.sanity.io/images/loniby3f/production/d78e0685021b799e2ac2b0ed1c42e3e24aa8da7c-7680x4320.png"],
  },

  {
    title: "Insights & Findings",
    description: (
      <>
        <p>Attention Insights data is helpful for giving constructive feedback which improves overall visuals of the design of the product</p>
      </>
    ),
    badge: "Insights",
    images: ["https://cdn.sanity.io/images/loniby3f/production/be7a5e8eafff7351b0287a7ff69d59346e07a80e-7680x5584.png", "https://cdn.sanity.io/images/loniby3f/production/464e330bd95793dd13f0cc6b8abac5828dc445a1-7680x5584.png"],
  },

  {
    title: "Insights & Findings",
    description: (
      <>
        <p>
          <h2 className="text-2xl">Impact</h2>
          This project really impacts me as an individual because it really helps me understand how critical is UX for any business to grow on the next level and how vast the opportunities to solve social problems by Experience Research and Design <br /> <br />

          <h2 className="text-3xl">Design is not just what it looks like and feels like. Design is how it works. ~ Steve Job</h2> <br />

          <h2 className="text-2xl">What I Learned</h2>
          Learned how critical thinking is needed to create a user experience that is delightful yet usable for everyone
          <br />
          <br />

          <h2 className="text-2xl">Next Steps</h2>
          <ol className="list-decimal">
            <li>Can create the prototype of the different flows of the app</li>
            <li>Can conduct Usability Testing with actual customers</li>
            <li>Can test the dark mode of the app</li>
          </ol>



        </p>
      </>
    ),
    badge: "Takeaways",
    // images: ["https://cdn.sanity.io/images/loniby3f/production/be7a5e8eafff7351b0287a7ff69d59346e07a80e-7680x5584.png","https://cdn.sanity.io/images/loniby3f/production/464e330bd95793dd13f0cc6b8abac5828dc445a1-7680x5584.png"],
  },

];
