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
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import "../globals.css";
import DropdownEditDelete from "./dropdown";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useRouter } from "next/navigation";


type Species = Database["public"]["Tables"]["species"]["Row"];

// form set up
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

const defaultValues: Partial<FormData> = {
  kingdom: "Animalia",
};

export default function SpeciesCard(species: Species, isReadOnly: boolean) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

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
              <DropdownEditDelete />
            </DialogTitle>
            <DialogDescription>More information on the {species.common_name}!</DialogDescription>
          </DialogHeader>
          <div>
            <label>Scientific Name</label>
            <br />
            <input type="text" value={species.scientific_name} readOnly={isReadOnly} className="font-light italic" />
          </div>

          <div>
            <label>Common Name</label>
            <br />
            <input type="text" value={species.common_name} readOnly={isReadOnly} className="border font-light" />
          </div>

          <div>
            <label>Kingdom</label>
            <br />
            <input type="text" value={species.kingdom} readOnly={isReadOnly} className="border font-light" />
          </div>

          <div>
            <label>Total Population</label>
            <br />
            <input
              type="text"
              value={species.total_population ? species.total_population : "N/A"}
              readOnly={isReadOnly}
              className="border font-light"
            />
          </div>

          <div>
            <label>Description</label>
            <br />
            <textarea value={species.description} readOnly={isReadOnly} className="border font-light" />
          </div>

          <div className="flex">
            <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
