import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  CaretDownIcon,
  HomeIcon,
  BarChartIcon,
  LayersIcon,
} from "@radix-ui/react-icons";

const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex min-h-screen flex-col bg-primary p-24">
      <div className="flex-shrink-0 p-4">
        <Link href="/">
          <Image src="/logo.svg" alt="Brand Logo" height={200} width={200} />
        </Link>
      </div>
      <div className="flex flex-grow flex-col p-4 text-4xl">
        <Link
          href="/"
          className={cn(
            "transition-colors",
            pathname === "/"
              ? "font-bold text-blue-400"
              : "text-grey-light hover:text-grey-dark",
          )}
        >
          <HomeIcon className="mb-1 mr-3 inline-block h-9 w-9" />
          Home
        </Link>
        <div className="my-2 text-grey-light">
          <LayersIcon className="mb-1 mr-3 inline-block h-9 w-9" />
          Scenarios
          <CaretDownIcon className="ml-1 inline-block h-9 w-9" />
          <ul className="ml-16">
            <li>
              <Link
                href="/delivery"
                className={cn(
                  "transition-colors",
                  pathname === "/delivery"
                    ? "text-blue-400"
                    : "text-grey-light hover:text-grey-dark",
                )}
              >
                Delivery
              </Link>
            </li>
            <li>
              <Link
                href="/delivery-and-usage"
                className={cn(
                  "transition-colors",
                  pathname === "/delivery-and-usage"
                    ? "text-blue-400"
                    : "text-grey-light hover:text-grey-dark",
                )}
              >
                Delivery & Usage
              </Link>
            </li>
            <li>
              <Link
                href="/leak"
                className={cn(
                  "transition-colorsk",
                  pathname === "/leak"
                    ? "text-blue-400"
                    : "hover:text-grey-dar text-grey-light",
                )}
              >
                Leak
              </Link>
            </li>
          </ul>
        </div>
        <Link
          href="/visualisation"
          className={cn(
            "transition-colors ",
            pathname === "/visualisation"
              ? "text-blue-400"
              : "text-grey-light hover:text-grey-dark",
          )}
        >
          <BarChartIcon className="mb-2 mr-3 inline-block h-9 w-9" />
          Visualisation
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
