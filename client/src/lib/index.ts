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

export function getDateFromISOString(date: string): string {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Invalid time format";
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    parsedDate,
  );
  return `${monthName} ${parsedDate.getFullYear()}`;
}
