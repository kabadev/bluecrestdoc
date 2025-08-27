"use client";

import { Search, X, Plus, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewFileModal } from "@/components/new-file-modal";
import FileCard from "@/components/FileCard";
import { FileTypes, LetterType } from "@/types";
import { LetterCard } from "@/components/LetterCard";
import { LetterDetailSheet } from "@/components/letter-detail-sheet";
import { LetterFormSheet } from "@/components/letter-form-sheet";

const PageDetail = ({
  letters,
  file,
}: {
  letters: LetterType[];
  file: FileTypes;
}) => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [idSearch, setIdSearch] = useState<string>("");

  // New file modal state
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);

  // Apply filters
  const filteredletters = letters?.filter((file) => {
    if (
      idSearch &&
      !file.subject.toLowerCase().includes(idSearch.toLowerCase()) &&
      !file.from.toLowerCase().includes(idSearch.toLowerCase()) &&
      !file.reffNo.toLowerCase().includes(idSearch.toLowerCase())
    )
      return false;

    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("all");
    setNameSearch("");
    setIdSearch("");
  };

  // Check if any filter is active
  const isFilterActive =
    statusFilter !== "all" || nameSearch !== "" || idSearch !== "";

  // Handle new file creation

  const [selectedLetter, setSelectedLetter] = useState<LetterType | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [formSheetOpen, setFormSheetOpen] = useState(false);
  const [letterToEdit, setLetterToEdit] = useState<LetterType | null>(null);

  const handleLetterClick = (letter: LetterType) => {
    setSelectedLetter(letter);
    setDetailSheetOpen(true);
  };

  const handleAddNewLetter = () => {
    setLetterToEdit(null);
    setFormSheetOpen(true);
  };

  const handleEditLetter = (letter: LetterType) => {
    setLetterToEdit({ ...letter });
    setFormSheetOpen(true);
  };

  const handleDeleteLetter = (letter: LetterType) => {
    try {
    } catch (error) {}
  };

  const handleSaveLetter = (letterData: Partial<LetterType>) => {
    if (letterToEdit) {
      // Edit existing letter
    } else {
      // Add New Document
      const newLetter = {
        ...letterData,
        _id: `letter_${Date.now()}`, // Generate a temporary ID
      } as LetterType;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{file.name}</h1>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="text-sm text-gray-500 mr-4">
            Showing {filteredletters.length} of {letters.length} files
          </div>
          <Button
            onClick={handleAddNewLetter}
            className="flex items-center gap-2 ml-4"
          >
            <PlusCircle className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="dark:bg-accent rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="id-search"
              className="block text-sm font-medium mb-1"
            >
              Search by document Name/ReffNo
            </label>
            <div className="relative">
              <input
                id="id-search"
                type="text"
                value={idSearch}
                onChange={(e) => setIdSearch(e.target.value)}
                placeholder="Search Document Name or reference..."
                className="w-full rounded-md border bg-background  border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {isFilterActive && (
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredletters.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No files match your filters</p>
          <button
            onClick={resetFilters}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {filteredletters.map((letter) => (
            <LetterCard
              path={`/received/${file._id}/${letter._id}`}
              key={letter._id}
              letter={letter}
              onClick={() => handleLetterClick(letter)}
            />
          ))}
        </div>
      )}

      <LetterDetailSheet
        letter={selectedLetter}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={() => handleEditLetter(selectedLetter!)}
        onDelete={handleDeleteLetter}
      />

      <LetterFormSheet
        fileRefNo={file.reffNo}
        letter={letterToEdit}
        open={formSheetOpen}
        onOpenChange={setFormSheetOpen}
        onSave={handleSaveLetter}
      />
    </div>
  );
};

export default PageDetail;
