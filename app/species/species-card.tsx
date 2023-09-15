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
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard(species: Species) {
  const [open, setOpen] = useState<boolean>(false);

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
            <DialogTitle>{species.common_name}</DialogTitle>
            <DialogDescription>
              More information on the {species.common_name}!
            </DialogDescription>
          </DialogHeader>
          <div>
            <h1 className="font-bold">Scientific Name</h1>
            <p className="font-light italic">{species.scientific_name}</p>
          </div>

          <div>
            <h1 className="font-bold">Common Name</h1>
            <p className="font-light">{species.common_name}</p>
          </div>

          <div>
            <h1 className="font-bold">Kingdom</h1>
            <p className="font-light">{species.kingdom}</p>
          </div>

          <div>
            <h1 className="font-bold">Total Population</h1>
            <p className="font-light">{species.total_population ? species.total_population : "N/A"}</p>
          </div>

          <div>
            <h1 className="font-bold">Description</h1>
            <p className="font-light">{species.description}</p>
          </div>

          <div className="flex">
            <Button 
              type="button" 
              className="ml-1 mr-1 flex-auto" 
              variant="secondary" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
