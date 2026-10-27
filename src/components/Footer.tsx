import Logo from "./Logo";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "AI Assistant", href: "#ai-assistant" },
    { label: "Insights", href: "#insights" },
  ],
  Company: [
    { label: "About", href: "#top" },
    { label: "Contact", href: "#top" },
    { label: "FAQ", href: "#faq" },
  ],
};

export default async function Footer() {
  "use cache";
  // Prerendered and cached: the copyright year is baked in at build time
  // rather than read per request.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-5 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <a
            href="#top"
            className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            aria-label="JatJeng home"
          >
            <Logo />
          </a>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Plan. Coordinate. Deliver.
          </p>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <p className="text-sm font-semibold">{title}</p>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <p className="mx-auto mt-14 max-w-7xl text-xs text-muted-foreground">
        © {year} JatJeng. All rights reserved.
      </p>
    </footer>
  );
}
