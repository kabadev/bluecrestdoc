import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    reffNo: { type: String, required: true, unique: true },
    isClosed: { type: Boolean, default: false },
    filetype: { type: String, required: true },
    sendTo: { type: String },
    date: { type: String },
    requiredBy: { type: String },
    returnDate: { type: String },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const File = mongoose.models.File || mongoose.model("File", FileSchema);
export default File;
