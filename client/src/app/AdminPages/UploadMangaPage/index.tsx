import AdminPanel from "@app/AdminPages/AdminPanel";
import UploadManga from "@app/AdminPages/UploadMangaPage";

export default function UploadMangaPage() {
  return (
    <div className="flex min-h-screen w-full bg-milkyWhite">
      <AdminPanel />
      <UploadManga />
    </div>
  );
}
