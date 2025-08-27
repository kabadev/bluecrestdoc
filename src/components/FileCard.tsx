import { FileTypes } from "@/types";
import { Clock, File, Folder, Newspaper, Send } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditFileModal } from "./edit-file-modal";
import { DeleteFileDialog } from "./delete-file-dialog";
import { Button } from "./ui/button";

const FileCard = ({ file, path }: { file: FileTypes; path: string }) => {
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteFileModalOpen] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Link
            href={`/${path}/${file._id}`}
            className="relative group cursor-pointer shadow-md rounded-b-lg"
          >
            {/* Folder tab */}
            <div className="absolute top-0 left-6 w-1/3  h-6 bg-gradient-to-r from-sky-300 to-sky-200 dark:from-accent  dark:to-accent/50 rounded-t-lg z-10 shadow-sm" />

            {/* Main folder body */}
            <div className="relative pt-6 pb-4 px-6 mt-3 rounded-lg overflow-hidden">
              {/* Folder background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-white dark:from-accent dark:to-accent/50 rounded-lg" />

              {/* Folder content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 ">
                  <Folder className="h-8 w-8 text-sky-600 dark:text-foreground" />
                  <div>
                    <h3 className="font-medium text-lg">{file.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {file.reffNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1.5">
                    <Newspaper className="h-4 w-4 text-sky-600/70 dark:text-gray-500" />
                    <span className="text-sm text-sky-700 dark:text-gray-500">
                      {file.totalLetters} items
                    </span>
                  </div>
                </div>
                {file.filetype === "transit-book" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Send className="h-4 w-4 text-sky-600/70 dark:text-gray-500" />
                        <span className="text-sm  dark:text-gray-500">
                          Send to:
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-sky-700 dark:text-gray-500">
                          {file.sendTo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-sky-600/70 dark:text-gray-500" />
                        <span className="text-sm  dark:text-gray-500">
                          Date:
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-sky-700 dark:text-gray-500">
                          {file.date}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {file.filetype === "bring-up" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Send className="h-4 w-4 text-sky-600/70 dark:text-gray-500" />
                        <span className="text-sm  dark:text-gray-500">
                          Required By:
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-sky-700 dark:text-gray-500">
                          {file.requiredBy}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      file.isClosed
                        ? "bg-red-100 dark:bg-red-300/50  text-red-700 dark:text-white"
                        : "bg-green-200 dark:bg-green-300/50 text-green-700 dark:text-white"
                    }`}
                  >
                    {file.isClosed ? "Closed" : "Active"}
                  </span>
                </div>

                {/* Folder contents visualization */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: Math.min(6, 10) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 bg-sky-100 dark:bg-muted-foreground/30 rounded-full"
                      style={{
                        opacity: 0.5 + i * 0.1,
                        width: `${70 + Math.random() * 30}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Folder shadow effect on hover */}
            <div className="absolute inset-0 rounded-lg  opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-52 ">
          <ContextMenuItem
            className="cursor-pointer"
            inset
            onClick={() => setIsNewFileModalOpen(true)}
          >
            Edit
            <ContextMenuShortcut>⌘ Edit</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            className="cursor-pointer"
            inset
            onClick={() => setDeleteFileModalOpen(true)}
          >
            Delete
            <ContextMenuShortcut>Delete</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <EditFileModal
        id={file._id.toString()}
        fileType="hr"
        name={file.name}
        isOpen={isNewFileModalOpen}
        onClose={() => setIsNewFileModalOpen(false)}
      />
      <DeleteFileDialog
        id={file._id.toString()}
        name={file.name}
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteFileModalOpen(false)}
      />
    </>
  );
};

export default FileCard;
