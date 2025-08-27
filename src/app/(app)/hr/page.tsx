import { getFiles } from "@/actions/file";
import FileList from "./FileList";
import { FileTypes } from "@/types";

export default async function HRPage() {
  const files: FileTypes[] = await getFiles("hr");
  return (
    <div>
      <FileList files={files} />
    </div>
  );
}
