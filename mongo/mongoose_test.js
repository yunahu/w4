import "dotenv/config";
import mongoose from "mongoose";

async function connectToDatabase() {
  const uri = process.env.MONGOURI;

  if (!uri) {
    throw new Error("Missing MONGOURI environment variable");
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODBNAME });
}

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  directors: { type: [String], required: true },
  genre: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Movie = mongoose.model("Movie", movieSchema);

async function getOneMovie() {
  try {
    const movies = await Movie.findOne({});
    console.log("A movie", movies);
  } catch (err) {
    console.error("Error fetching movies:", err.message);
  }
}

async function main() {
  try {
    await connectToDatabase();
    await getOneMovie();
  } catch (err) {
    console.log(`It blew up! ${err}`);
    process.exit(1);
  }
}

const e2a = async () => {
  // return all movies released after the year 2000
  return Movie.find({ year: { $gt: 2000 } }, "title year");
};

const e2b = async () => {
  // Find all distinct languages in all movies
  return Movie.distinct("languages");
};

const e2c = async () => {
  // Find all PG-13 movies casting Ryan Gosling , sorted by release date
  return Movie.find(
    { rated: "PG-13", cast: "Ryan Gosling" },
    "title rated cast released"
  ).sort("released");
};

const e2d = async () => {
  // Find number of movies per genre
  return Movie.aggregate([
    { $unwind: "$genres" },
    { $group: { _id: "$genres", count: { $sum: 1 } } },
  ]);
};

const e2e = async () => {
  // insert a movie with {your_name} as the Director, year: 2000
  return Movie.create({
    title: "My new movie",
    year: 2000,
    directors: ["Yuna Hu"],
    genre: "Family",
  });
};

const e2g = async () => {
  // all movies where {your_name} is the Director.

  return Movie.find({ directors: "Yuna Hu" }, "title year directors");
};

const run = async () => {
  await main();

  console.log(`All movies after year 2000 ----->`);
  console.log(await e2a());

  console.log(`all distinct languages in all movies ----->`);
  console.log(await e2b());

  console.log(
    `all PG-13 movies casting Ryan Gosling , sorted by release date ----->`
  );
  console.log(await e2c());

  console.log(`number of movies per genre. ----->`);
  console.log(await e2d());

  console.log(
    `Insert a movie with {your_name Yuna Hu} as the Director, year: 2000 ----->`
  );
  console.log(await e2e());

  console.log(`movies with {your_name Yuna Hu} as the Director ----->`);
  console.log(await e2g());

  mongoose.connection.close();
};

run();
