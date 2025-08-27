"use client";

import { deleteFile } from "@/actions/file";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteFileDialogProps {
  isOpen: boolean;
  id: string;
  name: string;
  onClose: () => void;
}

export function DeleteFileDialog({
  isOpen,
  name,
  id,
  onClose,
}: DeleteFileDialogProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const DeleteFile = async () => {
    try {
      setIsLoading(true);
      await deleteFile(id);
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete File
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure you want to delete the file "${name}"? This action
            cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={DeleteFile}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading ? "Delete..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
