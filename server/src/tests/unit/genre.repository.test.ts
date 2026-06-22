import { NotFoundError } from "@errors/Error.js";
import { GenreModel } from "@models/genre.model.js";
import { IGenreRepository } from "@repository/genre.repository.js";

jest.mock("@models/genre.model.js", () => ({
  GenreModel: {
    find: jest.fn(),
  },
}));

let repository: IGenreRepository;
const mockedGenreModel = GenreModel as jest.Mocked<typeof GenreModel>;

beforeEach(() => {
  repository = new IGenreRepository();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Genre repository", () => {
  test("getAllGenres - successfully returns genres", async () => {
    const genres = ["a", "b", "c"] as any;
    mockedGenreModel.find.mockResolvedValue(genres);

    const result = await repository.getAllGenres();

    expect(mockedGenreModel.find).toHaveBeenCalledTimes(1);
    expect(result).toBe(genres);
  });
  test("Should throw - NotFoundError if no genres found", async () => {
    const genres = [] as any;
    mockedGenreModel.find.mockResolvedValue(genres);

    await expect(repository.getAllGenres()).rejects.toThrow(NotFoundError);
  });
});
