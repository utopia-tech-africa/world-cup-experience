import React from "react";
import { HotPackagesToggle } from "@/components/hot-packages-toggle";
import { ContactToggle } from "@/components/contact";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div>{children}</div>
      <HotPackagesToggle />
      <ContactToggle />
    </>
  );
};

export default UserLayout;
