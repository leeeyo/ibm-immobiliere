#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ibm-immobiliere";
const OUTPUT_PATH = path.join(process.cwd(), "lib", "seed", "data.json");
const CONTENT_COLLECTIONS = [
  "projects",
  "properties",
  "blogposts",
  "testimonials",
  "partners",
];

function cleanDocument(document) {
  const clean = { ...document };
  delete clean._id;
  delete clean.__v;
  delete clean.updatedAt;
  return clean;
}

function sortDocuments(collection, documents) {
  const key =
    collection === "testimonials"
      ? "clientName"
      : collection === "partners"
        ? "name"
        : "slug";

  return documents.sort((left, right) =>
    String(left[key] || "").localeCompare(String(right[key] || ""), "fr")
  );
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    const db = mongoose.connection.db;
    const projects = await db.collection("projects").find({}).toArray();
    const projectSlugs = new Map(
      projects.map((project) => [String(project._id), project.slug])
    );
    const seedData = {};

    for (const collection of CONTENT_COLLECTIONS) {
      const source =
        collection === "projects"
          ? projects
          : await db.collection(collection).find({}).toArray();

      const documents = source.map((document) => {
        const clean = cleanDocument(document);

        if (collection === "properties") {
          if (clean.projectId) {
            clean.projectSlug = projectSlugs.get(String(clean.projectId));
          }
          delete clean.projectId;
        }

        return clean;
      });

      seedData[collection] = sortDocuments(collection, documents);
    }

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(seedData, null, 2)}\n`, "utf8");

    const counts = Object.fromEntries(
      CONTENT_COLLECTIONS.map((collection) => [
        collection,
        seedData[collection].length,
      ])
    );
    console.log("Seed data exported:", path.relative(process.cwd(), OUTPUT_PATH));
    console.log("Collection counts:", counts);
  } catch (error) {
    console.error("Seed export failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

if (require.main === module) run();

module.exports = { run };
