export const dynamic = "force-dynamic";
import { getFiles } from "@/actions/file";
import FileList from "./FileList";
import { FileTypes } from "@/types";

export default async function StudentRecordsPage() {
  const files: FileTypes[] = await getFiles("student-file");
  return (
    <div>
      <FileList files={files} />
    </div>
  );
}
