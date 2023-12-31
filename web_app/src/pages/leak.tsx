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
import { TanksDataSchema, apiDataAtom } from "~/atom/data";
import { useAtom } from "jotai";

const tankLeakSchema = z.object({
  tankName: z.string().nonempty({ message: "Tank name is required" }),
  tankSerialNumber: z.coerce.number().positive({
    message: "Serial number must be a positive number",
  }),
  tankAreaM2: z.coerce.number().positive({
    message: "Area must be a positive number",
  }),
  tankCapacity: z.coerce.number().positive({
    message: "Capacity must be a positive number",
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
  leakRate: z.coerce
    .number()
    .positive({ message: "Leak rate must be a positive number" })
    .int({ message: "Leak rate must be an integer" })
    .min(1, { message: "Leak rate must be at least 1" })
    .max(100000, { message: "Leak rate cannot exceed 100,000" }),
  leakDuration: z.coerce
    .number()
    .positive({ message: "Leak duration must be a positive number" })
    .int({ message: "Leak duration must be an integer" })
    .min(1, { message: "Leak duration must be at least 1" })
    .max(100000, { message: "Leak duration cannot exceed 100,000" }),
  leakHeight: z.coerce
    .number()
    .int({ message: "Leak height must be an integer" })
    .min(0, { message: "Leak height must be at least 1" })
    .max(100000, { message: "Leak height cannot exceed 100,000" }),
  tankCustomerName: z
    .string()
    .nonempty({ message: "Customer name is required" }),
});

const Home = () => {
  const [apiData, setApiData] = useAtom(apiDataAtom);
  // 1. Define your form.
  const form = useForm<z.infer<typeof tankLeakSchema>>({
    resolver: zodResolver(tankLeakSchema),
  });

  // 2. Define a submit handler.
  const onSubmit = (value: z.infer<typeof tankLeakSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(JSON.stringify(value));
    fetch("/api/leakage")
      .then((response) => response.json())
      .then((data) => {
        // Update the Jotai atom with the fetched data
        const parsedData = TanksDataSchema.parse(data);
        console.log(parsedData);
        setApiData(parsedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="ml-16 flex min-h-screen items-center justify-center">
      <div>
        <TypographyH1 className="text-6xl font-semibold text-gray-800">
          Leaky Scenario
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
                    <CardTitle>Leaky Tank</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-10">
                    <hr className="col-span-2 border-t border-gray-200" />
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
                    <div className="">
                      <FormField
                        control={form.control}
                        name="dateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="dateTime">
                              Date and Time
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
                        name="leakRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="leakRate">Leak Rate</FormLabel>
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
                        name="leakDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="leakDuration">
                              Leak Duration
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
                        name="leakHeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="leakHeight">
                              Leak Height
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
                        name="tankCustomerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tanks.tankCustomerName">
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
