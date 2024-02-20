import { UserNoPassword, users } from "@/db/schema/users";
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import handleErrorMessage from "@/utils/handleErrorMessage";
import TokenService from "./token";

class Users {
  /** Gets the details of the currently logged in user */
  async getCurrentUser(): Promise<UserNoPassword> {
    try {
      const { user_id } = await TokenService.decodeToken();

      // Get the user from the database or throw an error if user cannot be found
      const user: UserNoPassword[] = await db
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
        .where(eq(users.id, user_id));

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
