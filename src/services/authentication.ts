import "dotenv/config";

import db from "@/db/connection";
import { User, UserNew, userPasswordResets, users } from "@/db/schema/users";
import { compareUserPassword, hashUserPassword } from "@/utils/bcrypt";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { eq } from "drizzle-orm";
import EmailService, { EMAIL_TEMPLATES_PASSWORD_RESET } from "./email";
import TokenService from "./token";

/**
 * Service used for handling Authentication functionality
 **/
class Auth {
  async signIn(email: string, password: string, remember_me: boolean) {
    try {
      // Check if the user with the provided email exists in the database
      const targetedUser: User[] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!targetedUser.length) throw new Error("Invalid credentials!");

      // Check if the password that was provided matches the hashed password saved in the database
      const checkPasswordMatch = await compareUserPassword(
        password,
        targetedUser[0].password
      );

      if (!checkPasswordMatch) throw new Error("Invalid credentials!");

      const expirationTimestamp = await TokenService.issueNewTokens(
        {
          id: targetedUser[0].id,
          role_id: targetedUser[0].role_id,
        },
        remember_me
      );

      // Update the last time when the user has signed in
      await db
        .update(users)
        .set({ last_signin: new Date() })
        .where(eq(users.id, targetedUser[0].id));

      return expirationTimestamp;
    } catch (error) {
      const errorMessage: string = handleErrorMessage(error);
      console.log(`Sign In failed for ${email}. Reason: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  async signUp(newUser: UserNew) {
    try {
      // Hash the password before storing the data in the database
      const hashedPassword: string = await hashUserPassword(newUser.password);

      // Save the user in the database
      await db.insert(users).values({ ...newUser, password: hashedPassword });
    } catch (error) {
      const errorMessage: string = handleErrorMessage(error);

      // todo: Should be saved using some logging service
      console.error(`Failed creating new user: ${errorMessage}`);

      if (errorMessage.toLowerCase().startsWith("duplicate entry")) {
        throw new Error("User already exists!");
      } else {
        throw new Error("Failed creating new user!");
      }
    }
  }

  async forgotPassword(email: string) {
    try {
      // Generate a unique token that will be associated
      // with each unique email for which a password reset was requested
      const token: string = crypto.randomUUID();

      // Store the request that was made for forgotten password
      await db.insert(userPasswordResets).values({ email, token });

      // Send the email for password reset
      await EmailService.sendEmail(
        email,
        "Password Reset",
        EMAIL_TEMPLATES_PASSWORD_RESET(token)
      );
    } catch (error) {
      const errorMessage: string = handleErrorMessage(error);
      console.log(`Failed sending password reset email: ${errorMessage}`);
      throw new Error("Failed sending password reset email!");
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Find the user whose password should be updated based on received token
      const targetedEmail = await db
        .select()
        .from(userPasswordResets)
        .where(eq(userPasswordResets.token, token));

      // Throw an error if email cannot be found
      if (!targetedEmail || !targetedEmail[0]) throw new Error("Invalid token");

      // Find the targeted user based on the email
      const targetedUser = await db
        .select()
        .from(users)
        .where(eq(users.email, targetedEmail[0].email));

      // Throw an error if no such user can be found
      if (!targetedUser || !targetedUser[0]) {
        throw new Error("Account does not exist");
      }

      // Update the password for this user
      const hashedNewPassword: string = await hashUserPassword(newPassword);
      await db
        .update(users)
        .set({ password: hashedNewPassword })
        .where(eq(users.id, targetedUser[0].id));

      console.log(
        `Password successfully updated for: ${targetedUser[0].email}`
      );

      // Remove the token & email combination from database once the password was updated
      await db
        .delete(userPasswordResets)
        .where(eq(userPasswordResets.token, token));
    } catch (error) {
      const errorMessage: string = handleErrorMessage(error);
      console.log(`Failed resetting password: ${errorMessage}`);
      throw new Error(`Failed resetting password: ${errorMessage}`);
    }
  }

  async signOut() {
    try {
      await TokenService.clearTokens();
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }
}

const AuthService = new Auth();

export default AuthService;
