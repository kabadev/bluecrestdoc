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
import { addFile } from "@/actions/file";
import { useRouter } from "next/navigation";

interface NewFileModalProps {
  fileType: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NewFileModal({ fileType, isOpen, onClose }: NewFileModalProps) {
  const router = useRouter();
  const [newFileName, setNewFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCreateNewFile = async () => {
    const newFile: any = {
      ...formData,
      filetype: fileType,
    };
    console.log(newFile);
    try {
      setIsLoading(true);
      await addFile(newFile);
      setFormData({});
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
          <DialogTitle>Create New File</DialogTitle>
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
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Enter file name..."
            className="w-full"
          />
        </div>

        {fileType === "transit-book" && (
          <>
            <div className="py-1">
              <label
                htmlFor="new-file-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sent To
              </label>
              <Input
                id="new-file-name"
                name="sendTo"
                value={formData.sendTo || ""}
                placeholder="Enter Send to..."
                className="w-full"
                type="text"
                onChange={handleChange}
                required
              />
            </div>

            <div className="py-1">
              <label
                htmlFor="new-file-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <Input
                id="new-file-name"
                name="date"
                type="date"
                value={formData.date || ""}
                className="w-full"
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        {fileType === "bring-up" && (
          <>
            <div className="py-1">
              <label
                htmlFor="new-file-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Required By
              </label>
              <Input
                id="new-file-name"
                name="requiredBy"
                value={formData.requiredBy || ""}
                placeholder="Enter Required By..."
                className="w-full"
                type="text"
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

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
            {isLoading ? "Creating..." : "Create File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
