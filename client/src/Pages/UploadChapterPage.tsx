import { AdminPanel } from "../Components/AdminComponents/AdminPanel";
import UploadChapter from "../Components/AdminComponents/UploadChapter";

export default function UploadChapterPage() {
  return (
    <div className="flex min-h-screen w-full bg-milkyWhite">
      <AdminPanel />
      <UploadChapter />
    </div>
  );
}
