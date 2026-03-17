import * as React from "react";
import { Section, Heading, Text } from "@react-email/components";
import { BaseLayout } from "./BaseLayout";

interface SubmissionEmailProps {
  firstName: string;
  bookingReference: string;
}

export const SubmissionEmail = ({
  firstName,
  bookingReference,
}: SubmissionEmailProps) => {
  return (
    <BaseLayout previewText="Your World Cup booking request has been received.">
      <Section className="px-[32px] pt-[0px] pb-[40px] text-center">
        <Heading className="text-[#1e3a8a] text-[32px] leading-[1.2em] font-display mb-[24px] font-bold">
          You're almost ready to take off!
        </Heading>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          Hi {firstName},
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          Thank you for booking your World Cup Hosting Package with us! ⚽
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          We've successfully received your booking request and our team is
          currently reviewing the information and verifying your payment
          details. This process helps us ensure everything is accurate so your
          experience goes smoothly.
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[24px] text-left">
          Once verification is complete, you'll receive another email confirming
          your booking along with your full package details.
        </Text>

        <Text className="text-slate-800 text-[15px] leading-[24px] mb-[24px] text-left font-semibold">
          Here is your booking reference number:{" "}
          <span className="text-slate-500 font-normal">{bookingReference}</span>
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[20px] text-left">
          If you have any questions in the meantime, feel free to reply to this
          email and our team will be happy to assist.
        </Text>

        <Text className="text-slate-600 text-[15px] leading-[24px] mb-[24px] text-left">
          Get ready for an unforgettable World Cup experience!
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

export default SubmissionEmail;
