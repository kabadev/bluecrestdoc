import { getFiles } from "@/actions/file";
import FileList from "./FileList";
import { FileTypes } from "@/types";

export default async function ReceivedPage() {
  const files: FileTypes[] = await getFiles("transit-book");
  return (
    <div>
      <FileList files={files} />
    </div>
  );
}
