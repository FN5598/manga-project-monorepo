import { getUrlForImage } from "@resolvers/resolver.utils.js";

describe("resolver utils", () => {
  it("builds a public S3 URL for image keys in development", () => {
    expect(getUrlForImage("mangas/Manga One/chapter 1/page 1.png")).toBe(
      "http://localhost:9000/manga-project-bucket/mangas/Manga%20One/chapter%201/page%201.png",
    );
  });
});
