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

//Success Section Images
import Success01_Img from "@/app/Assets/Images/HonestCaseStudy/Success.png";

//Process Section Images
import Process01_Img from "@/app/Assets/Images/HonestCaseStudy/Process.png";

//Ideation Section Images
import Empathize01_Img from "@/app/Assets/Images/HonestCaseStudy/Empathize.png";
import ResearchInsights01_Img from "@/app/Assets/Images/HonestCaseStudy/ResearchGoals.png";
import EmapthyMapping_Img from "@/app/Assets/Images/HonestCaseStudy/Empathy Mapping.png";


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

              <div className="md:leading-normal md:text-sm lg:leading-loose lg:text-lg tracking-wide text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-inver">
                {item.images && item.images.map((image, imgIndex) => (
                  <Image
                    key={`image-${imgIndex}`}
                    src={image as string} // Type assertion
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
        <div ref={sidebarRef} className="flex flex-col items-start">
          <h2 className="text-slate-400 dark:text-slate-600 text-md uppercase font-bold mb-4">
            Content
          </h2>
          <ul className="space-y-4 w-48">
            {dummyContent.map((item, index) => (
              <li key={`sidebar-item-${index}`}>
                <a
                  href={`#content-${index}`}
                  className={`text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-white  ${activeSection === index ? "text-slate-900 dark:text-white" : ""
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
        <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparent">

          <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">Highlights of the UI of core consumer product</p>

          <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

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

        <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

          <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">Trust and Authencity thought resistance create anxiety and confusion which leads to frustrations to the customers</p>

          <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

        </blockquote>

      </>
    ),
    badge: "Problem",
    images: [ProblemImg,],


  },
  {
    title: "Some of the Hypothesis I formed before working on the problem",
    description: (
      <>

        <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

          <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">These are the points that are ficitional or non-ficitional to build this product</p>

          <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

        </blockquote>

      </>
    ),
    badge: "Hypothesis",
    images: [Hypothesis01_Img],

  },
  {
    title: "Some of the Constrains I Need to bear before designing the solution",
    description: (
      <>

        <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

          <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">Since this is my personal hobby project, there would be some technical and non-technical constrains that might happen :</p>

          <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

        </blockquote>

      </>
    ),
    badge: "Constrains",
    images: [Constrains01_img],

  },
  {
    title: "My Success Motivation/Mantra for this project",
    description: (
      <>

        <p>
          <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

            <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">Since this is my personal hobby project, there would be some technical and non-technical constrains that might happen</p>

            <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

          </blockquote>
        </p>

      </>
    ),
    badge: "Success",
    images: [Success01_Img],

  },
  {
    title: "My Process developed and followed in this project",
    description: (
      <>
        <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

          <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">The process I developed in-journey to figure out and gather insights from different activities</p>

          <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

        </blockquote>

      </>
    ),
    badge: "Process",
    images: [Process01_Img],

  },
  {
    title: "Enough with the document, let's deep diver into the work!",
    description: (
      <>
        <div className="Empathize">
          <h2 className="md:text-xl lg:text-3xl pb-4">Requirements & HMW's</h2>
          <Image src={Empathize01_Img} alt="" className="rounded-xl py-2"></Image>
          <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">
            <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">Upon receiving my prompt, I start to emphasize cognizant of its complexities. Therefore, I try to deconstruct the prompt into tangible subproblems, which I tackled by establishing research goals.</p>
            <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>
          </blockquote>
        </div>

        <br />

        <div className="ResearchGoalsAndInsights">
          <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Research Goals & Insights</h2>

          <hr className="h-px md:my-2 lg:my-4 bg-slate-200 border-0 dark:bg-slate-700" />


          <div className="ResearchHeader">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Research Overview</h2>

            <Image src={Empathize01_Img} alt="" className="rounded-xl py-2"></Image>
            <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

              <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">Upon receiving my prompt, I start to emphasize cognizant of its complexities. Therefore, I try to deconstruct the prompt into tangible subproblems, which I tackled by establishing research goals.</p>

              <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

            </blockquote>
          </div>

          <br />
          <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
          <br />

          <div className="ResearchGoals">

            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Research Goals</h2>
            <Image src={ResearchInsights01_Img} alt="" className="rounded-xl py-2"></Image>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 md:gap-x-4 lg:gap-x-8 md:my-2 lg:my-4">
              <p className="text-xl">Since the product was at a very early stage, I was interested in exploring opportunities in the online food order & delivery digital products.</p>
              <p className="text-xl">For the research I conducted is Primary Research through User Experience Interview & Surveys while keeping the research goals in mind.</p>
              <p className="text-xl">There is been plus and minuses which I received from the user which is valuable to develop the further product.
                I channelize the data into Research Insights</p>
            </div>
          </div>

          <br />
          <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
          <br />

          <div className="UXInterviewResearchInsights">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">UX Interview // Research Insights</h2>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 md:gap-x-4 lg:gap-x-8 md:mb-2 lg:mb-4">
              <p>
                Conducting User UX Interview at this particular early stage is valuable to validate the problem hypothesis as well as new problem opportunities to solve users are facing. <br />
              </p>
              <p>
                I channelize the valuable insights I receive from the User UX Interview into more visual and clear way by creating Empathy Mapping.

              </p>
            </div>

            <Image src={EmapthyMapping_Img} className="rounded-xl py-2" alt=""></Image>
            <p className="py-2">
              Empathy Mapping makes clear that people are facing trust issues with particular food provided by particular restaurant. <br />
              To further validate my problem hypothesis, i conducted UX User Survey to understand overall user's perspective over the food ordering online <br />
            </p>
          </div>

          <br />
          <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
          <br />

          <div className="UXSurveyInsights">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">UX Survey // Research Insights</h2>

            <p>To get more insights, I conducted to User Survey online using Google Forms to get more quantitative data to validate my hypothesis </p>

            <Image src="https://cdn.sanity.io/images/loniby3f/production/e1ac9753fe5b65587030803e8f6fe40d9832312c-3840x4850.png" width={3840} height={4850} className="rounded-xl py-2" alt=""></Image>

            <div className="grid md:grid-cols-1 lg:grid-cols-1 md:gap-x-4 lg:gap-x-8">
              <p>
                There is a total of 10 Participants from different working backgrounds who mostly order food online. <br />

                Here is the link to the <a href="https://drive.google.com/file/d/19eZQM4qxmQeemnCwhn1gotOf6koN81-x/view?usp=sharing" className="hover:text-slate-400">Full Survey Result Report</a>
              </p>
            </div>
          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="PainPoints">
          <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">UX Pain Points</h2>

          <div className="painPoint_Content flex flex-col gap-y-4">

            <p>From the User Research and Survey data it is easier now to conclude the pain points users are facing : <br /> </p>

            <div className="painPoint_Content--list grid grid-cols-2 gap-x-12 list-decimal">
              <li>Lack of Structure & Information - Users are not able to easily navigate in menu and doesn't able to find the images of food or name</li>
              <li>Image is not authentic - Users doesn't able to trust the specific food due to stock or fake images provided from the restaurants</li>
            </div>

            <p>After Defining the Pain Points of the users, it's time to craft the Fictional User Personas based on Research I have done to define goals and characteristics which will represent the needs of a larger group of possible users <br /> </p>
          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="Persona">
          <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Persona Hypothesis I Created</h2>

          <Image src="https://cdn.sanity.io/images/loniby3f/production/9b60ae14f4432bc5fcbb7441c4ec660ab0a69325-3840x2160.png" width={3840} height={4850} className="rounded-xl py-2" alt=""></Image>

          <div className="painPoint_Content--list grid grid-cols-2 gap-x-12 list-decimal">
            <p>It is important to channelize all of the data I received from Research into a singular person  persona to clarify user goals & frustrations with their background story </p>

            <p>To Empathize more with users I tried to create a User Story that will tell users a fictional story in one sentence from the Persona's Point of View based on Who, What, and Why.</p>
          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="UserJourney">

          <div className="UserJourney_Content">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">User Journey Mapping</h2>
            <p>Now it was pretty clear about the user needs through Persona, I started to visualize the User Journey Mapping.</p>

            <Image src="https://cdn.sanity.io/images/loniby3f/production/92ff8bccaf587e66197b0424a87846984af59a12-7680x6624.png" className="rounded-xl py-2" alt="" width={7680} height={6624}></Image>

            <div className="UserJourney_Content-list grid grid-cols-2 gap-x-12">
              <p>User Journey Mapping helps me to understand multiple aspects of users tasks performance and more importantly their emotional feelings and improvement opportunities for the product</p>

              <ul className="list-disc"> <b>Insights:</b>
                <li>User's total journey is divided into 8 phases</li>
                <li>Improvement Opportunity : Inclusion of Personalized, Transparecy , Informative & Trust into product</li>
              </ul>
            </div>
          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="problem">
          <div className="problem_content">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Problem Statement</h2>
            <p className="text-4xl text-slate-400 leading-normal">
              Sahil Rajput <i>is/an</i> software engineer <i>who</i> needs to order cuisines online with trusted representation of dishes <i>because</i> he want to be an explorer of new cuisines from multiple restaurants
            </p> <br />

            <p>Now, I understand what user pain points are and define a problem statement that covers a large group of targeted users
              It's time to do a Competitive Audit to understand what potential direct and indirect competitors doing for this particular problem</p>
          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="Audit ">
          <div className="audit_content">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Competitor Analysis</h2>

            <p>I have done the audit between 3 Companies i.e., Swiggy, Zomato, and Hello Green in which Swiggy and Zomato are Direct Competitors and Hello Green is Indirect Competitor.</p>

            <br />

            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Competitor Analysis Report</h2>

            <ul className="list-disc">After doing the extensive audit of each competitor, I create the Competitive Audit Report which summarizes the <br />
              <li>Competitive Audit Goals</li>
              <li>Who are the Key Competitors?</li>
              <li>What are the type and quality of competitor's products?</li>
              <li>How do competitors position themselves in the market?</li>
              <li>How do competitors talk about themselves?</li>
              <li>Competitors' strengths</li>
            </ul>

            <br />

            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Competitor Analysis Insights</h2>

            <p>Although there is an good product offerings by competitors but they lack in product vision execution.</p>

          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="goal">
          <div className="goal_content">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Goal Statement</h2>
            <p>It's time to finalize the problem statement and user pain points into the Final Statement as my Goal Statement</p>
            <br />
            <p className="text-4xl text-slate-400 leading-normal">
              Our HonestBites will let users order food with trust and transparency which will affect users like sahil who are explorer of different cuisines from different restuarants by satisfy there adventurous palate with their taste preferences. We will measure effectiveness by analyzing the consumer loyalty towards the platform
            </p> <br />
          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="storyboard">
          <div className="storyboard_content">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Storyboard</h2>

            <Image src="https://cdn.sanity.io/images/loniby3f/production/f882216c7db4b643e37bbda51ddda35fcc2d90cd-3840x2146.png" className="rounded-xl py-2" alt="" width={3840} height={2146}></Image>

            <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

              <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">I use storyboard to visualize and ideate the product scenario</p>

              <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

            </blockquote>

          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="IA">
          <div className="IA_content">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Information Architecture(IA) & User Flow</h2>

            <p> Now as I have clear in my mind about user & product scenario of pain points and opportunities , I have started to created the information architecture
              Information Architecture really helps me to create the structure of navigation & components I will use in the user-flow journey.</p>

            <Image src="https://cdn.sanity.io/images/loniby3f/production/ee5245efd2186017a857fe32e0587155c42b18bd-7680x21272.png" className="rounded-xl py-2" alt="" width={7680} height={21272}></Image>

            <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

              <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400"> You can preview the whole IA by <a href="https://www.figma.com/file/pIdmfbNQDwkJ8lJKyc7rX8/HonestBites---UX-Case-Study?type=design&node-id=274%3A1702&mode=design&t=zY0XaOncAy5QCPNh-1" className="hover:text-rgay-500">Click Here</a></p>

              <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

            </blockquote>

            After, <br />
            <ul className="list-disc">
              <li>Empathize with users about their needs and pain points</li>
              <li>Defining the Problem Statement and Goal Statement</li>
              <li>Ideating about the scenario using Crazy's 8 and Storyboards</li>
              <li>Developing the Information Architecture (IA)</li>
            </ul>
            <h3 className="text-3xl leading-loose"> It's time to start the designing process </h3>

          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="LowFi">
          <div className="LowFi_content">
            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Low Fiedility Wireframes</h2>

            <Image src="https://cdn.sanity.io/images/loniby3f/production/f99cdc857564e73130a68b616532bf0be6711977-2560x2180.png" className="rounded-xl py-2" alt="" width={2560} height={2180}></Image>

            <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

              <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400"> Creating Paper Wireframes really helps me to brainstorm ideas on how can particular component can be placed in content architecture.</p>

              <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

            </blockquote>

            <div className="grid grid-cols-2 gap-x-12">
              <div className="myGoals">
                <h3 className="text-3xl">My Goals</h3>
                <p>I tried to create 5 different Versions of a Single Page and Pick the Best Component I like from each of the different versions and create the final version.</p>
              </div>
              <div className="myThoughts">
                <h3 className="text-3xl">My Thoughts</h3>
                <p>Finding the best possible way to organize the content structure so that users can easily able to access and navigate through pages.</p>
              </div>
            </div>

          </div>
        </div>

        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />

        <div className="DesignSystem">
          <div className="DesignSystem_content">

            <h2 className="md:text-xl lg:text-3xl md:leading-relaxed lg:leading-loose">Design System</h2>
            <p>Once my wireframes are finalized, i started to create the mini design system for my project, started with the basics of defining the fundamentals such as color pallete, typography, iconography & basic components.</p>

            <Image src="https://cdn.sanity.io/images/loniby3f/production/3129006f755af3adbea887bbd0e5932235683c2e-11264x7008.png" alt="" height={11264} width={7008} className="rounded-xl py-2"></Image>

            <blockquote className="flex flex-row justify-between items-center p-2 my-4 border-s-4 border-slate-300 dark:border-gray-500 dark:bg-transparentt">

              <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400"> Aim is to build the foundation first, so future designed elements can be easily added and documented</p>

              <p className='inline-block font-mono font-bold px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 uppercase tracking-wide text-slate-400 dark:text-slate-500 text-lg'>Image</p>

            </blockquote>
          </div>
        </div>
      </>
    ),
    badge: "Ideation",
    // images: [HonestThumbnail],

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
    badge: "Mockups",
    images: ["https://cdn.sanity.io/images/loniby3f/production/ada757caa300eb4e4b1e68c4cee7e131cf107143-7680x4320.png", "https://cdn.sanity.io/images/loniby3f/production/96c93f42fe991f9999f3a0da16c95c606b20f84a-7680x4320.png", "https://cdn.sanity.io/images/loniby3f/production/d78e0685021b799e2ac2b0ed1c42e3e24aa8da7c-7680x4320.png"],
  },

  {
    title: "Insights & Findings",
    description: (
      <>
        <p>Attention Insights data is helpful for giving constructive feedback which improves overall visuals of the design of the product</p>
      </>
    ),
    badge: "User Testing",
    images: ["https://cdn.sanity.io/images/loniby3f/production/be7a5e8eafff7351b0287a7ff69d59346e07a80e-7680x5584.png", "https://cdn.sanity.io/images/loniby3f/production/464e330bd95793dd13f0cc6b8abac5828dc445a1-7680x5584.png"],
  },

  {
    title: "Impact Metrics",
    description: (
      <>

        This project really impacts me as an individual because it really helps me understand how critical is UX for any business to grow on the next level and how vast the opportunities to solve social problems by Experience Research and Design <br /> <br />

        <h2 className="text-3xl">Design is not just what it looks like and feels like. Design is how it works. ~ Steve Job</h2>

      </>
    ),
    badge: "Outcome",
    // images: [HonestThumbnail],

  },
  {
    title: "What I Learned",
    description: (
      <>
        Learned how critical thinking is needed to create a user experience that is delightful yet usable for everyone.

      </>
    ),
    badge: "Key Learnings",
    // images: [HonestThumbnail],

  },

  {
    title: "Next Steps",
    description: (
      <>
          <ol className="list-decimal">
            <li>Can create the prototype of the different flows of the app</li>
            <li>Can conduct Usability Testing with actual customers</li>
            <li>Can test the dark mode of the app</li>
          </ol>
      </>
    ),
    badge: "Takeaways",
  },
];
