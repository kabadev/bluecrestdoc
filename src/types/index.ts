export interface FileTypes {
  _id: string;
  reffNo: string;
  name: string;
  isClosed: boolean;
  filetype: string;
  totalLetters?: string;
  userid: string;
  sendTo?: string;
  date?: string;
  requiredBy?: string;
}

export interface LetterType {
  _id: string;
  name: string;
  dateOfReceive: string;
  dateOnTheLetter: string;
  from: string;
  reffNo: string;
  subject: string;
  dateFile: string;
  fileRefNo: string;
  actionOfficer: string;
  docfile?: string;
}
