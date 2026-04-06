import { ClipLoader } from "react-spinners";

export default function LoadingSpinnerPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader size={50} />
    </div>
  );
}
