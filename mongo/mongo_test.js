import "dotenv/config.js";
import { MongoClient } from "mongodb";

const uri = process.env.MONGOURI;
const client = new MongoClient(uri);
let db;

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to the MongoDB database");
    db = client.db(process.env.MONGODBNAME);

    const movies = await db
      .collection("movies")
      .find({ title: { $regex: "Despicable", $options: "i" } })
      .project({ title: 1 })
      .toArray();

    console.log(movies);
    debugger;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

const e1a = async () => {
  // return all movies released after the year 2000
  return db
    .collection("movies")
    .find({ year: { $gt: 2000 } })
    .project({ title: 1, year: 1 })
    .toArray();
};

const e1b = async () => {
  // all distinct languages in all movies
  return db.collection("movies").distinct("languages");
};

const e1c = async () => {
  // Find all PG-13 movies casting Ryan Gosling , sorted by release date
  return db
    .collection("movies")
    .find({ rated: "PG-13", cast: "Ryan Gosling" })
    .sort({ released: 1 })
    .project({ title: 1, rated: 1, cast: 1, released: 1 })
    .toArray();
};

const e1d = async () => {
  // Find number of movies per genre.
  return db
    .collection("movies")
    .aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres", count: { $sum: 1 } } },
    ])
    .toArray();
};

const e1e = async () => {
  // Insert a movie. Give it whatever title you want, and your name as the Director
  return db
    .collection("movies")
    .insertOne({ title: "My new movie", directors: ["Yuna Hu"] });
};

const run = async () => {
  await connectToMongo();

  console.log(`All movies after year 2000 ----->`);
  console.log(await e1a());

  console.log(`All distinct languages in all movies ----->`);
  console.log(await e1b());

  console.log(
    `All PG-13 movies casting Ryan Gosling , sorted by release date ----->`
  );
  console.log(await e1c());

  console.log(`number of movies per genre. ----->`);
  console.log(await e1d());

  console.log(`Insert a movie ----->`);
  console.log(await e1e());

  client.close();
};

run();
