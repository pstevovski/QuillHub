import { seedUsers } from "./users";

/** Populate the database with mock data for development purposes */
async function seedDatabase() {
  await seedUsers();
}

seedDatabase();
