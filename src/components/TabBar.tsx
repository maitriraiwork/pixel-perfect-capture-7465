import { Link } from "@tanstack/react-router";

const tabs = [
  { to: "/", label: "Check-In" },
  { to: "/talk", label: "Talk" },
  { to: "/support", label: "Support" },
] as const;

export function TabBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <span className="font-serif text-lg text-foreground">MamaCare</span>
        <nav className="flex items-center gap-1 rounded-full bg-muted p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.to === "/" }}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors"
              activeProps={{ className: "bg-primary text-primary-foreground shadow-sm" }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
