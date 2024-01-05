import { hashUserPassword } from "@/utils/bcrypt";
import { users } from "./schema/users";
import db from "./connection";
import { roles } from "./schema/roles";

/** Seeds the database with mock users */
async function seedUsers() {
  try {
    await db.insert(users).values([
      {
        email: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        password: await hashUserPassword("Test123"),
        role_id: 2,
      },
      {
        email: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        password: await hashUserPassword("Password123"),
        role_id: 1,
      },
      {
        email: "example@user.com",
        first_name: "Example",
        last_name: "User",
        password: await hashUserPassword("TestingPassword123"),
        role_id: 1,
      },
    ]);
  } catch (error: any) {
    console.log("Failed seeding users...");
    console.log("Error: ", error.message);
    process.exit(1);
  }
}

/** Seeds the database with mock roles */
async function seedRoles() {
  try {
    await db.insert(roles).values([
      {
        name: "basic",
        label: "Basic",
        description:
          "Basic user role with access to specific subset of application features",
      },
      {
        name: "admin",
        label: "Admin",
        description:
          "Admin user role with access to specific admin-only features of the application + everything from Basic user",
      },
    ]);
  } catch (error: any) {
    console.log("Failed seeding roles...");
    console.log("Error: ", error.message);
    process.exit(1);
  }
}

/** Populate the database with mock data for development purposes */
async function seedDatabase() {
  try {
    console.log("Started seeding database...");
    console.time("Elapsed Time: ");
    await Promise.all([await seedRoles(), await seedUsers()]);
    console.log("Seeding database completed!");
    console.timeEnd("Elapsed Time: ");
    process.exit(0);
  } catch (error: any) {
    console.log("Failed seeding database!");
    console.log("");
    console.log("Error: ", error.message);
    process.exit(1);
  }
}

seedDatabase();
