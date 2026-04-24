db = db.getSiblingDB("db");

/**
 * Password = 12345
 */

const now = new Date();

function oid(value) {
  if (!/^[a-fA-F0-9]{24}$/.test(value)) {
    throw new Error(`Invalid ObjectId "${value}" length=${value.length}`);
  }

  return ObjectId(value);
}

function seedOne(collection, filter, data) {
  db[collection].updateOne(
    filter,
    {
      $setOnInsert: {
        ...data,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
}

function makePageId(group, pageNumber) {
  return oid(
    `66f0000000000000000${String(group).padStart(2, "0")}${String(pageNumber).padStart(3, "0")}`,
  );
}

function seedUser({ email, username, role }) {
  seedOne(
    "users",
    { email },
    {
      email,
      username,
      role,
      hashedPassword:
        "$argon2id$v=19$m=65536,t=3,p=4$3Pjiu5XEWvp+vgJRB9hamg$XfA0lKakY9CZNmwXFI+w+cWi1vYmys2DSCcIOL/COF8",
    },
  );
}

function seedManga({
  id,
  title,
  author,
  description,
  genres,
  status,
  chaptersCount,
}) {
  seedOne(
    "mangas",
    { _id: id },
    {
      _id: id,
      title,
      author,
      description,
      genres,
      status,
      chaptersCount,
      previewKey: `previews/${id}/${id}.png`,
    },
  );
}

function seedChapter({ id, mangaId, chapterNumber, title, pageCount }) {
  seedOne(
    "chapters",
    { _id: id },
    {
      _id: id,
      chapterNumber,
      title,
      storagePrefix: `mangas/${mangaId}/${chapterNumber}/`,
      pageCount,
      uploadStatus: "ready",
      mangaId,
    },
  );
}

function seedPages({ mangaId, chapterId, chapterNumber, pageIds }) {
  pageIds.forEach((pageId, index) => {
    const pageNumber = index + 1;

    seedOne(
      "pages",
      { _id: pageId },
      {
        _id: pageId,
        chapter: chapterId,
        imageKey: `mangas/${mangaId}/${chapterNumber}/${pageId}.png`,
        fileSize: 695557,
        pageNumber,
      },
    );
  });
}

const mangas = [
  {
    id: oid("66f000000000000000000001"),
    title: "One Piece",
    author: "Eiichiro Oda",
    description: "Mock manga",
    genres: ["Adventure", "Action", "Fantasy"],
    status: "ongoing",
    chapters: [
      {
        id: oid("66f000000000000000000101"),
        chapterNumber: 1,
        title: '"Romance Dawn" - The Beginning Of The Adventures',
        pageIds: Array.from({ length: 6 }, (_, i) => makePageId(1, i + 1)),
      },
      {
        id: oid("66f000000000000000000102"),
        chapterNumber: 2,
        title: "They Call Him 'Straw Hat Luffy'",
        pageIds: Array.from({ length: 5 }, (_, i) => makePageId(2, i + 1)),
      },
    ],
  },
  {
    id: oid("66f000000000000000000002"),
    title: "JoJo's Bizarre Adventure: Part 1 - Phantom Blood",
    author: "Hirohiko Araki",
    description: "Mock manga 2",
    genres: ["Action", "Adventure", "Supernatural"],
    status: "completed",
    chapters: [
      {
        id: oid("66f000000000000000000103"),
        chapterNumber: 1,
        title: "Prologue",
        pageIds: Array.from({ length: 5 }, (_, i) => makePageId(3, i + 1)),
      },
    ],
  },
];

seedUser({
  email: "admin@test.com",
  username: "Admin user",
  role: "ADMIN",
});

seedUser({
  email: "user@test.com",
  username: "Default user",
  role: "USER",
});

mangas.forEach((manga) => {
  seedManga({
    id: manga.id,
    title: manga.title,
    author: manga.author,
    description: manga.description,
    genres: manga.genres,
    status: manga.status,
    chaptersCount: manga.chapters.length,
  });

  manga.chapters.forEach((chapter) => {
    seedChapter({
      id: chapter.id,
      mangaId: manga.id,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      pageCount: chapter.pageIds.length,
    });

    seedPages({
      mangaId: manga.id,
      chapterId: chapter.id,
      chapterNumber: chapter.chapterNumber,
      pageIds: chapter.pageIds,
    });
  });
});

console.log("Mongo seed completed");
