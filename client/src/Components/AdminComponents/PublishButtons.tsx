import LoadingSpinner from "../UI/LoadingSpinner";

type PublishButtonsProps = {
  handlePublish: () => void;
  loading: boolean;
  clearAllStates: () => void;
};

export default function PublishButtons({
  handlePublish,
  loading,
  clearAllStates,
}: PublishButtonsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg bg-white p-5 font-semibold shadow-md">
      <button
        onClick={handlePublish}
        // We keep 'disabled' for UX, but the logic above provides the safety
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white transition-all ${
          loading
            ? "bg-midnight/80 cursor-not-allowed"
            : "bg-midnight cursor-pointer hover:brightness-110 active:scale-95"
        }
                      `}
      >
        {loading && (
          <span className="flex-shrink-0 animate-pulse">
            <LoadingSpinner />
          </span>
        )}
        <span>{loading ? "Publishing..." : "Publish Manga"}</span>
      </button>
      <button
        onClick={clearAllStates}
        className="cursor-pointer rounded-lg p-2 text-gray transition duration-200 hover:bg-milkyWhite"
      >
        Cancel
      </button>
    </section>
  );
}
