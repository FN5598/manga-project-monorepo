import { toast, Zoom, type ToastPosition, type Theme } from "react-toastify";
import type { MangaStatus } from "./Components/AdminComponents/manga.utils";

export const NUMBER_REGEX = /^[0-9]+$/;

type AlertType = "info" | "success" | "warning" | "error";

export enum Sort {
  ASC = "asc",
  DESC = "desc",
}

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
/**
 * Used to store data in localstorage consistenly
 */
export function saveToLocalStorage(
  data: Record<string, unknown>,
  itemName: string,
): boolean {
  try {
    const transformedData = JSON.stringify(data);
    localStorage.setItem(itemName, transformedData);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export type DraftData = {
  mangaTitle: string | null;
  mangaStatus: MangaStatus;
  authorName: string | null;
  chapterNumber: number | null;
  chapterTitle: string | null;
  mangaDescription: string | null;
  preview: string | null;
  previewFileData: File | null;
};

export function getItemFromLocalStorage(itemName: string) {
  const item = localStorage.getItem(itemName);
  if (item) {
    return JSON.parse(item);
  }
  return null;
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
