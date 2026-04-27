import { getErrorInfo, getErrorMessage } from "@errors/error.utils.js";

describe("error utils", () => {
  it("returns messages from Error instances", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("uses a fallback message for unknown values", () => {
    expect(getErrorMessage("boom")).toBe("Unknown error");
  });

  it("serializes Error details", () => {
    const cause = new Error("root");
    const error = new Error("wrapped", { cause });

    expect(getErrorInfo(error)).toEqual(
      expect.objectContaining({
        errorName: "Error",
        message: "wrapped",
        cause,
      }),
    );
  });

  it("serializes unknown values with a fallback shape", () => {
    expect(getErrorInfo(null)).toEqual({
      errorName: "Unknown error",
      message: "Unknown error occured",
    });
  });
});
