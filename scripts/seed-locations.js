#!/usr/bin/env node
const mongoose = require("mongoose");
const slugify = require("slugify");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ibm-immobiliere";

const LOCATIONS = [
  "Riadh el Andalous",
  "Boumhel",
  "Mghira",
  "Borj cedria",
  "Mrezga",
  "L'Aaouina",
];

function makeSlug(input) {
  return slugify(input || "", {
    lower: true,
    strict: true,
    locale: "fr",
    trim: true,
  }).slice(0, 90);
}

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected.");

    const now = new Date();
    const collection = mongoose.connection.db.collection("locations");
    const desiredSlugs = LOCATIONS.map(makeSlug);

    for (const [index, name] of LOCATIONS.entries()) {
      const slug = makeSlug(name);
      await collection.updateOne(
        { slug },
        {
          $set: {
            name,
            slug,
            active: true,
            sortOrder: index + 1,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true },
      );
    }

    const deactivated = await collection.updateMany(
      { slug: { $nin: desiredSlugs }, active: true },
      { $set: { active: false, updatedAt: now } },
    );

    console.log("Upserted active locations:", LOCATIONS.length);
    console.log("Deactivated other locations:", deactivated.modifiedCount || 0);
  } catch (error) {
    console.error("Location seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
    console.log("Done.");
  }
}

if (require.main === module) run();

module.exports = { LOCATIONS, run };
