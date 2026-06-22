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

function seedGenre({ id, name, slug, description }) {
  seedOne(
    "genres",
    { _id: id },
    {
      _id: id,
      name,
      slug,
      description,
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
  db.mangas.updateOne(
    { _id: id },
    {
      $set: {
        genres,
      },
      $setOnInsert: {
        _id: id,
        title,
        author,
        description,
        status,
        chaptersCount,
        previewKey: `previews/${id}/${id}.png`,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
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

const genres = [
  {
    id: oid("69b1a3204cf95764efd309ba"),
    name: "Mystery",
    slug: "mystery",
    description: "Stories revolving around solving crimes or uncovering secrets.",
  },
  {
    id: oid("69b1a3204cf95764efd309bd"),
    name: "Supernatural",
    slug: "supernatural",
    description:
      "Stories involving paranormal forces like ghosts, demons, or spirits.",
  },
  {
    id: oid("69b1a3204cf95764efd309b8"),
    name: "Romance",
    slug: "romance",
    description:
      "Stories centered around romantic relationships and emotional connections.",
  },
  {
    id: oid("69b1a3204cf95764efd309bf"),
    name: "Slice of Life",
    slug: "slice-of-life",
    description:
      "Stories depicting everyday life and realistic character interactions.",
  },
  {
    id: oid("69b1a3204cf95764efd309c2"),
    name: "Isekai",
    slug: "isekai",
    description: "Characters transported or reincarnated into another world.",
  },
  {
    id: oid("69b1a3204cf95764efd309c4"),
    name: "Post-Apocalyptic",
    slug: "post-apocalyptic",
    description:
      "Stories set after the collapse of civilization or global catastrophe.",
  },
  {
    id: oid("69b1a3204cf95764efd309b2"),
    name: "Action",
    slug: "action",
    description:
      "Fast-paced stories featuring fights, battles, and intense physical conflict.",
  },
  {
    id: oid("69b1a3204cf95764efd309b4"),
    name: "Comedy",
    slug: "comedy",
    description: "Humorous stories meant to entertain and make audiences laugh.",
  },
  {
    id: oid("69b1a3204cf95764efd309b6"),
    name: "Fantasy",
    slug: "fantasy",
    description:
      "Stories set in magical worlds with supernatural creatures and powers.",
  },
  {
    id: oid("69b1a3204cf95764efd309b7"),
    name: "Science Fiction",
    slug: "science-fiction",
    description:
      "Futuristic stories involving advanced technology, space, or speculative science.",
  },
  {
    id: oid("69b1a3204cf95764efd309b9"),
    name: "Horror",
    slug: "horror",
    description:
      "Stories designed to scare, disturb, or create suspense and dread.",
  },
  {
    id: oid("69b1a3204cf95764efd309bb"),
    name: "Thriller",
    slug: "thriller",
    description:
      "High-tension stories with suspense, danger, and unexpected twists.",
  },
  {
    id: oid("69b1a3204cf95764efd309bc"),
    name: "Psychological",
    slug: "psychological",
    description:
      "Stories exploring mental states, emotions, and psychological conflict.",
  },
  {
    id: oid("69b1a3204cf95764efd309c1"),
    name: "Mecha",
    slug: "mecha",
    description:
      "Stories featuring giant robots, advanced machinery, and mechanical warfare.",
  },
  {
    id: oid("69b1a3204cf95764efd309c3"),
    name: "Cyberpunk",
    slug: "cyberpunk",
    description:
      "High-tech dystopian futures with cybernetics, AI, and societal collapse.",
  },
  {
    id: oid("69b1a3204cf95764efd309b3"),
    name: "Adventure",
    slug: "adventure",
    description: "Stories focused on journeys, exploration, and exciting quests.",
  },
  {
    id: oid("69b1a3204cf95764efd309b5"),
    name: "Drama",
    slug: "drama",
    description:
      "Character-driven stories focused on emotional development and conflict.",
  },
  {
    id: oid("69b1a3204cf95764efd309be"),
    name: "Historical",
    slug: "historical",
    description:
      "Stories set in past historical periods or inspired by real events.",
  },
  {
    id: oid("69b1a3204cf95764efd309c0"),
    name: "Sports",
    slug: "sports",
    description:
      "Stories centered around athletes, competitions, and sports teams.",
  },
  {
    id: oid("69b1a3204cf95764efd309c5"),
    name: "Martial Arts",
    slug: "martial-arts",
    description:
      "Stories centered around combat techniques, warriors, and martial traditions.",
  },
];

const genreIds = Object.fromEntries(
  genres.map((genre) => [genre.name, genre.id]),
);

const mangas = [
  {
    id: oid("66f000000000000000000001"),
    title: "One Piece",
    author: "Eiichiro Oda",
    description: "Mock manga",
    genres: [genreIds.Adventure, genreIds.Action, genreIds.Fantasy],
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
    genres: [genreIds.Action, genreIds.Adventure, genreIds.Supernatural],
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

genres.forEach((genre) => {
  seedGenre(genre);
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
