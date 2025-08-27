import mongoose, { Schema } from "mongoose";

const LetterSchema: Schema = new Schema(
  {
    dateOfReceive: {
      type: String,
    },
    dateOnTheLetter: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    reffNo: {
      type: String,
      required: [true, "Reference number is required"],
      unique: true,
    },
    subject: {
      type: String,
    },
    dateFile: {
      type: String,
    },
    fileRefNo: {
      type: String,
    },
    actionOfficer: {
      type: String,
    },
    docfile: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Letter = mongoose.models.Letter || mongoose.model("Letter", LetterSchema);

export default Letter;
