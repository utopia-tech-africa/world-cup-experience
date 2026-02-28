import Link from "next/link";
import { Facebook, Instagram, Youtube, LucideIcon } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerData: FooterSection[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Fixtures & Results", href: "#" },
      { label: "Clubs", href: "#" },
      { label: "News", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { label: "Facebook", href: "#", icon: Facebook },
      { label: "Instagram", href: "#", icon: Instagram },
      { label: "Youtube", href: "#", icon: Youtube },
    ],
  },
];

export function FooterLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
      {footerData.map((section) => (
        <div key={section.title} className="flex flex-col gap-6">
          <h3 className="text-[18px] font-semibold font-sans uppercase tracking-wider">
            {section.title}
          </h3>
          <div className="flex flex-col gap-4">
            {section.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 text-[16px] opacity-70 hover:opacity-100 transition-opacity font-sans`}
              >
                {link.icon && <link.icon size={20} />}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
