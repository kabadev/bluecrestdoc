import { LetterType } from "@/types";
import { Newspaper } from "lucide-react";

export function LetterCard({
  letter,
  path,
  onClick,
}: {
  letter: LetterType;
  path: string;
  onClick: (letter: LetterType) => void;
}) {
  return (
    <div
      onClick={() => onClick(letter)}
      className="relative cursor-pointer w-full rounded-tr-2xl aspect-[4/5]s bg-gradient-to-b from-sky-50 dark:from-accent to-white group dark:to-accent/30"
    >
      <div className="absolute z-10 top-0 right-0 w-0 h-0 border-t-[60px] border-r-[60px] border-t-sky-200/50 border-r-white/90 dark:border-t-slate-400/80 dark:border-r-gray-300/50 shadow-sm">
        <div className="absolute -top-[58px] -right-[58px] w-0 h-0 border-t-[58px] border-r-[58px] border-t-sky-100/80 dark:border-t-slate-600/80 border-r-transparent"></div>
      </div>

      <div className="h-full p-6 flex flex-col">
        <div className="flex items-center gap-3 ">
          <Newspaper className="h-8 w-8 text-sky-600 dark:text-foreground" />
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {letter.reffNo}
            </p>
          </div>
        </div>

        <div className="border-b border-sky-200/70 pb-4 mb-6 mt-4">
          <h3 className="text-md font-semibold text-sky-900 mb-2 dark:text-white">
            {letter.subject}
          </h3>
          <span className="text-sm text-sky-600 dark:text-muted-foreground">
            {letter.from}
          </span>
          <div className="flex justify-between text-xs mt-2 dark:text-muted-foreground">
            <span className="text-sky-700 font-medium">
              Ref: {letter.reffNo}
            </span>
            <span className="text-sky-600">File: {letter.fileRefNo}</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="h-2 bg-sky-100 dark:bg-slate-600/50 rounded-full w-[90%]"></div>
          <div className="h-2 bg-sky-100 dark:bg-slate-600/50 rounded-full w-full"></div>
          <div className="h-2 bg-sky-100 dark:bg-slate-600/50 rounded-full w-[95%]"></div>
        </div>
      </div>

      <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
}
