import { BookOpen, ChartNoAxesColumn, Clock3, LibraryBig } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import type { ReactNode } from "react";
import { useGetAllMangasQuery } from "@api/mangaApi";
import type { Manga } from "@appTypes/Manga";
import LoadingSpinner from "../../shared/LoadingSpinner";
import AdminPanel from "./AdminPanel";

enum UploadGroupBy {
  DAY = "day",
  HOUR = "hour",
  MINUTE = "minute",
  SECOND = "second",
}

type MangaUploadsChartItem = {
  time: string;
  uploads: number;
};

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
};

const chartConfig = {
  uploads: {
    label: "Uploaded Mangas",
    color: "var(--primary)",
  },
};

function getMangaUploadsChartData(
  mangas: Manga[],
  groupBy: UploadGroupBy,
): MangaUploadsChartItem[] {
  const grouped = mangas.reduce<Record<string, number>>((acc, manga) => {
    const date = new Date(manga.createdAt);

    let key: string;

    if (groupBy === UploadGroupBy.DAY) {
      key = date.toISOString().slice(0, 10);
    } else if (groupBy === UploadGroupBy.HOUR) {
      key = date.toISOString().slice(0, 13);
    } else if (groupBy === UploadGroupBy.MINUTE) {
      key = date.toISOString().slice(0, 16);
    } else {
      key = date.toISOString().slice(0, 19);
    }

    acc[key] = (acc[key] ?? 0) + 1;

    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([time, uploads]) => ({
      time,
      uploads,
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

function formatXAxis(value: string) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTooltipLabel(label: ReactNode) {
  if (typeof label !== "string") return "";

  return new Date(label).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-milkyWhite text-slate-800">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

export default function MangaUploadsLineChart() {
  const { data: mangaResponse, isLoading, isError } = useGetAllMangasQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error</div>;
  if (!mangaResponse?.mangas) return <div>No manga data</div>;

  const chartData = getMangaUploadsChartData(
    mangaResponse.mangas,
    UploadGroupBy.MINUTE,
  );
  const totalMangas = mangaResponse.mangaCount ?? mangaResponse.mangas.length;
  const totalChapters = mangaResponse.mangas.reduce(
    (count, manga) => count + (manga.chaptersCount ?? 0),
    0,
  );
  const latestUpload = mangaResponse.mangas
    .map((manga) => new Date(manga.createdAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <div className="flex min-h-screen w-full flex-col bg-milkyWhite lg:flex-row">
      <AdminPanel />

      <main className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Analytics
          </h1>
          <p className="text-sm text-gray sm:text-base">
            A quick snapshot of manga activity across the catalog.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<LibraryBig className="h-5 w-5" />}
            label="Total manga"
            value={totalMangas}
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Total chapters"
            value={totalChapters}
          />
          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Latest upload"
            value={latestUpload ? latestUpload.toLocaleDateString() : "None"}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ChartNoAxesColumn className="h-5 w-5" />
                Manga uploads
              </h2>
              <p className="text-sm text-muted-foreground">
                Uploads grouped by minute
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <ChartContainer
              config={chartConfig}
              className="h-75 min-w-140 sm:min-w-0"
            >
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatXAxis}
                />

                <YAxis tickLine={false} axisLine={false} tickMargin={8} />

                <ChartTooltip
                  content={
                    <ChartTooltipContent labelFormatter={formatTooltipLabel} />
                  }
                />

                <Line
                  type="monotone"
                  dataKey="uploads"
                  stroke="var(--color-uploads)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
