import { User, users } from "@/db/schema/users";
import TokenService from "./token";
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import handleErrorMessage from "@/utils/handleErrorMessage";

class Users {
  /** Gets the details of the currently logged in user */
  async getCurrentUser(): Promise<Omit<User, "password"> | null> {
    try {
      // Decode the token saved as a cookie upon signin
      const userToken = await TokenService.decodeToken();

      if (!userToken) return null;

      // Get the user from the database or throw an error if user cannot be found
      const user: Omit<User, "password">[] = await db
        .select({
          id: users.id,
          email: users.email,
          first_name: users.first_name,
          last_name: users.last_name,
          biography: users.biography,
          profile_picture: users.profile_picture,
          theme: users.theme,
          role_id: users.role_id,
          last_signin: users.last_signin,
        })
        .from(users)
        .where(eq(users.id, userToken.user_id));

      return user[0];
    } catch (error) {
      console.log(
        "USERS - Failed getting currently logged-in user: ",
        handleErrorMessage(error)
      );
      throw new Error(handleErrorMessage(error));
    }
  }
}

const UsersService = new Users();

export default UsersService;
