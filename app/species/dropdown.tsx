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
  // delete confirmation
  const handleDelete = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this species? This action cannot be undone.");
    if (isConfirmed) {
      onDelete();
    }
  };

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
          <DropdownMenuItem disabled={speciesId !== userId} onClick={handleDelete} className="deleteButton">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
