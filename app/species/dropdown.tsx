"use-client";

// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Icons } from "@/components/icons";
// import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownListProps {
  onEdit: () => void;
  onDelete: () => void;
  userId: string;
  speciesId: string;
}

export default function DropdownList({ speciesId, userId, onEdit, onDelete }: DropdownListProps) {
  // const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.settings />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={speciesId !== userId} onClick={onEdit}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={speciesId !== userId} onClick={() => onDelete()} className="deleteButton">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
