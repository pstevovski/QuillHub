import db from "../connection";
import { users } from "../schema/users";

/** Seeds the database with mock users */
export async function seedUsers() {
  try {
    await db.insert(users).values([
      {
        email: "john@doe.com",
        first_name: "John",
        last_name: "Doe",
        password: "12345678",
      },
      {
        email: "jane@doe.com",
        first_name: "Jane",
        last_name: "Doe",
        password: "12345678",
      },
      {
        email: "example@user.com",
        first_name: "Example",
        last_name: "User",
        password: "12345678",
      },
    ]);

    process.exit(0);
  } catch (error: any) {
    console.log("Error: ", error.message);
    process.exit(1);
  }
}
