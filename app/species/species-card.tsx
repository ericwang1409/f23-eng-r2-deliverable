"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "../globals.css";
import DropdownEditDelete from "./dropdown";

type Species = Database["public"]["Tables"]["species"]["Row"];

type SpeciesCardProps = Species & {
  userId: string;
};

// form information
const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  common_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  description: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  kingdom: kingdoms,
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),
  total_population: z.number().int().positive().min(1).optional(),
  image: z
    .string()
    .url()
    .nullable()
    .transform((val) => val?.trim()),
});

type FormData = z.infer<typeof speciesSchema>;

export default function SpeciesCard({ userId, ...species }: SpeciesCardProps) {
  const supabase = createClientComponentClient<Database>();
  const [open, setOpen] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const router = useRouter();

  // default values for the form
  const defaultValues: Partial<FormData> = {
    common_name: species.common_name,
    description: species.description,
    kingdom: species.kingdom,
    scientific_name: species.scientific_name,
    total_population: species.total_population ?? undefined,
    image: species.image ?? undefined,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  // deletes the species if user is author
  const handleDelete = async () => {
    const { error } = await supabase.from("species").delete().eq("id", species.id).eq("author", userId);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    router.refresh();
  };

  // updates the species if user is author
  const onSubmit = async (input: FormData) => {
    const { error } = await supabase
      .from("species")
      .update({
        common_name: input.common_name,
        description: input.description,
        kingdom: input.kingdom,
        scientific_name: input.scientific_name,
        total_population: input.total_population,
        image: input.image,
      })
      .eq("id", species.id)
      .eq("author", userId);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    form.reset(input);

    setOpen(false);
    setIsReadOnly(true);

    router.refresh();
  };

  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      {/* Replace with detailed view */}

      {/* detailed view as form - on readOnly as default */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
            Learn More
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="rightJustify">
              {species.common_name}
              <DropdownEditDelete
                speciesId={species.author}
                userId={userId}
                onEdit={() => setIsReadOnly(species.author !== userId)}
                onDelete={() => {
                  void handleDelete();
                }}
              />
            </DialogTitle>
            <DialogDescription>More information on the {species.common_name}!</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="scientific_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scientific Name</FormLabel>
                      <FormControl>
                        <Input readOnly={isReadOnly} defaultValue={species.scientific_name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="common_name"
                  render={({ field }) => {
                    // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                    const { value, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Common Name</FormLabel>
                        <FormControl>
                          <Input
                            readOnly={isReadOnly}
                            placeholder={value ?? ""}
                            defaultValue={species.common_name ?? ""}
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="kingdom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kingdom</FormLabel>
                      {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
                      <Select
                        onValueChange={(value) => field.onChange(kingdoms.parse(value))}
                        defaultValue={species.kingdom}
                        disabled={isReadOnly}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a kingdom" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {kingdoms.options.map((kingdom, index) => (
                              <SelectItem key={index} value={kingdom}>
                                {kingdom}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total population</FormLabel>
                      <FormControl>
                        {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
                        <Input
                          type="number"
                          readOnly={isReadOnly}
                          defaultValue={species.total_population?.toString() ?? "N/A"}
                          {...field}
                          onChange={(event) => field.onChange(+event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input readOnly={isReadOnly} defaultValue={species.image ?? "N/A"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    // We must extract value from field and convert a potential defaultValue of `null` to "" because textareas can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                    const { value, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea readOnly={isReadOnly} placeholder={value ?? ""} defaultValue={species.description ?? ""} {...rest} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="flex">
                  <Button type="submit" className="ml-1 mr-1 flex-auto" disabled={isReadOnly}>
                    Edit Species
                  </Button>

                  <Button
                    type="button"
                    className="ml-1 mr-1 flex-auto"
                    variant="secondary"
                    onClick={() => {
                      setOpen(false);
                      setIsReadOnly(true);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
