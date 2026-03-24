import { Check, X } from "lucide-react";
import { INCLUSIONS_EXCLUSIONS_DATA } from "../data/packages-data";

export default function InclusionsExclusions() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-[30px] md:text-[30px] lg:text-[40px] font-medium text-[#2A2A2A] font-clash">
            Inclusions and Exclusions
          </h2>
          <p className="text-sm md:text-lg lg:text-[20px] font-normal text-[#2A2A2A] font-helvetica">
            Uncover the perks and limitations of each Altair package.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-6.75">
          {/* inclusions */}
          <div
            className="flex-1 border p-6"
            style={{
              borderColor: "#A0C63E",
              boxShadow: "0px 0px 10px 2px #71A34F26",
            }}
          >
            <div className="mb-6">
              <h3 className="text-xl md:text-[28px] text-[#386D13] lg:text-[32px] font-semibold font-clash">
                Package Inclusions
              </h3>
              <div
                className="w-full mt-3"
                style={{ borderBottom: "1px solid #00000045" }}
              />
            </div>

            <div className="flex flex-col gap-4.25">
              {INCLUSIONS_EXCLUSIONS_DATA.inclusions.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div
                      className="w-4.5 h-4.5 flex items-center justify-center"
                      style={{ backgroundColor: "#386D13" }}
                    >
                      <Check size={14} color="#FFFFFF" />
                    </div>
                  </div>
                  <p className="text-[#2A2A2A] font-helvetica font-medium text-sm md:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* exclusions */}
          <div
            className="flex-1 border p-6"
            style={{
              borderColor: "#FF3401D9",
              boxShadow: "0px 0px 10px 3px #FF340126",
            }}
          >
            <div className="mb-6">
              <h3 className="text-xl md:text-[28px] lg:text-[32px] text-[#FF3401] font-semibold font-clash">
                Package Exclusions
              </h3>
              <div
                className="w-full mt-3"
                style={{ borderBottom: "1px solid #00000045" }}
              />
            </div>

            <div className="flex flex-col gap-4.25">
              {INCLUSIONS_EXCLUSIONS_DATA.exclusions.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div
                      className="w-4.5 h-4.5 flex items-center justify-center"
                      style={{ backgroundColor: "#FF3401" }}
                    >
                      <X size={14} color="#FFFFFF" />
                    </div>
                  </div>
                  <p className="text-[#2A2A2A] font-medium text-sm md:text-base font-helvetica">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
