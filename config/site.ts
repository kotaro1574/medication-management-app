export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Patients",
      href: "/patients",
    },
    {
      title: "Recognition",
      href: "/recognition",
    },
    {
      title: "OCR",
      href: "/ocr",
    },
  ],
}
