import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  delivery: z.coerce
    .number()
    .positive({ message: "Delivery must be a positive number" })
    .int({ message: "Delivery must be an integer" })
    .min(1, { message: "Delivery must be at least 1" })
    .max(100000, { message: "Delivery cannot exceed 100,000" }),
});

const Home = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery: undefined,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
            <FormField
              control={form.control}
              name="delivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="liters">Liters</FormLabel>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Home;
