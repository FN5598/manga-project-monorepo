import { Database } from "lucide-react";
import { useState } from "react";

export default function S3Upload() {
  const [bucketName, setBucketName] = useState<string>("");
  const [pathName, setPathName] = useState<string>("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    switch (e.target.name) {
      case "bucket-input":
        setBucketName(e.target.value);
        break;
      case "path-input":
        setPathName(e.target.value);
        break;
    }
  }

  return (
    <section className="flex flex-1 flex-col bg-white p-5 shadow-md rounded-lg gap-5">
      <div className="flex flex-1 flex-row items-center gap-2">
        <Database className="text-gray" />
        <label className="text-gray font-semibold text-xl">S3 Storage</label>
      </div>
      <div className="flex flex-col">
        <label htmlFor="bucket-input" className="admin-label">
          Bucket Name
        </label>
        <input
          id="bucket-input"
          name="bucket-input"
          placeholder="manga-assets-prod-1"
          className="admin-input-style"
          value={bucketName}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="path-input" className="admin-label">
          Bucket Name
        </label>
        <div className="flex items-center border border-gray rounded-lg overflow-hidden bg-white">
          {/* Prefix: Fixed background and right-border only */}
          <span className="p-2 bg-milkyWhite text-gray-500 border-r border-gray select-none">
            /manga/
          </span>

          {/* Input: Transparent border and no focus-ring of its own */}
          <input
            id="path-input"
            name="path-input"
            placeholder="custom-path"
            className="flex-1 px-3 py-2 outline-none border-none bg-transparent"
            value={pathName}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </section>
  );
}
