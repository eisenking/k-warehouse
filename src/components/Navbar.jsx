"use client";
import { LayoutGrid, Menu, Search, Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "./ui/button";

export const navigationItems = [
  {
    title: "Traffic Light",
    href: "/traffic-light",
    items: [],
  },
  {
    title: "Snake Game",
    href: "/snake-game",
    items: [],
  },
  {
    title: "Memory Game",
    href: "/memory-game",
    items: [],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="w-full max-w-7xl flex flex-col items-center rounded-full bg-background/20 backdrop-blur-lg md:rounded-full"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Логотип"
              width={80}
              height={80}
            />
          </Link>

          <div className="hidden gap-4 md:flex">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <Button variant="ghost" size="icon">
            <Sun className="size-4" />
        </Button>

        {/* <div className="hidden md:block">
          <Button variant="ghost" size="icon">
            <LayoutGrid className="size-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="size-4" />
          </Button>
        </div> */}

        <div className="md:hidden">
          <Button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-3 md:hidden">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}