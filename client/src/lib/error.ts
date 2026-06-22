import { emitAlert } from "./alerts";

export function handleError(e: unknown) {
  if ((e.name = "AppError")) {
    emitAlert(e.data.message, "error", 2500);
  }

  if (e.extensions?.code) {
    emitAlert(e.message, "alert", 2500);
  }

  emitAlert(e.message ?? "Something went wrong", "error", 2500);
}
