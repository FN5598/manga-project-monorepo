import AdminPanel from "@app/AdminPages/AdminPanel";
import UploadChapter from "./UploadChapter";

export default function UploadChapterPage() {
  return (
    <div className="flex min-h-screen w-full bg-milkyWhite">
      <AdminPanel />
      <UploadChapter />
    </div>
  );
}
