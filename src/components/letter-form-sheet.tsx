"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUp, Save } from "lucide-react";
import { addLetter } from "@/actions/letters";
import { updateLetter } from "@/actions/letters";
import { useRouter } from "next/navigation";

interface Letter {
  _id: string;
  dateOfReceive: string;
  dateOnTheLetter: string;
  from: string;
  reffNo: string;
  subject: string;
  dateFile: string;
  fileRefNo: string;
  actionOfficer: string;
  docFile?: string;
}

interface LetterFormSheetProps {
  letter?: Letter | null; // If provided, we're in edit mode
  open: boolean;
  fileRefNo: string;
  fileType?: string;
  onOpenChange: (open: boolean) => void;
  onSave?: (letter: Partial<Letter>) => void;
}

export function LetterFormSheet({
  letter,
  fileRefNo,
  fileType,
  open,
  onOpenChange,
  onSave,
}: LetterFormSheetProps) {
  const isEditMode = !!letter;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Letter>>(() => {
    if (letter) {
      // Format dates for date input fields (YYYY-MM-DD format)
      return {
        ...letter,
        dateOfReceive: letter.dateOfReceive
          ? letter.dateOfReceive.split("T")[0]
          : new Date().toISOString().split("T")[0],
        dateOnTheLetter: letter.dateOnTheLetter
          ? letter.dateOnTheLetter.split("T")[0]
          : new Date().toISOString().split("T")[0],
        dateFile: letter.dateFile
          ? letter.dateFile.split("T")[0]
          : new Date().toISOString().split("T")[0],
      };
    }

    // Default values for new letter
    return {
      dateOfReceive: new Date().toISOString().split("T")[0],
      dateOnTheLetter: new Date().toISOString().split("T")[0],
      dateFile: new Date().toISOString().split("T")[0],
    };
  });

  const [file, setFile] = useState<File | null>(null);

  // Update form data when letter changes (for edit mode)
  useEffect(() => {
    if (letter) {
      setFormData({
        ...letter,
        dateOfReceive: letter.dateOfReceive
          ? letter.dateOfReceive.split("T")[0]
          : new Date().toISOString().split("T")[0],
        dateOnTheLetter: letter.dateOnTheLetter
          ? letter.dateOnTheLetter.split("T")[0]
          : new Date().toISOString().split("T")[0],
        dateFile: letter.dateFile
          ? letter.dateFile.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      // Reset form when opening for a new letter
      setFormData({
        dateOfReceive: new Date().toISOString().split("T")[0],
        dateOnTheLetter: new Date().toISOString().split("T")[0],
        dateFile: new Date().toISOString().split("T")[0],
      });
      setFile(null);
    }
  }, [letter, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file);

      const response = await fetch(
        "https://uploadapi.streamliberia.org?action=upload",
        {
          method: "POST",
          body: fileFormData,
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      return data.data.file_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const letterData: any = { ...formData };

      // Handle file upload if there's a new file
      if (file) {
        const fileUrl = await uploadFile(file);
        letterData.docfile = fileUrl;
      }

      if (isEditMode && letter) {
        // Update existing letter
        await updateLetter(letter._id, letterData);
      } else {
        letterData.fileRefNo = fileRefNo;
        await addLetter(letterData);
      }

      // Close the form
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving letter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full p-4 sm:max-w-md md:max-w-lg overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-sky-800">
            {isEditMode ? "Edit Document" : "Add New Document"}
          </SheetTitle>
          <SheetDescription className="text-sky-600">
            {isEditMode
              ? "Update the details of this correspondence"
              : "Fill in the details to add a new correspondence"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Document Name</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="hidden">
              <Label htmlFor="from">
                {fileType === "received" ? "From" : "To"}
              </Label>
              <Input
                id="from"
                name="from"
                value={formData.from || "Doc"}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfReceive">Date Received</Label>
                <Input
                  id="dateOfReceive"
                  name="dateOfReceive"
                  type="date"
                  value={formData.dateOfReceive || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dateOnTheLetter">Date on Document</Label>
                <Input
                  id="dateOnTheLetter"
                  name="dateOnTheLetter"
                  type="date"
                  value={formData.dateOnTheLetter || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFile">Date Filed</Label>
                <Input
                  id="dateFile"
                  name="dateFile"
                  type="date"
                  value={formData.dateFile || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="actionOfficer">Action Officer</Label>
                <Input
                  id="actionOfficer"
                  name="actionOfficer"
                  value={formData.actionOfficer || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Document file</Label>
            <div className="border-2 border-dashed border-sky-200 rounded-lg p-6 flex flex-col items-center justify-center bg-sky-50/50">
              <FileUp className="h-10 w-10 text-sky-400 mb-2" />
              <p className="text-sm text-sky-700 mb-2">
                {file
                  ? file.name
                  : isEditMode && letter?.docFile
                  ? "Current document attached"
                  : "Upload Document file"}
              </p>
              {isEditMode && letter?.docFile && !file && (
                <p className="text-xs text-sky-600 mb-2">
                  A document is already attached. Upload a new one to replace
                  it.
                </p>
              )}
              <p className="text-xs text-sky-500 mb-4">
                PDF, DOC, or DOCX up to 10MB
              </p>
              <div className="relative">
                <Button type="button" variant="outline" size="sm">
                  Select File
                </Button>
                <Input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-1" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
