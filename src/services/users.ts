import { User, users } from "@/db/schema/users";
import TokenService from "./token";
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { ApiErrorMessage } from "@/app/api/handleApiError";

class Users {
  /** Gets the details of the currently logged in user */
  async getCurrentUser(): Promise<User> {
    try {
      // Decode the token saved as a cookie upon signin
      const { user_id } = await TokenService.decodeToken();

      // Get the user from the database or throw an error if user cannot be found
      const user: User[] = await db
        .select()
        .from(users)
        .where(eq(users.id, user_id));

      if (!user || !user[0]) throw new Error(ApiErrorMessage.NOT_FOUND);

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
