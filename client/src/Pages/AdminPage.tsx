import { AdminPanel } from "../Components/AdminComponents/AdminPanel";
import { UploadManga } from "../Components/AdminComponents/UploadManga";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full bg-milkyWhite">
      <AdminPanel />
      <UploadManga />
    </div>
  );
}
