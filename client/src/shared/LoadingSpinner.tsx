import { ClipLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <ClipLoader size={22} />
    </div>
  );
}
