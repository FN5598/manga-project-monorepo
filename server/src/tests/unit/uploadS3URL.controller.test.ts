import { sanitizeS3PathPart } from "@controllers/uploadS3URL.controller.js";

describe("uploadS3URL controller helpers", () => {
  it("normalizes path parts for S3 keys", () => {
    expect(sanitizeS3PathPart(" One Piece: East Blue! ")).toBe(
      "one-piece-east-blue",
    );
  });

  it("keeps lowercase letters, numbers, hyphens, and underscores", () => {
    expect(sanitizeS3PathPart("manga_01-final")).toBe("manga_01-final");
  });
});
