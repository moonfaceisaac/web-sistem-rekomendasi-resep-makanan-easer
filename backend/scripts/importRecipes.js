import fs from "fs";

import csv from "csv-parser";

import { PrismaClient } from "@prisma/client";

import JSON5 from "json5";

const prisma = new PrismaClient();

const recipes = [];

function parseCooking(text) {
  if (!text || text.trim() === "") return null;

  try {
    const cleaned = text

      .replace(/^'/, "")

      .replace(/'$/, "")

      .replace(/u'/g, '"')

      .replace(/'/g, '"');

    return JSON.parse(cleaned);
  } catch (err) {
    return {
      directions: text,
    };
  }
}

function parseNutrition(text) {
  if (!text) return null;

  try {
    const cleaned = text

      .replace(/u'/g, "'")

      .replace(/u"/g, '"')

      .replace(/\bTrue\b/g, "true")

      .replace(/\bFalse\b/g, "false")

      .replace(/\bNone\b/g, "null")

      .replace(/'/g, '"');

    return JSON5.parse(cleaned);
  } catch (err) {
    console.log("NUTRITION FAIL");

    console.log(text.slice(0, 300));

    return null;
  }
}

fs.createReadStream("./dataset/core-data_recipe.csv")

  .pipe(csv())

  .on(
    "data",

    (row) => {
      recipes.push({
        recipe_id: Number(row.recipe_id),

        title: row.recipe_name,

        imageUrl: `/images/${row.recipe_id}.jpg`,

        ingredients: row.ingredients.split("^"),

        cookingDirections: parseCooking(row.cooking_directions),

        nutritions: parseNutrition(row.nutritions),
      });
    },
  )

  .on(
    "end",

    async () => {
      try {
        const batch = 500;

        for (let i = 0; i < recipes.length; i += batch) {
          await prisma.recipe.createMany({
            data: recipes.slice(i, i + batch),

            skipDuplicates: true,
          });

          console.log(
            `Inserted:
${i}`,
          );
        }
        await prisma.$executeRaw`
        SELECT setval(
          pg_get_serial_sequence('"Recipe"', 'recipe_id'),
          (SELECT MAX(recipe_id) FROM "Recipe")
        );
      `;
        console.log("Sequence updated");
        console.log("Done");
      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }
    },
  );
