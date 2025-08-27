"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Inbox,
  Send,
  Files,
  Mail,
  FolderOpen,
  FolderClosed,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { formatDistanceToNow } from "date-fns";

// Define types for our statistics
interface FileStats {
  totalFiles: number;
  receivedFiles: number;
  outgoingFiles: number;
  filesByType: {
    type: string;
    received: number;
    outgoing: number;
  }[];
  fileTypeDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  openFiles: number;
  closedFiles: number;
}

interface LetterStats {
  totalLetters: number;
  receivedLetters: number;
  outgoingLetters: number;
  lettersByDirection: {
    name: string;
    value: number;
  }[];
  lettersByFileType: {
    fileType: string;
    received: number;
    outgoing: number;
    total: number;
  }[];
  recentLetters: any[];
}

interface DashboardProps {
  fileStats: FileStats;
  letterStats: LetterStats;
}

// Colors for charts
const CHART_COLORS = {
  received: "#818cf8", // indigo
  outgoing: "#c084fc", // purple
  pie: ["#818cf8", "#c084fc"],
};

export function Dashboard({ fileStats, letterStats }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Files"
          value={fileStats.totalFiles}
          description="All documents in the system"
          icon={<Files className="h-5 w-5 text-sky-600" />}
        />
        <SummaryCard
          title="Total Letters"
          value={letterStats.totalLetters}
          description="All correspondence"
          icon={<Mail className="h-5 w-5 text-indigo-600" />}
        />
        <SummaryCard
          title="Open Files"
          value={fileStats.openFiles}
          description="Active documents"
          icon={<FolderOpen className="h-5 w-5 text-emerald-600" />}
        />
        <SummaryCard
          title="Closed Files"
          value={fileStats.closedFiles}
          description="Completed documents"
          icon={<FolderClosed className="h-5 w-5 text-amber-600" />}
        />
      </div>

      {/* Incoming/Outgoing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>File Direction</CardTitle>
            <CardDescription>Received vs outgoing files</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-around items-center">
            <DirectionStat
              icon={<Inbox className="h-8 w-8 text-indigo-600" />}
              value={fileStats.receivedFiles}
              label="Received"
              bgColor="bg-indigo-100"
            />
            <DirectionStat
              icon={<Send className="h-8 w-8 text-purple-600" />}
              value={fileStats.outgoingFiles}
              label="Outgoing"
              bgColor="bg-purple-100"
            />
          </CardContent>
        </Card>

        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>Documents Direction</CardTitle>
            <CardDescription>
              Received vs outgoing correspondence
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-around items-center">
            <DirectionStat
              icon={<Inbox className="h-8 w-8 text-indigo-600" />}
              value={letterStats.receivedLetters}
              label="Received"
              bgColor="bg-indigo-100"
            />
            <DirectionStat
              icon={<Send className="h-8 w-8 text-purple-600" />}
              value={letterStats.outgoingLetters}
              label="Outgoing"
              bgColor="bg-purple-100"
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>File Distribution by Type</CardTitle>
            <CardDescription>
              Breakdown of files by type and direction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileBarChart data={fileStats.filesByType} />
          </CardContent>
        </Card>

        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>Letter Distribution</CardTitle>
            <CardDescription>
              Received vs outgoing correspondence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LetterPieChart data={letterStats.lettersByDirection} />
          </CardContent>
        </Card>
      </div>

      {/* File Type Distribution */}
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>File Type Distribution</CardTitle>
          <CardDescription>Breakdown of documents by category</CardDescription>
        </CardHeader>
        <CardContent>
          <FileTypeDistribution data={fileStats.fileTypeDistribution} />
        </CardContent>
      </Card>

      {/* Recent Letters */}
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>Recent Correspondence</CardTitle>
          <CardDescription>Latest letters received or sent</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentLetters letters={letterStats.recentLetters} />
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-components

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

function SummaryCard({ title, value, description, icon }: SummaryCardProps) {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface DirectionStatProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  bgColor: string;
}

function DirectionStat({ icon, value, label, bgColor }: DirectionStatProps) {
  return (
    <div className="text-center">
      <div
        className={`flex items-center justify-center h-16 w-16 rounded-full ${bgColor} mx-auto mb-2`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

interface FileTypeData {
  type: string;
  received: number;
  outgoing: number;
}

function FileBarChart({ data }: { data: FileTypeData[] }) {
  // Check if there's any data to display
  const hasData = data.some((item) => item.received > 0 || item.outgoing > 0);

  if (!hasData) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
        No file type data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          />
          <Legend />
          <Bar
            dataKey="received"
            name="Received"
            fill={CHART_COLORS.received}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="outgoing"
            name="Outgoing"
            fill={CHART_COLORS.outgoing}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DirectionData {
  name: string;
  value: number;
}

function LetterPieChart({ data }: { data: DirectionData[] }) {
  // Check if there's any data to display
  const hasData = data.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
        No letter direction data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS.pie[index % CHART_COLORS.pie.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} letters`, ""]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface FileTypeDistributionItem {
  type: string;
  count: number;
  percentage: number;
}

function FileTypeDistribution({ data }: { data: FileTypeDistributionItem[] }) {
  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  if (!sortedData.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No file type data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedData.map((item) => (
        <div key={item.type} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.type}</span>
            <span className="text-sm text-muted-foreground">
              {item.count} files ({item.percentage}%)
            </span>
          </div>
          <Progress value={item.percentage} className="h-2" />
        </div>
      ))}
    </div>
  );
}

function RecentLetters({ letters }: { letters: any[] }) {
  if (!letters || letters.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent letters found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {letters.map((letter) => (
        <div
          key={letter._id}
          className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Mail className="h-5 w-5 text-sky-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{letter.subject}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>From: {letter.from}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
              <span>Ref: {letter.reffNo}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(letter.dateOfReceive || letter.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Date unknown";
  }
}
