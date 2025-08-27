import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { updateFile } from "@/actions/file";

interface EditFileModalProps {
  isOpen: boolean;
  id: string;
  name: string;
  fileType?: string;
  onClose: () => void;
}

export function EditFileModal({
  isOpen,
  id,
  name,
  fileType,
  onClose,
}: EditFileModalProps) {
  const router = useRouter();
  const [newFileName, setNewFileName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNewFile = async () => {
    const updatedFile: any = {
      name: newFileName,
      filetype: fileType,
    };
    console.log(updatedFile);

    try {
      setIsLoading(true);
      await updateFile(id, updatedFile);
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    // if (newFileName.trim()) {
    //   onCreateFile(newFileName.trim());
    //   setNewFileName("");
    //   onClose();
    // }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label
            htmlFor="new-file-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            File Name
          </label>
          <Input
            id="new-file-name"
            value={newFileName || name}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter file name..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleCreateNewFile}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
