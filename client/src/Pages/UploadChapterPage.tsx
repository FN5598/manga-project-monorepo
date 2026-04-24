import { useRefreshAccessTokenMutation } from "../api/auth";
import { AdminPanel } from "../Components/AdminComponents/AdminPanel";
import UploadChapter from "../Components/AdminComponents/UploadChapter";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinnerPage from "../Components/UI/LoadingPage";
import { useEffect, useRef } from "react";
import { emitAlert, getErrorMessage } from "..";

export default function UploadChapterPage() {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const [refresh, { isLoading, isSuccess, isError }] =
    useRefreshAccessTokenMutation();

  const hasRefreshedRef = useRef(false);

  useEffect(() => {
    if (hasRefreshedRef.current) return;
    hasRefreshedRef.current = true;

    async function refreshToken() {
      if (!adminId) {
        navigate("/discover");
        return;
      }

      try {
        await refresh({ userId: adminId! }).unwrap();
      } catch (error) {
        emitAlert(getErrorMessage(error), "error", 2500);
        navigate("/discover");
      }
    }

    refreshToken();
  });

  if (isError) navigate("/discover");
  if (isLoading) return <LoadingSpinnerPage />;
  if (!isError && !isLoading && isSuccess) {
    return (
      <div className="flex min-h-screen w-full bg-milkyWhite">
        <AdminPanel />
        <UploadChapter />
      </div>
    );
  }
}
