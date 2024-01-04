import { hashUserPassword } from "@/utils/bcrypt";
import { users } from "../schema/users";
import db from "../connection";

/** Seeds the database with mock users */
export async function seedUsers() {
  try {
    await db.insert(users).values([
      {
        email: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        password: await hashUserPassword("Test123"),
      },
      {
        email: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        password: await hashUserPassword("Password123"),
      },
      {
        email: "example@user.com",
        first_name: "Example",
        last_name: "User",
        password: await hashUserPassword("TestingPassword123"),
      },
    ]);

    process.exit(0);
  } catch (error: any) {
    console.log("Failed seeding users...");
    console.log("Error: ", error.message);
    process.exit(1);
  }
}
