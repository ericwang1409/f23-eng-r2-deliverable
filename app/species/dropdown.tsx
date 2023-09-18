"use-client";

// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Icons } from "@/components/icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DropdownList() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button disabled={true} variant="ghost">
            <Icons.settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem className="deleteButton">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
