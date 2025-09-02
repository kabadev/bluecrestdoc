export const dynamic = "force-dynamic";
import { getFiles } from "@/actions/file";
import FileList from "./FileList";
import { FileTypes } from "@/types";

export default async function AcademicRecordsPage() {
  const files: FileTypes[] = await getFiles("academic-records");
  return (
    <div>
      <FileList files={files} />
    </div>
  );
}
