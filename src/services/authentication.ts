import db from "@/db/connection";
import { UserNew, users } from "@/db/schema/users";
import { hashUserPassword } from "@/utils/bcrypt";

/**
 * Service used for handling Authentication functionality
 **/
class Auth {
  async signUp(newUser: UserNew) {
    try {
      // Hash the password before storing the data in the database
      const hashedPassword: string = await hashUserPassword(newUser.password);

      // Save the user in the database
      await db.insert(users).values({ ...newUser, password: hashedPassword });
    } catch (error: any) {
      // This would be then saved in a log (e.g. Sentry)
      console.error(`Failed creating new user: ${error.message}`);
      throw new Error("Failed creating new user!");
    }
  }
}

const AuthService = new Auth();

export default AuthService;
