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
          fontFamily="Cal Sans"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/calsans/v1/some-url.woff2", // Note: Cal Sans isn't on Google Fonts, usually self-hosted or provided via CDN. User said "Cal Sans".
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
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
                display: ["Cal Sans", "sans-serif"],
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-3xl my-[40px] mx-auto p-0 w-[465px] overflow-hidden">
            <Section className="m-0 p-0">
              <Img
                src="https://res.cloudinary.com/dan9camhs/image/upload/v1773677776/e0b39b5f-a57c-4c76-b7f3-b646bdfe6260.webp"
                alt="World Cup Experience"
                width="465"
                height="auto"
                className="block align-middle rounded-t-[22px]"
              />
            </Section>

            <Section className="px-[30px] pt-[32px] pb-[10px]">
              {children}
            </Section>

            <Section className="px-[30px] py-[40px] text-center">
              <Text className="text-slate-800 text-[16px] font-display mb-[16px]">
                Follow us
              </Text>
              <Hr className="border-[#f1f5f9] border-t-3 my-0 mx-auto w-full" />

              <Section className="pt-[24px]">
                <Row align="center" className="w-fit mx-auto">
                  <Column className="px-[16px]">
                    <Link href="#">
                      <Img
                        src="https://img.icons8.com/ios-glyphs/60/64748b/phone.png"
                        width="22"
                        height="22"
                        alt="Phone"
                        className="opacity-70"
                      />
                    </Link>
                  </Column>
                  <Column className="px-[16px]">
                    <Link href="#">
                      <Img
                        src="https://img.icons8.com/ios-glyphs/60/64748b/instagram-new.png"
                        width="22"
                        height="22"
                        alt="Instagram"
                        className="opacity-70"
                      />
                    </Link>
                  </Column>
                  <Column className="px-[16px]">
                    <Link href="#">
                      <Img
                        src="https://img.icons8.com/ios-glyphs/60/64748b/twitterx.png"
                        width="22"
                        height="22"
                        alt="X"
                        className="opacity-70"
                      />
                    </Link>
                  </Column>
                  <Column className="px-[16px]">
                    <Link href="#">
                      <Img
                        src="https://img.icons8.com/ios-glyphs/60/64748b/youtube-play--v1.png"
                        width="22"
                        height="22"
                        alt="YouTube"
                        className="opacity-70"
                      />
                    </Link>
                  </Column>
                </Row>
              </Section>

              <Text className="text-[#94a3b8] text-[11px] mt-[32px] leading-[24px]">
                © {new Date().getFullYear()} Altair Team. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
