import { BadRequestError } from "@errors/Error.js";
import { errorHandler } from "@middlewares/error.middleware.js";

function createResponse(headersSent = false) {
  const res = {
    headersSent,
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res;
}

describe("errorHandler middleware", () => {
  it("sends AppError responses", () => {
    const res = createResponse();
    const next = jest.fn();

    errorHandler(
      new BadRequestError("Invalid request", { message: "Bad field" }),
      {} as never,
      res as never,
      next,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid request",
      code: "BAD_REQUEST",
      errorInfo: { message: "Bad field" },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("delegates when headers were already sent", () => {
    const error = new Error("late");
    const res = createResponse(true);
    const next = jest.fn();

    errorHandler(error, {} as never, res as never, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("sends a generic response for unknown errors", () => {
    const res = createResponse();

    errorHandler(new Error("hidden"), {} as never, res as never, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong",
      code: "INTERNAL_SERVER_ERROR",
    });
  });
});
