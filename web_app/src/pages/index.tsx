import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
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

const tankSchema = z.object({
  name: z.string().nonempty({ message: "Tank name is required" }),
  serialNumber: z.coerce.number().positive({
    message: "Serial number must be a positive number",
  }),
  dateTime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .refine(
      (value) => {
        const parsedDate = new Date(value);
        return !isNaN(parsedDate.getTime());
      },
      {
        message: "Invalid date and time format",
      },
    ),
  delivery: z.coerce
    .number()
    .positive({ message: "Delivery must be a positive number" })
    .int({ message: "Delivery must be an integer" })
    .min(1, { message: "Delivery must be at least 1" })
    .max(100000, { message: "Delivery cannot exceed 100,000" }),
  customerName: z.string().nonempty({ message: "Customer name is required" }),
});

const tanksListSchema = z.array(tankSchema);

const tanksSchema = z.object({
  tank: tankSchema,
  tanks: tanksListSchema.optional(),
});

const Home = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof tanksSchema>>({
    resolver: zodResolver(tanksSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tanks",
  });

  const lastItemRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fields]);

  // 2. Define a submit handler.
  const onSubmit = ({ tank, tanks }: z.infer<typeof tanksSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (tanks && tanks.length > 0 && Array.isArray(tanks)) {
      const tank_list = tanksListSchema.parse([tank, ...tanks]);
      console.log(tank_list);
    } else {
      const tank_list = tanksListSchema.parse([tank]);
      console.log(tank_list);
    }
  };

  const animations = {
    layout: true,
    initial: { scale: 1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1, opacity: 0 },
    transition: { type: "spring", stiffness: 900, damping: 40 },
  };

  return (
    <div className="flex min-h-screen flex-col items-center lg:ml-32 xl:ml-44 2xl:ml-72">
      <TypographyH1 className="mt-20 max-w-lg text-center text-6xl font-semibold text-grey-dark">
        Welcome to the Test Data Generator
      </TypographyH1>
      <hr className="mt-10 w-1/2 rounded border-t-4 border-black" />
    </div>
  );
};

export default Home;
