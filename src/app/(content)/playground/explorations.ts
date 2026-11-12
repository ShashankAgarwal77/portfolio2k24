/* The Playground's registry. Add an entry here (and its route under
   /playground/<slug>) and it shows up on the index. */
export type Exploration = {
  slug: string;
  number: string;
  title: string;
  blurb: string;
  tags: string[];
  date: string;
};

export const explorations: Exploration[] = [
  {
    slug: "starry-night",
    number: "01",
    title: "Starry Night, in ASCII",
    blurb:
      "Van Gogh’s sky as a flow field, set in type. Stir the currents, swap the glyphs, export the frame.",
    tags: ["Canvas", "Generative", "Typography"],
    date: "Oct 2026",
  },
  {
    slug: "solace-in-chaos",
    number: "02",
    title: "Solace, in chaos",
    blurb:
      "An evening walk home through the city, in ASCII. The noise is everywhere; the headphones carry the calm.",
    tags: ["WebGL", "ASCII", "Character"],
    date: "Nov 2026",
  },
];
