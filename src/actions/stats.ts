"use server";

import { mongooseConnect } from "@/lib/mongodb";
import File from "@/model/file";
import Letter from "@/model/letter";

// Interface for dashboard statistics
interface DashboardStats {
  fileStats: {
    totalFiles: number;
    receivedFiles: number;
    outgoingFiles: number;
    filesByType: {
      type: string;
      received: number;
      outgoing: number;
    }[];
    fileTypeDistribution: {
      type: string;
      count: number;
      percentage: number;
    }[];
    openFiles: number;
    closedFiles: number;
  };
  letterStats: {
    totalLetters: number;
    receivedLetters: number;
    outgoingLetters: number;
    lettersByDirection: {
      name: string;
      value: number;
    }[];
    lettersByFileType: {
      fileType: string;
      received: number;
      outgoing: number;
      total: number;
    }[];
    recentLetters: any[];
  };
}

/**
 * Get all dashboard statistics in a single server action
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    mongooseConnect();

    // Get file statistics
    const fileStats = await getFileStats();

    // Get letter statistics
    const letterStats = await getLetterStats();

    return {
      fileStats,
      letterStats,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard statistics:", error);
    // Return default values in case of error
    return {
      fileStats: {
        totalFiles: 0,
        receivedFiles: 0,
        outgoingFiles: 0,
        filesByType: [],
        fileTypeDistribution: [],
        openFiles: 0,
        closedFiles: 0,
      },
      letterStats: {
        totalLetters: 0,
        receivedLetters: 0,
        outgoingLetters: 0,
        lettersByDirection: [
          { name: "Received", value: 0 },
          { name: "Outgoing", value: 0 },
        ],
        lettersByFileType: [],
        recentLetters: [],
      },
    };
  }
}

/**
 * Get statistics about files
 */
async function getFileStats() {
  // Get total files count
  const totalFiles = await File.countDocuments();

  // Get open and closed files count
  const closedFiles = await File.countDocuments({ isClosed: true });
  const openFiles = totalFiles - closedFiles;

  // Get files by type
  const fileTypes = await File.distinct("filetype");

  const filesByType = await Promise.all(
    fileTypes.map(async (type) => {
      const typeTotal = await File.countDocuments({ filetype: type });

      // Determine received/outgoing based on filetype
      // If filetype is "received", count as received, if "outgoing", count as outgoing
      // For other types, we'll need to determine based on your business logic
      let received = 0;
      let outgoing = 0;

      if (type.toLowerCase() === "received") {
        received = typeTotal;
      } else if (type.toLowerCase() === "outgoing") {
        outgoing = typeTotal;
      } else {
        // For other types, split evenly or based on your business logic
        // This is a placeholder - adjust according to your needs
        received = Math.floor(typeTotal / 2);
        outgoing = typeTotal - received;
      }

      return {
        type,
        received,
        outgoing,
      };
    })
  );

  // Calculate total received and outgoing files
  const receivedFiles = filesByType.reduce(
    (sum, item) => sum + item.received,
    0
  );
  const outgoingFiles = filesByType.reduce(
    (sum, item) => sum + item.outgoing,
    0
  );

  // Calculate file type distribution
  const fileTypeDistribution = fileTypes.map((type) => {
    const typeCount = filesByType.find((f) => f.type === type)!;
    const count = typeCount.received + typeCount.outgoing;
    const percentage =
      totalFiles > 0 ? Math.round((count / totalFiles) * 100) : 0;

    return {
      type,
      count,
      percentage,
    };
  });

  return {
    totalFiles,
    receivedFiles,
    outgoingFiles,
    filesByType,
    fileTypeDistribution,
    openFiles,
    closedFiles,
  };
}

/**
 * Get statistics about letters
 */
async function getLetterStats() {
  // Get total letters count
  const totalLetters = await Letter.countDocuments();

  // Get files to determine letter direction based on fileType
  const files = await File.find({}, { reffNo: 1, filetype: 1 });

  // Create a map of file reference numbers to file types
  const fileTypeMap = new Map();
  files.forEach((file) => {
    fileTypeMap.set(file.reffNo, file.filetype);
  });

  // Get all letters with their file reference numbers
  const letters = await Letter.find({}, { fileRefNo: 1 });

  // Count received and outgoing letters based on the associated file's type
  let receivedLetters = 0;
  let outgoingLetters = 0;

  letters.forEach((letter) => {
    const fileType = fileTypeMap.get(letter.fileRefNo);

    if (fileType) {
      if (fileType.toLowerCase() === "received") {
        receivedLetters++;
      } else if (fileType.toLowerCase() === "outgoing") {
        outgoingLetters++;
      } else {
        // For other file types, you can implement custom logic
        // For now, we'll count them as received by default
        receivedLetters++;
      }
    } else {
      // If no file type is found, count as received by default
      receivedLetters++;
    }
  });

  // Create data for pie chart
  const lettersByDirection = [
    { name: "Received", value: receivedLetters },
    { name: "Outgoing", value: outgoingLetters },
  ];

  // Get letters by file type
  const fileTypes = await File.distinct("filetype");

  const lettersByFileType = await Promise.all(
    fileTypes.map(async (fileType) => {
      // Get files of this type
      const filesOfType = await File.find(
        { filetype: fileType },
        { reffNo: 1 }
      );
      const fileReffNos = filesOfType.map((file) => file.reffNo);

      // Count letters associated with these files
      const total = await Letter.countDocuments({
        fileRefNo: { $in: fileReffNos },
      });

      // Determine received/outgoing based on file type
      let received = 0;
      let outgoing = 0;

      if (fileType.toLowerCase() === "received") {
        received = total;
      } else if (fileType.toLowerCase() === "outgoing") {
        outgoing = total;
      } else {
        // For other types, implement your business logic
        received = Math.floor(total / 2);
        outgoing = total - received;
      }

      return {
        fileType,
        received,
        outgoing,
        total,
      };
    })
  );

  // Get recent letters for timeline
  const recentLetters = await Letter.find().sort({ createdAt: -1 }).limit(5);
  return {
    totalLetters,
    receivedLetters,
    outgoingLetters,
    lettersByDirection,
    lettersByFileType,
    recentLetters,
  };
}
