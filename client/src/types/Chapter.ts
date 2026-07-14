export enum UploadStatus {
  DRAFT = "draft",
  UPLOADING = "uploading",
  READY = "ready",
  FAILED = "failed",
}

export type Chapter = {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  storagePrefix: string;
  pageCount: number;
  uploadStatus: UploadStatus;
  createdAt: string;
  updatedAt: string;
};
