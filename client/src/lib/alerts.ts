import { toast, Zoom, type ToastPosition, type Theme } from "react-toastify";
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
