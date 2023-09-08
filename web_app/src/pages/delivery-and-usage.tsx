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
import TypographyH1 from "~/components/typography/h1";

const tankLeakSchema = z.object({
  tankName: z.string().nonempty({ message: "Tank name is required" }),
  tankSerialNumber: z.coerce.number().positive({
    message: "Serial number must be a positive number",
  }),
  tankCustomerName: z
    .string()
    .nonempty({ message: "Customer name is required" }),
  tankAreaM2: z.coerce.number().positive({
    message: "Area must be a positive number",
  }),
  tankCapacity: z.coerce.number().positive({
    message: "Capacity must be a positive number",
  }),
  delivery: z.coerce
    .number()
    .positive({ message: "Delivery must be a positive number" })
    .int({ message: "Delivery must be an integer" })
    .min(1, { message: "Delivery must be at least 1" })
    .max(100000, { message: "Delivery cannot exceed 100,000" }),
  delivery_dateTime: z
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
  delivery_fillRate: z.coerce
    .number()
    .positive({ message: "Fill rate must be a positive number" })
    .int({ message: "Fill rate must be an integer" })
    .min(1, { message: "Fill rate must be at least 1" })
    .max(100000, { message: "Fill rate cannot exceed 100,000" }),
  usage: z.coerce
    .number()
    .positive({ message: "Usage must be a positive number" })
    .int({ message: "Usage must be an integer" })
    .min(1, { message: "Usage must be at least 1" })
    .max(100000, { message: "Usage cannot exceed 100,000" }),
  usage_startDateTime: z
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
  usage_endDateTime: z
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
  usage2: z.coerce
    .number()
    .positive({ message: "Usage must be a positive number" })
    .int({ message: "Usage must be an integer" })
    .min(1, { message: "Usage must be at least 1" })
    .max(100000, { message: "Usage cannot exceed 100,000" }),
  usage2_startDateTime: z
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
  usage2_endDateTime: z
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
  usage3: z.coerce
    .number()
    .positive({ message: "Usage must be a positive number" })
    .int({ message: "Usage must be an integer" })
    .min(1, { message: "Usage must be at least 1" })
    .max(100000, { message: "Usage cannot exceed 100,000" }),
  usage3_startDateTime: z
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
  usage3_endDateTime: z
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
});

const Home = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof tankLeakSchema>>({
    resolver: zodResolver(tankLeakSchema),
  });

  // 2. Define a submit handler.
  const onSubmit = (value: z.infer<typeof tankLeakSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(JSON.stringify(value));
  };

  return (
    <div className="ml-16 flex min-h-screen items-center justify-center">
      <div>
        <TypographyH1 className="text-6xl font-semibold text-gray-800">
          Delivery and Usage Scenario
        </TypographyH1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-screen-lg space-y-8 overflow-x-auto rounded bg-white py-8"
          >
            <div className="flex flex-row justify-between gap-x-8">
              <div>
                <Card className="h-full w-full shadow-md">
                  <CardHeader>
                    <CardTitle>Tank</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-6">
                    <hr className="col-span-3 border-t border-gray-200" />
                    <div className="">
                      <FormField
                        control={form.control}
                        name="tankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tankName">Tank Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Tank A"
                                {...field}
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="tankSerialNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tankSerialNumber">
                              Tank Serial Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234567"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="tankCustomerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tankCustomerName">
                              Customer Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Smith"
                                {...field}
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <hr className="col-span-3 border-t border-gray-200" />
                    <div>
                      <FormField
                        control={form.control}
                        name="tankAreaM2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tankAreaM2">
                              Tank Area M2
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="18.75"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="tankCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tankCapacity">
                              Tank Max Capacity
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="20000"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div></div>
                    <hr className="col-span-3 border-t border-gray-200" />
                    <div className="">
                      <FormField
                        control={form.control}
                        name="delivery"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="deliverye"
                              className="text-md font-bold"
                            >
                              Delivery:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1000"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="delivery_dateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="delivery_dateTime">
                              Date & Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Time"
                                {...field}
                                type="dateTime-local"
                                // max={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="delivery_fillRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="delivery_fillRate">
                              Fill Rate
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1000"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <hr className="col-span-3 border-t border-gray-200" />
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="usage"
                              className="text-md font-bold"
                            >
                              Usage 1:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1000"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage_startDateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="usage_startDateTime">
                              Start Date & Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Time"
                                {...field}
                                type="dateTime-local"
                                // max={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage_endDateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="usage_endDateTime">
                              End Date & Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Time"
                                {...field}
                                type="dateTime-local"
                                // max={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <hr className="col-span-3 border-t border-gray-200" />
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="usage2"
                              className="text-md font-bold"
                            >
                              Usage 2:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1000"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage2_startDateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="usage2_startDateTime">
                              Start Date & Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Time"
                                {...field}
                                type="dateTime-local"
                                // max={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage2_endDateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="usage2_endDateTime">
                              End Date & Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Time"
                                {...field}
                                type="dateTime-local"
                                // max={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <hr className="col-span-3 border-t border-gray-200" />
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="usage3"
                              className="text-md font-bold"
                            >
                              Usage 3:
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1000"
                                {...field}
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage3_startDateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="usage3_startDateTime">
                              Start Date & Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Time"
                                {...field}
                                type="dateTime-local"
                                // max={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="usage3_endDateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="usage3_endDateTime">
                              End Date & Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Time"
                                {...field}
                                type="dateTime-local"
                                // max={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Button
              className="sticky bottom-0 left-0 rounded-full bg-primary text-white"
              type="submit"
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Home;
