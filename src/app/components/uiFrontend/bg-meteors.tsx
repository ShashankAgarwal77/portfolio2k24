import React from "react";
import { Meteors } from "../Animations/meteors";

export function MeteorsDemo() {
  return (
    <div className="">
      <div className=" w-full relative z-[-10]">

      <Meteors number={10} />

      </div>
    </div>
  );
}
