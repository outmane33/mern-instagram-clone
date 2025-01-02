import React from "react";
import Posts from "./Posts";

export default function Feed() {
  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[0px] md:pl-[20%]">
      <Posts />
    </div>
  );
}