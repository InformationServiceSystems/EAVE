export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Page 1",
      href: "/docs",
    },
    {
      label: "Page 2",
      href: "/pricing",
    },
    {
      label: "Page 3",
      href: "/blog",
    },
  ],
  navMenuItems: [
    {
      label: "Page 1",
      href: "/docs",
    },
    {
      label: "Page 2",
      href: "/pricing",
    },
    {
      label: "Page 3",
      href: "/blog",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
