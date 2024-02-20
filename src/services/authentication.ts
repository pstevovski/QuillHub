import "dotenv/config";

import db from "@/db/connection";
import { User, UserNew, userPasswordResets, users } from "@/db/schema/users";
import { compareUserPassword, hashUserPassword } from "@/utils/bcrypt";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { eq } from "drizzle-orm";
import EmailService, { EMAIL_TEMPLATES_PASSWORD_RESET } from "./email";
import TokenService from "./token";
import { ApiErrorMessage } from "@/app/api/handleApiError";
import { AuthSignInFields } from "@/zod/auth";

class Auth {
  /**
   *
   * Sign in the user into the system and issue new `access` and `refresh` tokens
   *
   * @param userDetails An object containing the `email`, `password` and `remember_me` fields
   *
   */
  async signIn(userDetails: AuthSignInFields) {
    try {
      // Check if the user with the provided email exists in the database
      const targetedUser: User[] = await db
        .select()
        .from(users)
        .where(eq(users.email, userDetails.email));

      // Throw error if user cannot be found
      if (!targetedUser.length) {
        throw new Error(ApiErrorMessage.INVALID_CREDENTIALS);
      }

      // Check if the provided password matches the one saved in the database, or throw an error
      const passwordsMatch = await compareUserPassword(
        userDetails.password,
        targetedUser[0].password
      );

      if (!passwordsMatch) {
        throw new Error(ApiErrorMessage.INVALID_CREDENTIALS);
      }

      // Issue new "Access" and "Refresh" tokens
      await TokenService.issueNewTokens(
        {
          id: targetedUser[0].id,
          role_id: targetedUser[0].role_id,
        },
        userDetails.remember_me
      );

      // Update the last time when the user has signed in
      await db
        .update(users)
        .set({ last_signin: new Date() })
        .where(eq(users.id, targetedUser[0].id));
    } catch (error) {
      const errorMessage: string = handleErrorMessage(error);
      console.log(
        `Sign In failed for ${userDetails.email}. Reason: ${errorMessage}`
      );
      throw new Error(errorMessage);
    }
  }

  /**
   *
   * Sign up a new user into the system
   *
   * @param newUser An object containing the registration details for the new user
   *
   */
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
      throw new Error(errorMessage);
    }
  }

  /**
   *
   * Send an email for triggering password reset
   *
   * @param email The email to which a password reset email should be sent
   *
   */
  async forgotPassword(email: string) {
    try {
      // If theres no user whose email matches the provided value
      // then do not try to send any emails
      const user = await db.select().from(users).where(eq(users.email, email));
      if (!user || !user[0]) throw new Error(ApiErrorMessage.NOT_FOUND);

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
      throw new Error(errorMessage);
    }
  }

  /**
   *
   * Update the password for the user for whome the password reset token was issued
   *
   * @param token The unique password reset token that was issued for the user
   * @param newPassword The new password to be used for sign in
   *
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      // Check if there was a password reset requested for this token
      // Otherwise prevent any password reset actions
      const targetedEmail = await db
        .select()
        .from(userPasswordResets)
        .where(eq(userPasswordResets.token, token));

      if (!targetedEmail || !targetedEmail[0]) {
        throw new Error(ApiErrorMessage.UNAUTHORIZED);
      }

      // Find the targeted user whose password should be upated based on the email
      const targetedUser = await db
        .select()
        .from(users)
        .where(eq(users.email, targetedEmail[0].email));

      // Throw an error if no such user can be found
      if (!targetedUser || !targetedUser[0]) {
        throw new Error(ApiErrorMessage.NOT_FOUND);
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
      throw new Error(errorMessage);
    }
  }

  /** Signs out the user and removes tokens from cookies */
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
