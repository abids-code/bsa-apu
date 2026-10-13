import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Facebook, Instagram, Menu, Youtube, X } from "lucide-react";
import logo from "@/assets/bsa-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/news", label: "News" },
  { to: "/gallery", label: "Gallery" },
  { to: "/bdweek", label: "BD Week" },
  { to: "/bfl", label: "BFL" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="BSA logo" className="h-10 w-10 object-contain" />
          <span className="font-display text-2xl leading-none text-primary">
            BSA <span className="text-foreground">APU</span>
          </span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/join"
          className="hidden rounded-sm bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground md:inline-block"
        >
          Join us
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-5 py-3 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-2 font-semibold uppercase tracking-wider"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo} alt="BSA logo" className="h-16 w-16 object-contain brightness-0 invert" />
          <p className="mt-4 text-sm leading-6 text-ink-foreground/65">
            Bangladesh Student Association at Ritsumeikan Asia Pacific University, Beppu, Oita,
            Japan.
          </p>
          <a className="mt-3 block text-sm hover:text-primary" href="mailto:apu.bsa@gmail.com">
            apu.bsa@gmail.com
          </a>
          <div className="mt-5 flex items-center gap-3">
            <SocialLink
              href="https://www.facebook.com/profile.php?id=61576153811604"
              label="BSA Facebook"
            >
              <Facebook />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/apu.bsa/" label="BSA Instagram">
              <Instagram />
            </SocialLink>
            <SocialLink href="https://www.youtube.com/@bangladeshweekapu" label="BD Week YouTube">
              <Youtube />
            </SocialLink>
          </div>
        </div>
        <FooterColumn title="Explore">
          <Link to="/about">About BSA</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/bdweek">BD Week</Link>
          <Link to="/bfl">BFL</Link>
        </FooterColumn>
        <FooterColumn title="Get involved">
          <Link to="/events">Events</Link>
          <Link to="/news">News</Link>
          <Link to="/join">Join BSA</Link>
          <Link to="/contact">Contact us</Link>
        </FooterColumn>
        <FooterColumn title="Visit APU">
          <a href="https://en.apu.ac.jp/" target="_blank" rel="noreferrer">
            Official APU website
          </a>
          <p className="text-ink-foreground/60">1-1 Jumonjibaru, Beppu, Oita 874-8577</p>
          <Link
            to="/join"
            className="mt-3 inline-flex w-fit rounded-sm bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Become a member
          </Link>
        </FooterColumn>
      </div>
      <p className="mx-auto max-w-6xl border-t border-ink-foreground/10 px-5 py-5 text-center text-xs text-ink-foreground/50">
        ©Bangladesh Student Association at APU. Developed by ABID.
      </p>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 text-sm text-ink-foreground/70">
      <p className="mb-2 font-semibold uppercase tracking-wider text-ink-foreground">{title}</p>
      {children}
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="rounded-full border border-ink-foreground/20 p-2 transition-colors hover:border-primary hover:text-primary"
    >
      {children}
    </a>
  );
}

export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b bg-muted">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <p className="fade-up text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          {kicker}
        </p>
        <h1 className="fade-up mt-3 text-6xl md:text-8xl">{title}</h1>
        {intro && <p className="fade-up mt-5 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
      </div>
    </section>
  );
}
