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
      <Section className="text-center">
        <Heading className="text-[#1e3a8a] text-[32px] font-bold leading-[1.2em] font-syne mb-[24px] mobile-h1">
          You're Cleared for Takeoff!
        </Heading>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[20px] text-left mobile-text">
          Hi {firstName},
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[24px] text-left mobile-text">
          Great news! Your World Cup Hosting Package has been successfully
          verified and confirmed. 🎉
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] font-bold text-left mb-[12px] m-0 mobile-text">
          Here are your booking details:
        </Text>
        <Text className="text-[#1A1A1A] text-[14px] leading-[24px] text-left m-0 mobile-text">
          Booking ID: [{bookingReference}] <br />
          Departure Date: [Departure Date] <br />
          Arrival Date: [Arrival Date] <br />
          Package: [{packageLabel}]
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] font-bold text-left -mb-[12px] mobile-text">
          Your Package Includes:
        </Text>
        <ul className="text-[#1A1A1A] text-[14px] text-left list-disc pl-[20px] mb-[24px] mobile-text">
          <li className=" leading-[24px]">
            Access to selected World Cup matches
          </li>
          <li className=" leading-[24px]">
            Accommodation and hosting experience
          </li>
          <li className=" leading-[24px]">
            Exclusive fan activities and experiences
          </li>
          <li className=" leading-[24px]">
            Additional package benefits as outlined during booking
          </li>
        </ul>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] mb-[24px] text-left mobile-text">
          Our team will continue to keep you updated as your travel and match
          dates approach. We're excited to have you join us for an incredible
          football experience!
        </Text>

        <Text className="text-[#1A1A1A] text-[15px] leading-[24px] m-0 text-left mobile-text">
          Best regards,
          <br />
          <strong className="text-[#1A1A1A] font-bold">The Altair Team</strong>
        </Text>
      </Section>
    </BaseLayout>
  );
};

ConfirmationEmail.PreviewProps = {
  firstName: "Ebenezer",
  bookingReference: "WC-2026-CONF",
  packageLabel: "Triple Game Package",
} as ConfirmationEmailProps;

export default ConfirmationEmail;
