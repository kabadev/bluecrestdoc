export const dynamic = "force-dynamic";
import { getFiles } from "@/actions/file";
import FileList from "./FileList";
import { FileTypes } from "@/types";

export default async function FinancialRecordsPage() {
  const files: FileTypes[] = await getFiles("financial-records");
  return (
    <div>
      <FileList files={files} />
    </div>
  );
}
