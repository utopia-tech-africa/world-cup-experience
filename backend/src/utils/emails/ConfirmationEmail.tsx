import * as React from "react";
import {
  Section,
  Heading,
  Text,
  Row,
  Column,
  Hr,
  Img,
} from "@react-email/components";
import { BaseLayout } from "./BaseLayout";

interface ConfirmationEmailProps {
  firstName: string;
  bookingReference: string;
  packageLabel: string;
}

export const ConfirmationEmail = ({
  firstName,
  bookingReference,
  packageLabel,
}: ConfirmationEmailProps) => {
  return (
    <BaseLayout previewText="Your World Cup booking is confirmed!">
      <Section className="px-[32px] pt-[0px] pb-[40px] text-center">
        <Heading className="text-[#1e3a8a] text-[32px] font-bold leading-[1.2em] font-display mb-[24px]">
          You're Cleared for Takeoff!
        </Heading>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          Hi {firstName},
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[24px] text-left">
          Great news! Your World Cup Hosting Package has been successfully
          verified and confirmed. 🎉
        </Text>

        <Section className="bg-[#f8fafc] border border-solid border-[#f1f5f9] rounded-lg p-[24px] mb-[24px]">
          <Text className="text-slate-800 text-[15px] leading-[24px] font-bold text-left mb-[12px] m-0">
            Here are your booking details:
          </Text>
          <Text className="text-slate-600 text-[14px] leading-[24px] text-left m-0">
            Booking ID: [{bookingReference}]
          </Text>
          <Text className="text-slate-600 text-[14px] leading-[24px] text-left m-0">
            Departure Date: [Departure Date]
          </Text>
          <Text className="text-slate-600 text-[14px] leading-[24px] text-left m-0">
            Arrival Date: [Arrival Date]
          </Text>
          <Text className="text-slate-600 text-[14px] leading-[24px] text-left m-0">
            Package: [{packageLabel}]
          </Text>
        </Section>

        <Text className="text-slate-800 text-[15px] leading-[24px] font-bold text-left mb-[12px]">
          Your Package Includes:
        </Text>
        <ul className="text-slate-600 text-[14px] leading-[24px] text-left list-disc pl-[20px] mb-[24px]">
          <li className="mb-[8px]">Access to selected World Cup matches</li>
          <li className="mb-[8px]">Accommodation and hosting experience</li>
          <li className="mb-[8px]">Exclusive fan activities and experiences</li>
          <li className="mb-[8px]">
            Additional package benefits as outlined during booking
          </li>
        </ul>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[24px] text-left">
          Our team will continue to keep you updated as your travel and match
          dates approach. We're excited to have you join us for an incredible
          football experience!
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] m-0 text-left">
          Best regards,
          <br />
          <strong className="text-slate-800 font-bold">The Altair Team</strong>
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default ConfirmationEmail;
