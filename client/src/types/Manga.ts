export enum MangaStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  HIATUS = "hiatus",
  CANCELLED = "cancelled",
}

export enum FileType {
  preview = "PREVIEW",
  page = "PAGE",
}

export type PreviewType = {
  file: File;
  type: FileType;
};

export type Manga = {
  _id: string;
  title: string;
  author: string;
  description?: string;
  previewUrl: string;
  status: MangaStatus;
  genres: {
    name?: string;
    description?: string;
    _id?: string;
    slug?: string;
  }[];
  chaptersCount: number;
  createdAt: string;
  updatedAt: string;
};

export type UploadMangaPayload = {
  title: string;
  author: string;
  description?: string | null;
  genres: string[];
  status: MangaStatus;
};

export type UploadMangaReponse = {
  _id: string;
  title: string;
  author: string;
  description?: string | null;
  genres: string[];
  status: MangaStatus;
  previewUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateMangaPayload = {
  manga: {
    _id: string;
    previewKey: string;
  };
  chapter: {
    chapterNumber: number;
    title: string;
  };
  pages: {
    imageKey: string;
    fileName: string;
    fileSize: number;
  }[];
};

export type UpdateMangaResponse = {
  message: string;
  mangaId?: string;
  chapterId?: string;
};
