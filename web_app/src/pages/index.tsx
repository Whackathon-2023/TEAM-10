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
    <LayoutGroup>
      <AnimatePresence>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Generate test data
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-6xl space-y-8 overflow-x-auto rounded bg-white p-8 shadow-md"
              >
                <div className="flex flex-row gap-x-8">
                  <motion.div {...animations}>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Tank 1</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 mt-2">
                          <FormField
                            control={form.control}
                            name="tank.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="tanks.name">
                                  Tank Name
                                </FormLabel>
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
                        <div className="mb-2">
                          <FormField
                            control={form.control}
                            name="tank.serialNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="tanks.serialNumber">
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
                        <div className="mb-2">
                          <FormField
                            control={form.control}
                            name="tank.dateTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="tank.dateTime">
                                  Date and Time
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Time"
                                    {...field}
                                    type="dateTime-local"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="mb-2">
                          <FormField
                            control={form.control}
                            name="tank.delivery"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="tanks.delivery">
                                  Liters
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
                        <div className="mb-2">
                          <FormField
                            control={form.control}
                            name="tank.customerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="tanks.customerName">
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
                  </motion.div>
                  {fields.map((field, index) => (
                    <motion.div key={field.id} {...animations}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Tank {index + 2}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2 mt-2">
                            <FormField
                              control={form.control}
                              name={`tanks.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor={`tanks.${index}.name`}>
                                    Tank Name
                                  </FormLabel>
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
                          <div className="mb-2">
                            <FormField
                              control={form.control}
                              name={`tanks.${index}.serialNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`tanks.${index}.serialNumber`}
                                  >
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
                          <div className="mb-2">
                            <FormField
                              control={form.control}
                              name={`tanks.${index}.dateTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`tanks.${index}.dateTime`}
                                  >
                                    Date and Time
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Time"
                                      {...field}
                                      type="dateTime-local"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mb-2">
                            <FormField
                              control={form.control}
                              name={`tanks.${index}.delivery`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`tanks.${index}.delivery`}
                                  >
                                    Liters
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
                          <div className="mb-2">
                            <FormField
                              control={form.control}
                              name={`tanks.${index}.customerName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`tanks.${index}.customerName`}
                                  >
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
                        <CardFooter className="flex justify-center">
                          <Button
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                            className="rounded bg-red-500 text-white"
                          >
                            Remove
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                  <motion.div
                    {...animations}
                    // className="mb-4 flex items-center justify-center rounded border border-gray-300 p-10"
                  >
                    <Card
                      className="flex h-full items-center justify-center"
                      ref={lastItemRef}
                    >
                      <CardContent>
                        <Button
                          type="button"
                          onClick={() => {
                            append({
                              name: "",
                              serialNumber: 0,
                              dateTime: "",
                              delivery: 0,
                              customerName: "",
                            });
                          }}
                          className="rounded bg-blue-500 text-white"
                        >
                          Add Tank
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                <Button className="sticky bottom-0 left-0" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default Home;
