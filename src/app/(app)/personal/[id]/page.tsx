import { getOneFile } from "@/actions/file";

import React from "react";
import PageDetail from "./PageDetail";
import { FileTypes } from "@/types";
import { getLetters } from "@/actions/letters";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const file: FileTypes = await getOneFile(id);
  const letters: any = await getLetters({ fileRefNo: file.reffNo });

  return (
    <div>
      <PageDetail file={file} letters={letters} />
    </div>
  );
};

export default page;
