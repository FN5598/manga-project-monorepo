export enum MangaStatus {
  COMPLETED = "Completed",
  ONGOING = "Ongoing",
  HIATUS = "Hiatus",
}

export type Genre = {
  _id: string;
  name: string;
  slug: string;
  desccription: string;
};

export enum FileType {
  preview = "PREVIEW",
  page = "PAGE",
}

export type UploadMangaPayload = {
  title: string;
  author: string;
  description?: string | null;
  previewKey: string;
  genres: string[];
  status: MangaStatus;
};

export type PreviewType = {
  file: File;
  type: FileType;
};
