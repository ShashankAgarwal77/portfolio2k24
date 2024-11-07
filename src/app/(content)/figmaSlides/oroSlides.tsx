// components/FigmaEmbed.tsx
import React from 'react';

const FigmaEmbedOro: React.FC = () => {
  return (
    <div className='w-full h-full rounded-md overflow-hidden '
      dangerouslySetInnerHTML={{
        __html: `<iframe style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius:inherit;" width="100%" height="100%" src="https://embed.figma.com/proto/pfd6MQguGv2xmtPQ28XJoC/%F0%9F%92%BB-Portfolio-Presentation?page-id=317%3A157&node-id=328-3481&node-type=frame&viewport=1257%2C481%2C0.39&scaling=contain&content-scaling=fixed&embed-host=share&footer=false&theme=system&client-id=muds0emC09G4KReBWgDnIe" allowfullscreen></iframe>`,
      }}
    />
  );
};

// <iframe style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius:inherit;" width="100%" height="100%" src="https://embed.figma.com/deck/6p8Q1ccyFQpDu6KoR4XxTS/Simplifying-gig-work-in-logistics-presentation?node-id=1-618&node-type=canvas&viewport=-1876%2C-2574%2C0.54&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share&footer=false&theme=system&client-id=muds0emC09G4KReBWgDnIe" allowfullscreen></iframe

// <iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/pfd6MQguGv2xmtPQ28XJoC/%F0%9F%92%BB-Portfolio-Presentation?page-id=317%3A157&node-id=328-3481&node-type=frame&viewport=1257%2C481%2C0.39&scaling=contain&content-scaling=fixed&embed-host=share" allowfullscreen></iframe>

export default FigmaEmbedOro;