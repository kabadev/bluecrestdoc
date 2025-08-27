"use server";

import { mongooseConnect } from "@/lib/mongodb";
import Letter from "@/model/letter";
import { revalidatePath } from "next/cache";

interface LetterData {
  dateOfReceive: string;
  dateOnTheLetter: string;
  from: string;
  subject: string;
  dateFile: string;
  fileRefNo: string;
  actionOfficer: string;
  docfile?: string;
}

interface FilterOptions {
  from?: string;
  fileRefNo?: string;
  dateOfReceive?: string;
  dateOnTheLetter?: string;
  dateFile?: string;
  actionOfficer?: string;
  subject?: string;
  startDate?: string;
  endDate?: string;
}

export async function getLetters(filters: FilterOptions = {}) {
  try {
    mongooseConnect();

    const query: any = {};

    // Apply filters if provided
    if (filters.from) query.from = { $regex: filters.from, $options: "i" };
    if (filters.fileRefNo) query.fileRefNo = filters.fileRefNo;
    if (filters.dateOfReceive) query.dateOfReceive = filters.dateOfReceive;
    if (filters.dateOnTheLetter)
      query.dateOnTheLetter = filters.dateOnTheLetter;
    if (filters.dateFile) query.dateFile = filters.dateFile;
    if (filters.actionOfficer)
      query.actionOfficer = { $regex: filters.actionOfficer, $options: "i" };
    if (filters.subject)
      query.subject = { $regex: filters.subject, $options: "i" };

    // Date range filtering
    if (filters.startDate && filters.endDate) {
      query.dateOfReceive = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      };
    } else if (filters.startDate) {
      query.dateOfReceive = { $gte: filters.startDate };
    } else if (filters.endDate) {
      query.dateOfReceive = { $lte: filters.endDate };
    }

    const letters = await Letter.find(query).sort({ dateOfReceive: -1 });
    return JSON.parse(JSON.stringify(letters));
  } catch (error) {
    console.error("Failed to fetch letters. Error:", error);
    throw new Error("Failed to fetch letters");
  }
}

export async function addLetter(data: LetterData) {
  try {
    mongooseConnect();
    console.log(data);
    // Generate a new reference number
    const lastLetter = await Letter.findOne().sort({ reffNo: -1 });
    const newReffNo = `REF${(
      Number.parseInt(lastLetter?.reffNo.slice(3) || "0") + 1
    )
      .toString()
      .padStart(6, "0")}`;

    const newLetter = new Letter({
      ...data,
      reffNo: newReffNo,
    });

    const savedLetter = await newLetter.save();

    return JSON.parse(JSON.stringify(savedLetter));
  } catch (error) {
    console.error("Failed to add letter. Error:", error);
    throw new Error("Failed to add letter");
  }
}

export async function deleteLetter(id: string) {
  try {
    mongooseConnect();
    await Letter.findByIdAndDelete(id);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete letter. Error:", error);
    throw new Error("Failed to delete letter");
  }
}

export async function updateLetter(id: string, data: Partial<LetterData>) {
  try {
    mongooseConnect();
    const updatedLetter = await Letter.findByIdAndUpdate(id, data, {
      new: true,
    });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(updatedLetter));
  } catch (error) {
    console.error("Failed to update letter. Error:", error);
    throw new Error("Failed to update letter");
  }
}

export async function getOneLetter(id: string) {
  try {
    mongooseConnect();
    const letter = await Letter.findById(id);
    if (!letter) {
      throw new Error("Letter not found");
    }
    return JSON.parse(JSON.stringify(letter));
  } catch (error) {
    console.error("Failed to fetch letter. Error:", error);
    throw new Error("Failed to fetch letter");
  }
}

export async function searchLetters(searchTerm: string) {
  try {
    mongooseConnect();

    const letters = await Letter.find({
      $or: [
        { subject: { $regex: searchTerm, $options: "i" } },
        { from: { $regex: searchTerm, $options: "i" } },
        { actionOfficer: { $regex: searchTerm, $options: "i" } },
        { fileRefNo: { $regex: searchTerm, $options: "i" } },
        { reffNo: { $regex: searchTerm, $options: "i" } },
      ],
    }).sort({ dateOfReceive: -1 });

    return JSON.parse(JSON.stringify(letters));
  } catch (error) {
    console.error("Failed to search letters. Error:", error);
    throw new Error("Failed to search letters");
  }
}
