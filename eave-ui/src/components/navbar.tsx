import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import escadeLogo from "/images/escade-logo.png";
import dfkiLogo from "/images/DFKI-Logo_ohne_RGB_weiss.svg";
import bmwkLogo from "/images/bmwk-logo.png";

export const Navbar = () => {
  return (
    <HeroUINavbar
      maxWidth="2xl"
      position="sticky"
      className="border-b border-gray-200 bg-black"
      height={100}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
      <NavbarBrand className="gap-3 max-w-fit">
        <Link
        className="flex justify-start items-center gap-1"
        color="foreground"
        href="/"
        >
        <img src={escadeLogo} alt="Project Logo" className="h-20 w-auto" />
        <p className="font-bold text-xl text-white text-inherit">
          EAVE - Energy Analytics for Cost-Effective & Sustainable
          Operations
        </p>
        </Link>
      </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <Link
          href="https://forms.office.com/e/A99vxUWW8v"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-white bg-gray-800 border border-gray-200 rounded-lg hover:bg-gray-700"
        >
          Contact Us
        </Link>
        <img src={bmwkLogo} alt="BMWK Logo" className="h-24 w-auto" />
        <img src={dfkiLogo} alt="DFKI Logo" className="h-24 w-auto" />
      </NavbarContent>
    </HeroUINavbar>
  );
};
