"use client";

import { Logo } from "./Logo";

/**
 * The top of the page: the logo, centred, and nothing else.
 *
 * No bar, no border, no sticky strip — the logo sits directly on the page
 * background, so the artwork is the whole masthead.
 */
export function Nav() {
  return (
    <header className="flex justify-center px-5 pt-8 sm:px-8">
      <Logo size={120} maxWidth={540} />
    </header>
  );
}
