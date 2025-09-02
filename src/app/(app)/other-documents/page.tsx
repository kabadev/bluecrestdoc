export const dynamic = "force-dynamic";
import { getFiles } from "@/actions/file";
import FileList from "./FileList";
import { FileTypes } from "@/types";

export default async function OtherDocumentsPage() {
  const files: FileTypes[] = await getFiles("transit-book");
  return (
    <div>
      <FileList files={files} />
    </div>
  );
}
