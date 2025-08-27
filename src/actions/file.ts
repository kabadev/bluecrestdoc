"use server";

import File from "@/model/file";
import { mongooseConnect } from "../lib/mongodb";
import Letter from "@/model/letter";

export async function getFiles(
  filetype?: string,
  isClosed?: boolean,
  userid?: string
) {
  try {
    await mongooseConnect();

    const query: any = {};
    if (isClosed !== undefined) query.isClosed = isClosed;
    if (filetype) query.filetype = filetype;
    if (userid) query.userid = userid;

    const files = await File.aggregate([
      { $match: query }, // Filter files based on query
      {
        $lookup: {
          from: "letters", // Collection name (ensure it matches your actual MongoDB collection)
          localField: "reffNo", // Field in File model
          foreignField: "fileRefNo", // Field in Letter model
          as: "letters", // Resulting array
        },
      },
      {
        $addFields: {
          totalLetters: { $size: "$letters" }, // Compute total number of letters
        },
      },
      {
        $project: {
          letters: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return JSON.parse(JSON.stringify(files));
  } catch (error) {
    console.log("Failed to fetch files, Error:", error);
  }
}

export async function addFile(data: any) {
  try {
    mongooseConnect();
    const lastFile = await File.findOne().sort({ reffNo: -1 });
    const newReffNo = `REF${(
      Number.parseInt(lastFile?.reffNo.slice(3) || "0") + 1
    )
      .toString()
      .padStart(4, "0")}`;
    console.log(data);
    const newFile = new File({
      ...data,
      reffNo: newReffNo,
    });
    await newFile.save();
  } catch (error) {
    console.log("Failed to add file, Error:", error);
  }
}

export async function deleteFile(id: string) {
  try {
    await mongooseConnect();

    const file = await File.findById(id);
    if (!file) {
      console.log("File not found");
      return;
    }
    await Letter.deleteMany({ fileRefNo: file.reffNo });
    await File.findByIdAndDelete(id);
  } catch (error) {
    console.log("Failed to delete file, Error:", error);
  }
}

export async function updateFile(
  id: string,
  data: { name?: string; filetype?: string }
) {
  mongooseConnect();
  await File.findByIdAndUpdate(id, data);
}

export async function updateIsClosed(id: string, isClosed: boolean) {
  mongooseConnect();
  await File.findByIdAndUpdate(id, { isClosed });
}

export async function getOneFile(id: string) {
  mongooseConnect();
  const file = await File.findById(id);

  return JSON.parse(JSON.stringify(file));
}
