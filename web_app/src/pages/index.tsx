import { zodResolver } from "@hookform/resolvers/zod";
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

const tankSchema = z.object({
  name: z.string().nonempty({ message: "Tank name is required" }),
  serialNumber: z.coerce.number().positive({
    message: "Serial number must be a positive number",
  }),
  dateTime: z.string().datetime({ message: "Invalid date" }),
  delivery: z.coerce
    .number()
    .positive({ message: "Delivery must be a positive number" })
    .int({ message: "Delivery must be an integer" })
    .min(1, { message: "Delivery must be at least 1" })
    .max(100000, { message: "Delivery cannot exceed 100,000" }),
});

const tanksSchema = z.object({
  tanks: z.array(tankSchema),
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

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof tanksSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-8 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800">
          Generate test data
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 rounded border border-gray-300 p-4"
              >
                <h3>Tank {index + 1}</h3>
                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name={`tanks.${index}.delivery`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={`tanks.${index}.delivery`}>
                          Liters
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="1000" {...field} type="number" />
                        </FormControl>
                        <FormDescription>
                          The amount of liquid fertilizer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    remove(index);
                  }}
                  className="rounded bg-red-500 text-white"
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                append({
                  name: "",
                  serialNumber: 0,
                  dateTime: "",
                  delivery: 0,
                });
              }}
              className="rounded bg-blue-500 text-white"
            >
              Add Tank
            </Button>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Home;
