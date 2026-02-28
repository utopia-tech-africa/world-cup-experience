"use client";

import { useState } from "react";
import {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingForm() {
  const [tripType, setTripType] = useState("single");

  return (
    <>
      {/* Label Container */}
      <div className="bg-primary-400 px-6 py-3 flex items-center gap-2 w-fit rounded-tl-2xl text-neutral-100 border relative z-10 -mb-px">
        <Plane size={14} className="fill-neutral-100" />
        <span className="text-[14px] font-semibold font-sans">Flights</span>
      </div>

      <div className="p-3 space-y-3 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.2)] rounded-2xl rounded-tl-none relative z-0">
        {/* Radio Buttons Container */}
        <div className="flex gap-6 ">
          <label
            className={`flex items-center gap-2 cursor-pointer group py-2 px-3 rounded-full transition-all ${
              tripType === "single" ? "bg-primary-100" : ""
            }`}
            onClick={() => setTripType("single")}
          >
            <input
              type="radio"
              name="tripType"
              checked={tripType === "single"}
              onChange={() => setTripType("single")}
              className="w-4 h-4 accent-primary-400 cursor-pointer"
            />
            <span
              className={`text-[14px] font-normal font-sans transition-colors ${
                tripType === "single" ? "text-primary-400" : "text-neutral-200"
              }`}
            >
              Single game
            </span>
          </label>
          <label
            className={`flex items-center gap-2 cursor-pointer group py-2 px-3 rounded-full transition-all ${
              tripType === "double" ? "bg-primary-100" : ""
            }`}
            onClick={() => setTripType("double")}
          >
            <input
              type="radio"
              name="tripType"
              checked={tripType === "double"}
              onChange={() => setTripType("double")}
              className="w-4 h-4 accent-primary-400 cursor-pointer"
            />
            <span
              className={`text-[14px] font-normal font-sans transition-colors ${
                tripType === "double" ? "text-primary-400" : "text-neutral-200"
              }`}
            >
              Double game
            </span>
          </label>
        </div>

        {/* Travel Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-4">
          {/* From Item */}
          <div className="flex items-center px-3 py-3 border-2 border-gray-200 rounded-full hover:border-primary-100 transition-colors md:max-w-[300px] lg:max-w-none lg:flex-1 w-full">
            <div className=" flex items-center gap-1.5 font-sans">
              <span className="font-normal leading-tight flex items-center gap-1 text-neutral-200">
                <PlaneTakeoff size={20} className="text-gray-400 shrink-0" />
                From:
              </span>
              <span className="font-bold text-neutral-400 text-[16px]">
                Accra
              </span>
            </div>
          </div>

          {/* To Item */}
          <div className="flex items-center px-3 py-3 border-2 border-gray-200 rounded-full hover:border-primary-100 transition-colors md:max-w-[300px] lg:max-w-none lg:flex-1 w-full">
            <div className=" flex items-center gap-1.5 font-sans">
              <span className="font-normal leading-tight flex items-center gap-1 text-neutral-200">
                <PlaneLanding size={20} className="text-gray-400 shrink-0" />
                To:
              </span>
              <span className="font-bold text-neutral-400 text-[16px]">
                USA
              </span>
            </div>
          </div>

          {/* Date Item */}
          <div className="flex items-center gap-2 px-3 py-3 border-2 border-gray-200 rounded-full hover:border-primary-100 transition-colors md:max-w-[300px] lg:max-w-none lg:w-fit w-full">
            <CalendarDays size={20} className="text-gray-400 shrink-0" />
            <div className="flex items-center font-sans gap-2">
              <span className="text-[16px] font-bold text-neutral-400 leading-tight">
                {tripType === "single" ? "Aug 27" : "Nov 27"}
              </span>
              <ArrowRight size={16} className="text-neutral-500 " />
              <span className="text-[16px] font-bold text-neutral-400 leading-tight">
                {tripType === "single" ? "Sep 27" : "Dec 27"}
              </span>
            </div>
          </div>

          {/* Book Seat Button */}
          <Button className="w-full md:w-fit bg-primary-400 text-neutral-100 rounded-full py-6 px-8 text-[16px] font-semibold hover:bg-primary-300 transition-colors shadow-md shadow-primary-100 lg:ml-auto">
            Book Seat
          </Button>
        </div>
      </div>
    </>
  );
}
