import { User, users } from "@/db/schema/users";
import TokenService from "./token";
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import handleErrorMessage from "@/utils/handleErrorMessage";

class Users {
  /** Gets the details for the currently logged in user */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Decode the token saved as a cookie upon signin
      const userToken = await TokenService.decodeToken();
      const userID = userToken?.id as number;

      if (!userID) return null;

      // Get the user from the database
      const user: User[] = await db
        .select()
        .from(users)
        .where(eq(users.id, userID));

      if (!user || !user[0]) return null;

      return user[0];
    } catch (error) {
      throw new Error(
        `Failed getting currently logged-in user: ${handleErrorMessage(error)}`
      );
    }
  }
}

const UsersService = new Users();

export default UsersService;
