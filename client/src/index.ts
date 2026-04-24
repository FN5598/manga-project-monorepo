import { toast, Zoom, type ToastPosition, type Theme } from "react-toastify";
import { type ApiError } from "./index.types";

export const NUMBER_REGEX = /^[0-9]+$/;

const createToastOptions = (
  position: ToastPosition,
  autoClose: number,
  theme: Theme,
) => ({
  position,
  autoClose,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme,
  transition: Zoom,
});

const toastMap = {
  info: toast.info,
  success: toast.success,
  warning: toast.warn,
  error: toast.error,
} as const;

type AlertType = "info" | "success" | "warning" | "error";

/**
 *   Helper functions to make consistent alerts across app
 *
 *   @param message - Message to show in alert
 *   @param type - Type of alert to show in UI
 *   @param autoClose - How long it takes to close alert automatically
 *   @param position - Where exactly in UI it will appear
 *   @param theme - Defines what theme the alert will be off
 *
 *   @returns ready to use pop up alert
 **/
export function emitAlert(
  message: string,
  type: AlertType,
  autoClose = 1000,
  position: ToastPosition = "top-center",
  theme: Theme = "light",
) {
  const options = createToastOptions(position, autoClose, theme);
  return toastMap[type](message, options);
}

export function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // seconds

  if (diff < 60) {
    return `${diff} sec${diff !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
/**
 * Used to get path dynamically in header
 *
 * @param name pathname can be capital and with spaces
 * @returns lowercased name with dashes instead of spaces
 */
export function getPath(name: string): string {
  return `/${name.toLowerCase().trim().replace(/\s+/g, "-")}`;
}

export function capitalizeFirstLetter(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

export function getErrorMessage(error: unknown) {
  const apiError = error as ApiError;
  const errorInfo = apiError.data?.errorInfo;

  console.log("errorInfo:", errorInfo);
  if (errorInfo?.field && errorInfo.message) {
    return `${errorInfo.field} ${errorInfo.message}`;
  }

  if (apiError.data?.message) {
    return apiError.data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Request failed";
}
