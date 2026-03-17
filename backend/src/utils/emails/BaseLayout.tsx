import * as React from "react";

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
  Row,
  Column,
  Preview,
  Tailwind,
  Font,
} from "@react-email/components";

interface BaseLayoutProps {
  previewText?: string;
  children: React.ReactNode;
}

export const BaseLayout = ({ previewText, children }: BaseLayoutProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Outfit"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_LVrxPNw70lbWh09DHVD6S_U6vX8W5_A-U.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Syne"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com",
            format: "woff2",
          }}
          fontWeight={800} // Use 700 or 800 for that "Clash" look
          fontStyle="normal"
        />
        <style>
          {`
            @media (max-width: 600px) {
              .mobile-h1 {
                font-size: 24px !important;
                line-height: 1.2em !important;
              }
              .mobile-text {
                font-size: 13px !important;
                line-height: 20px !important;
              }
            }
          `}
        </style>
      </Head>
      {previewText && <Preview>{previewText}</Preview>}
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#1e3a8a",
                slate: {
                  500: "#64748b",
                  600: "#475569",
                  800: "#1e293b",
                  900: "#0f172a",
                },
              },
              fontFamily: {
                sans: ["Outfit", "sans-serif"],
                display: ["Syne", "sans-serif"], // Replace "Cal Sans" with "Syne"
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-3xl my-[40px] mx-auto p-0 max-w-[700px] overflow-hidden">
            <Section className="m-0 p-0">
              <Img
                src="https://res.cloudinary.com/dan9camhs/image/upload/v1773677776/e0b39b5f-a57c-4c76-b7f3-b646bdfe6260.webp"
                alt="World Cup Experience"
                width="100%"
                height="auto"
                className="block align-middle rounded-t-[22px]"
              />
            </Section>

            <Section className="px-[30px]">{children}</Section>

            <Section className="px-[30px]  pb-[20px] text-center">
              <Text className="text-[#777777] text-[18px] font-display mb-[3px] mobile-text">
                Follow us
              </Text>
              <Section
                style={{
                  height: "3px",
                  width: "100%",
                  background:
                    "linear-gradient(to right, transparent, gray, transparent)",
                }}
                className="my-0 mx-auto"
              />

              <Section className="pt-[10px]">
                <Row align="center" className="w-fit mx-auto">
                  <Column className="px-[16px]">
                    <Link href="tel:+1234567890">
                      <Img
                        src="https://img.icons8.com/ios/48/777777/phone.png"
                        width="24"
                        height="24"
                        alt="Phone"
                        className="block"
                      />
                    </Link>
                  </Column>
                  <Column className="px-[16px]">
                    <Link>
                      <Img
                        src="https://img.icons8.com/ios/48/777777/instagram-new.png"
                        width="24"
                        height="24"
                        alt="Instagram"
                        className="block"
                      />
                    </Link>
                  </Column>
                  <Column className="px-[16px]">
                    <Link>
                      <Img
                        src="https://img.icons8.com/ios/48/777777/twitterx.png"
                        width="24"
                        height="24"
                        alt="X"
                        className="block"
                      />
                    </Link>
                  </Column>
                  <Column className="px-[16px]">
                    <Link>
                      <Img
                        src="https://img.icons8.com/ios/48/777777/youtube-play.png"
                        width="24"
                        height="24"
                        alt="YouTube"
                        className="block"
                      />
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

BaseLayout.PreviewProps = {
  previewText: "Your World Cup booking request has been received.",
  children: <Text>Hello</Text>,
} as BaseLayoutProps;

export default BaseLayout;
