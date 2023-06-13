import React from "react";
import { Link, Outlet } from "react-router-dom";

function Anonymous() {
  return (
    <div className="">
      <div className="h-90v bg-bg-image bg-fixed bg-cover flex flex-col justify-center items-center bg-left-bottom">
        <h1 className="font-semibold text-5xl mb-5 text-white">
          Housing<span className="text-sky-500">.com</span>
        </h1>
        <Link
          to="/properties"
          className="text-white px-5 py-3 font-medium rounded-lg border border-sky-500 bg-sky-500 text-xl hover:bg-white hover:text-sky-500 transition"
        >
          Check our listings
        </Link>
      </div>

      <div className="max-w-5xl mx-auto py-5">
        <h1 className="font-semibold text-4xl mb-5">
          Discover how we can help
        </h1>
        <div className="grid gap-8 grid-cols-3">
          <div className="px-4 py-5 border rounded-lg">
            <h1 className="font-semibold text-2xl mb-2">
              Find out how much you can afford
            </h1>
            We'll help you estimate your budget range
          </div>
          <div className="px-4 py-5 border rounded-lg">
            <h1 className="font-semibold text-2xl mb-2">
              Well help you estimate your budget range
            </h1>
            Get an in-depth look at vour monthlv and closing costs
          </div>
          <div className="px-4 py-5 border rounded-lg">
            <h1 className="font-semibold text-2xl mb-2">
              Find out how much you can afford
            </h1>
            We'll help you estimate your budget range
          </div>
        </div>
      </div>
    </div>
  );
}

export default Anonymous;
