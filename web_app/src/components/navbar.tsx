import React from "react";
import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="bg-primary flex min-h-screen flex-col p-24">
      <div className="flex-shrink-0 p-4">
        <Link href="/" className="my-2 text-gray-900 hover:text-gray-700">
          <Image src="/logo.svg" alt="Brand Logo" height={200} width={200} />
        </Link>
      </div>
      <div className="flex flex-grow flex-col p-4">
        <Link href="/" className="my-2 text-gray-900 hover:text-gray-700">
          Home
        </Link>
        <div className="my-2 text-gray-900">
          Scenarios
          <ul className="ml-4">
            <li>
              <Link
                href="/delivery"
                className="text-gray-900 hover:text-gray-700"
              >
                Delivery
              </Link>
            </li>
            <li>
              <Link
                href="/delivery-and-usage"
                className="text-gray-900 hover:text-gray-700"
              >
                Delivery & Usage
              </Link>
            </li>
            <li>
              <Link href="/leak" className="text-gray-900 hover:text-gray-700">
                Leak
              </Link>
            </li>
          </ul>
        </div>
        <Link
          href="/visualization"
          className="my-2 text-gray-900 hover:text-gray-700"
        >
          Visualization
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
