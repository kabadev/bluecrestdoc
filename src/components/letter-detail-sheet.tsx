"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  ExternalLink,
  FileText,
  Newspaper,
  Calendar,
  User,
  Building,
  Hash,
  Edit,
  Trash2,
} from "lucide-react";
import { DeleteLetterDialog } from "./delete-letter-dialog";
import { LetterType } from "@/types";
import { deleteLetter } from "@/actions/letters";
import Link from "next/link";

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
}

interface LetterDetailSheetProps {
  letter: LetterType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (letter: LetterType) => void;
  onDelete: (letter: LetterType) => void;
}

export function LetterDetailSheet({
  letter,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: LetterDetailSheetProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!letter) return null;

  const handleEdit = () => {
    onEdit(letter);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteLetter(letter._id);
      onOpenChange(false);
      setDeleteDialogOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      onOpenChange(false);
      setDeleteDialogOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-[60%] sm:max-w-[70%] md:max-w-[40%] md:w-[50%] overflow-y-auto py-10 px-4"
        >
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-sky-800">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-sky-600" />
                  <span>Letter Details</span>
                </div>
              </SheetTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEdit}
                  title="Edit Letter"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  title="Delete Letter"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <SheetDescription className="text-sky-600">
              View complete information about this correspondence
            </SheetDescription>
          </SheetHeader>

          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-6">
              <div className="bg-sky-50/50 p-4 rounded-lg border border-sky-100">
                <h3 className="text-lg font-semibold text-sky-900 mb-2">
                  {letter.subject}
                </h3>
                <div className="flex items-center text-sm text-sky-700 gap-1">
                  <Hash className="h-4 w-4" />
                  <span>Reference: {letter.reffNo}</span>
                </div>
              </div>

              <div className="space-y-4 ">
                <div className="hidden items-start gap-3">
                  <Building className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-sky-800">From</h4>
                    <p className="text-sky-700">{letter.from}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-sky-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-sky-800">
                        Date Received
                      </h4>
                      <p className="text-sky-700">
                        {formatDate(letter.dateOfReceive)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-sky-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-sky-800">
                        Date on Letter
                      </h4>
                      <p className="text-sky-700">
                        {formatDate(letter.dateOnTheLetter)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-sky-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-sky-800">
                        File Reference
                      </h4>
                      <p className="text-sky-700">{letter.fileRefNo}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-sky-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-sky-800">
                        Date Filed
                      </h4>
                      <p className="text-sky-700">
                        {formatDate(letter.dateFile)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-sky-800">
                      Action Officer
                    </h4>
                    <p className="text-sky-700">{letter.actionOfficer}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="document" className="mt-4 space-y-6">
              <div className="bg-sky-50/50 p-6 rounded-lg border border-sky-100 flex flex-col items-center justify-center min-h-[300px]">
                <FileText className="h-16 w-16 text-sky-300 mb-4" />
                <h3 className="text-lg font-semibold text-sky-800 mb-1">
                  Document file
                </h3>
                <p className="text-sm text-sky-600 text-center mb-6">
                  View or download the official Document file
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open(letter.docfile, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Preview</span>
                  </Button>

                  <Link
                    target="_blank"
                    download={letter.subject}
                    href={letter?.docfile!}
                  >
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <DeleteLetterDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        subject={letter.subject}
        isLoading={isLoading}
      />
    </>
  );
}
