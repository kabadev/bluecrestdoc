"use client";

import { Search, X, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewFileModal } from "@/components/new-file-modal";
import FileCard from "@/components/FileCard";
import { FileTypes } from "@/types";

const FileList = ({ files }: { files: FileTypes[] }) => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [idSearch, setIdSearch] = useState<string>("");

  // New file modal state
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);

  // Apply filters
  const filteredFiles = files.filter((file) => {
    // Status filter
    if (statusFilter === "active" && file.isClosed) return false;
    if (statusFilter === "closed" && !file.isClosed) return false;

    // Name search
    if (
      nameSearch &&
      !file.name.toLowerCase().includes(nameSearch.toLowerCase())
    )
      return false;

    // ID search (checking both _id and reffNo)
    if (
      idSearch &&
      !file._id.toLowerCase().includes(idSearch.toLowerCase()) &&
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

  // Check if any filter is actives
  const isFilterActive =
    statusFilter !== "all" || nameSearch !== "" || idSearch !== "";

  // Handle new file creation

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Finacial Records</h1>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="text-sm text-gray-500 mr-4">
            Showing {filteredFiles.length} of {files.length} files
          </div>
          <Button
            onClick={() => setIsNewFileModalOpen(true)}
            className="flex items-center cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            New File
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="dark:bg-accent rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium  mb-1"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-background rounded-md border  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-background"
            >
              <option value="all">All Files</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="name-search"
              className="block text-sm font-medium  mb-1"
            >
              Search by Name
            </label>
            <div className="relative">
              <input
                id="name-search"
                type="text"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search file name..."
                className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 "
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex-1">
            <label
              htmlFor="id-search"
              className="block text-sm font-medium mb-1"
            >
              Search by ID/Ref
            </label>
            <div className="relative">
              <input
                id="id-search"
                type="text"
                value={idSearch}
                onChange={(e) => setIdSearch(e.target.value)}
                placeholder="Search ID or reference..."
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
      {filteredFiles.length === 0 ? (
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
          {filteredFiles.map((file) => (
            <FileCard path="financial-records" key={file._id} file={file} />
          ))}
        </div>
      )}

      {/* New File Modal */}
      <NewFileModal
        fileType="financial-records"
        isOpen={isNewFileModalOpen}
        onClose={() => setIsNewFileModalOpen(false)}
      />
    </div>
  );
};

export default FileList;
