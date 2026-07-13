#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const slugify = require("slugify");
const seedData = require("../lib/seed/data.json");

const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const RESIDENCE_ASSET_DIR = path.join(PUBLIC_DIR, "residences");
const AMIRA_PLAN_ASSET_DIR = path.join(
  PUBLIC_DIR,
  "Appart dispo Résidence amira",
);
const DRY_RUN = process.argv.includes("--dry-run");

try {
  require("@next/env").loadEnvConfig(ROOT);
} catch {
  // The script still works with an exported MONGODB_URI or the local default.
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ibm-immobiliere";

function makeSlug(input) {
  return slugify(input || "", {
    lower: true,
    strict: true,
    locale: "fr",
    trim: true,
  }).slice(0, 90);
}

function publicUrl(folder, fileName) {
  return `/${folder}/${fileName}`;
}

const AMIRA_UNITS = [
  {
    numero: "A 4-6",
    etage: "4",
    type: "S+2",
    pieces: 3,
    surface: 120.38,
    planFile: "AMIRA CELULE APP- A-4-6.pdf",
  },
  {
    numero: "B 2-2",
    etage: "2",
    type: "S+1",
    pieces: 2,
    surface: 70.71,
    planFile: "AMIRA CELULE APP- B-2-2.pdf",
  },
  {
    numero: "B 2-3",
    etage: "2",
    type: "S+2",
    pieces: 3,
    surface: 119.38,
    planFile: "AMIRA CELULE APP- B-2-3.pdf",
  },
  {
    numero: "B 3-1",
    etage: "3",
    type: "S+2",
    pieces: 3,
    surface: 123.31,
    planFile: "AMIRA CELULE APP- B-3-1.pdf",
  },
  {
    numero: "B 4-1",
    etage: "4",
    type: "S+2",
    pieces: 3,
    surface: 123.31,
    planFile: "AMIRA CELULE APP- B-4-1.pdf",
  },
  {
    numero: "E 0-1",
    etage: "RDC",
    type: "S+2",
    pieces: 3,
    surface: 122.34,
    planFile: "AMIRA CELULE APP- E-0-1.pdf",
  },
  {
    numero: "E 0-3",
    etage: "RDC",
    type: "S+2",
    pieces: 3,
    surface: 120.21,
    planFile: "AMIRA CELULE APP- E-0-3.pdf",
  },
  {
    numero: "E 1-1",
    etage: "1",
    type: "S+2",
    pieces: 3,
    surface: 122.34,
    planFile: "AMIRA CELULE APP- E-1-1.pdf",
  },
  {
    numero: "E 1-3",
    etage: "1",
    type: "S+2",
    pieces: 3,
    surface: 120.21,
    planFile: "AMIRA CELULE APP- E-1-3.pdf",
  },
  {
    numero: "E 2-2",
    etage: "2",
    type: "S+1",
    pieces: 2,
    surface: 67.72,
    planFile: "AMIRA CELULE APP- E-2-2.pdf",
  },
].map(({ planFile, ...unit }) => ({
  ...unit,
  planUrl: publicUrl("Appart dispo Résidence amira", planFile),
  status: "available",
}));

function seededProject(slug, overrides) {
  const source = seedData.projects.find((project) => project.slug === slug);
  if (!source) throw new Error(`Projet source introuvable : ${slug}`);
  return { ...source, ...overrides };
}

const RESIDENCE_PROJECTS = [
  {
    name: "Complexe Les Orangers",
    slug: "complexe-les-orangers-mrezga-nabeul",
    description:
      "Projet résidentiel IBM situé à Mrezga, dans le gouvernorat de Nabeul.",
    location: "Mrezga, Nabeul",
    // Unknown years use 0 so the existing cards omit the year instead of guessing it.
    yearCompleted: 0,
    status: "ongoing",
    propertiesCount: 0,
    type: "residential",
    featured: false,
    features: [],
    imageFile: "Complexe les orangers mrezga nabeul.webp",
  },
  {
    name: "Résidence Al Amen",
    slug: "residence-al-amen",
    description:
      "Résidence livrée par IBM à Riadh El Andalous, Ariana.",
    location: "Riadh El Andalous, Ariana",
    yearCompleted: 0,
    status: "completed",
    propertiesCount: 0,
    type: "residential",
    featured: false,
    features: [],
    imageFile: "Résidence Al amen.webp",
  },
  seededProject("residence-amira", {
    images: undefined,
    propertiesCount: AMIRA_UNITS.length,
    units: AMIRA_UNITS,
    imageFile: "Résidence Amira.webp",
  }),
  seededProject("residence-el-khalil", {
    images: undefined,
    imageFile: "Résidence el Khalil.webp",
  }),
  {
    name: "Résidence El Menyar",
    slug: "residence-el-menyar",
    description:
      "Résidence IBM à Mghira proposant des appartements résidentiels prêts à habiter.",
    location: "Mghira, Ben Arous",
    yearCompleted: 0,
    status: "completed",
    propertiesCount: 0,
    type: "residential",
    featured: false,
    features: [],
    imageFile: "Résidence el menyar.webp",
  },
  seededProject("residence-el-ons", {
    images: undefined,
    imageFile: "Résidence el ons.webp",
  }),
  seededProject("residence-ennakhil", {
    images: undefined,
    imageFile: "Résidence Ennakhil.webp",
  }),
  seededProject("residence-la-tulipe", {
    images: undefined,
    type: "residential",
    imageFile: "Résidence la tulipe.webp",
  }),
];

function validateAssets() {
  if (!fs.existsSync(RESIDENCE_ASSET_DIR)) {
    throw new Error(`Dossier d'images introuvable : ${RESIDENCE_ASSET_DIR}`);
  }
  if (!fs.existsSync(AMIRA_PLAN_ASSET_DIR)) {
    throw new Error(`Dossier de plans introuvable : ${AMIRA_PLAN_ASSET_DIR}`);
  }

  const expectedResidenceImages = new Set(
    RESIDENCE_PROJECTS.map((project) => project.imageFile),
  );
  const residenceImages = fs
    .readdirSync(RESIDENCE_ASSET_DIR)
    .filter((fileName) => /\.(avif|jpe?g|png|webp)$/i.test(fileName))
    .filter((fileName) => !fileName.toLowerCase().startsWith("fallback-"));

  const missingImages = [...expectedResidenceImages].filter(
    (fileName) => !fs.existsSync(path.join(RESIDENCE_ASSET_DIR, fileName)),
  );
  const unmappedImages = residenceImages.filter(
    (fileName) => !expectedResidenceImages.has(fileName),
  );
  const missingPlans = AMIRA_UNITS
    .map((unit) => decodeURIComponent(unit.planUrl.split("/").pop()))
    .filter((fileName) => !fs.existsSync(path.join(AMIRA_PLAN_ASSET_DIR, fileName)));

  if (missingImages.length || unmappedImages.length || missingPlans.length) {
    throw new Error(
      [
        missingImages.length ? `Images manquantes : ${missingImages.join(", ")}` : "",
        unmappedImages.length ? `Images non mappées : ${unmappedImages.join(", ")}` : "",
        missingPlans.length ? `Plans manquants : ${missingPlans.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

function printSummary() {
  console.table(
    RESIDENCE_PROJECTS.map((project) => ({
      résidence: project.name,
      localisation: project.location,
      image: project.imageFile,
      lots: project.slug === "residence-amira" ? AMIRA_UNITS.length : "-",
    })),
  );
  console.table(
    AMIRA_UNITS.map((unit) => ({
      appartement: unit.numero,
      étage: unit.etage,
      type: unit.type,
      surface: `${unit.surface} m²`,
      plan: unit.planUrl,
    })),
  );
}

async function upsertLocation(db, name, sortOrder, now) {
  const slug = makeSlug(name);
  return db.collection("locations").findOneAndUpdate(
    { slug },
    {
      $set: { name, slug, active: true, updatedAt: now },
      $setOnInsert: { sortOrder, createdAt: now },
    },
    { upsert: true, returnDocument: "after" },
  );
}

async function run() {
  try {
    validateAssets();

    if (DRY_RUN) {
      console.log("Validation réussie. Aucune écriture en base (--dry-run).\n");
      printSummary();
      return;
    }

    console.log("Connexion à MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connecté.");

    const db = mongoose.connection.db;
    const now = new Date();

    for (const [index, residence] of RESIDENCE_PROJECTS.entries()) {
      const location = await upsertLocation(db, residence.location, 100 + index, now);
      const {
        imageFile,
        createdAt: sourceCreatedAt,
        images: ignoredImages,
        ...fields
      } = residence;
      const document = {
        ...fields,
        images: [publicUrl("residences", imageFile)],
        locationId: location._id,
        updatedAt: now,
      };

      await db.collection("projects").updateOne(
        { slug: residence.slug },
        {
          $set: document,
          $setOnInsert: {
            createdAt: sourceCreatedAt ? new Date(sourceCreatedAt) : now,
          },
        },
        { upsert: true },
      );
    }

    console.log(`Résidences mises à jour : ${RESIDENCE_PROJECTS.length}`);
    console.log(`Appartements disponibles à Résidence Amira : ${AMIRA_UNITS.length}`);
    printSummary();
  } catch (error) {
    console.error("Échec du seed des résidences :", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
    if (!DRY_RUN) console.log("Terminé.");
  }
}

if (require.main === module) run();

module.exports = { AMIRA_UNITS, RESIDENCE_PROJECTS, run, validateAssets };
