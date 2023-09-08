import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useEffect, useRef } from "react";
import TypographyH1 from "~/components/typography/h1";
import Link from "next/link";

const Home = () => {
  return (
    <div className="mx-10 flex min-h-screen flex-col items-center">
      <TypographyH1 className="mt-20 max-w-lg text-center text-6xl font-semibold text-grey-dark">
        Welcome to the Test Data Generator
      </TypographyH1>
      <hr className="mt-10 w-1/2 rounded border-t-4 border-black" />
      <h2 className="mt-10 max-w-2xl text-center text-2xl font-semibold text-gray-400">
        This website allows you to find out the necessary information regarding
        the tank levels in different scenarios.
      </h2>
      <h3 className="my-28 max-w-2xl rounded-2xl bg-primary px-8 py-4 text-center text-xl text-white">
        Please select a scenario to begin
      </h3>
      <div className="flex max-w-5xl flex-row gap-10">
        <Link
          href="/delivery"
          className="transform transition duration-500 ease-in-out hover:scale-110"
        >
          <Card className="h-full transform transition duration-500 ease-in-out hover:shadow-md">
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
            </CardHeader>
            <CardContent className="max-w-lg">
              <p>
                This scenario specifically updates the tank reading after the
                delivery process to 3 customers.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link
          href="/delivery-and-usage"
          className="transform transition duration-500 ease-in-out hover:scale-110"
        >
          <Card className="h-full transform transition duration-500 ease-in-out hover:shadow-md">
            <CardHeader>
              <CardTitle>Delivery & Usage</CardTitle>
            </CardHeader>
            <CardContent className="max-w-lg">
              <p>
                This scenario specifically updates the tank reading after the
                delivery process and its usage for one customer.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link
          href="/leak"
          className="transform transition duration-500 ease-in-out hover:scale-110"
        >
          <Card className="h-full transform transition duration-500 ease-in-out hover:shadow-md">
            <CardHeader>
              <CardTitle>Leakage</CardTitle>
            </CardHeader>
            <CardContent className="max-w-lg">
              <p>
                This scenario specifically updates the reading after a leakage
                in one of the customers’ tank.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Home;
