#!/usr/bin/env node
const mongoose = require("mongoose");
const seedData = require("../lib/seed/data.json");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ibm-immobiliere";
const TARGET_COLLECTIONS = [
  "projects",
  "properties",
  "blogposts",
  "testimonials",
  "partners",
];

function prepareDocument(source, now) {
  const document = { ...source };
  document.createdAt = source.createdAt ? new Date(source.createdAt) : now;
  document.updatedAt = now;
  return document;
}

async function replaceFixtures(db, collectionName, fixtures, identityKey, now) {
  const collection = db.collection(collectionName);

  for (const fixture of fixtures) {
    const document = prepareDocument(fixture, now);
    await collection.replaceOne(
      { [identityKey]: fixture[identityKey] },
      document,
      { upsert: true }
    );
  }

  console.log(`Upserted ${collectionName}:`, fixtures.length);
}

async function seedProjects(db, now) {
  await replaceFixtures(db, "projects", seedData.projects, "slug", now);

  const projects = await db
    .collection("projects")
    .find({ slug: { $in: seedData.projects.map((project) => project.slug) } })
    .project({ slug: 1 })
    .toArray();

  return new Map(projects.map((project) => [project.slug, project._id]));
}

async function seedProperties(db, projectIds, now) {
  const collection = db.collection("properties");

  for (const fixture of seedData.properties) {
    const { projectSlug, ...fields } = fixture;
    const document = prepareDocument(fields, now);

    if (projectSlug && projectIds.has(projectSlug)) {
      document.projectId = projectIds.get(projectSlug);
    }

    await collection.replaceOne(
      { slug: fixture.slug },
      document,
      { upsert: true }
    );
  }

  console.log("Upserted properties:", seedData.properties.length);
}

async function removeLegacyDemoContent(db) {
  await Promise.all([
    db.collection("projects").deleteMany({
      slug: { $in: ["residence-sidi-bou-said", "marina-hammamet-tower"] },
    }),
    db.collection("properties").deleteMany({
      slug: {
        $in: [
          "appartement-s3-sidi-bou-said",
          "magasin-sousse",
          "studio-moderne-la-goulette",
          "penthouse-les-jardins-de-tunis",
        ],
      },
    }),
  ]);
}

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected.");

    const db = mongoose.connection.db;
    const fresh = process.argv.includes("--fresh");

    if (fresh) {
      console.log("Clearing seeded content collections...");
      await Promise.all(
        TARGET_COLLECTIONS.map((collection) =>
          db.collection(collection).deleteMany({})
        )
      );
    } else {
      await removeLegacyDemoContent(db);
    }

    const now = new Date();
    const projectIds = await seedProjects(db, now);
    await seedProperties(db, projectIds, now);
    await replaceFixtures(
      db,
      "blogposts",
      seedData.blogposts,
      "slug",
      now
    );
    await replaceFixtures(
      db,
      "testimonials",
      seedData.testimonials,
      "clientName",
      now
    );
    await replaceFixtures(db, "partners", seedData.partners, "name", now);

    console.log("Seeding finished successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
    console.log("Done.");
  }
}

if (require.main === module) run();

module.exports = { run };
