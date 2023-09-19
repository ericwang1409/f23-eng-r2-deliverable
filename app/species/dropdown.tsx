"use-client";

import { Icons } from "@/components/icons";
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

// dropdown menu for edit and delete
export default function DropdownList({ speciesId, userId, onEdit, onDelete }: DropdownListProps) {
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
