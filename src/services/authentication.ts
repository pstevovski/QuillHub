import "dotenv/config";

import db from "@/db/connection";
import { UserNew, userPasswordResets, users } from "@/db/schema/users";
import { hashUserPassword } from "@/utils/bcrypt";
import handleErrorMessage from "@/utils/handleErrorMessage";
import nodemailer from "nodemailer";

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

      // Send the email
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: '"Quillhub" info@quillhub.com',
        to: email,
        subject: "Password Reset",
        html: `
          <div>
            <h1>Quillhub</h1>
            <p><em>Unfold Your Imagination, Share Your Universe</em></p>
            <h3>You have requested password reset for your accout</h3>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_EMAIL_REDIRECT_URL}/auth/reset-password?token=${token}">Click here to reset your password</a>
            <br/>
            <br/>
            <br/>
            <hr/>
            <p>If you did not request password reset for your account, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      const errorMessage: string = handleErrorMessage(error);
      console.log(`Failed sending password reset email: ${errorMessage}`);
      throw new Error("Failed sending password reset email!");
    }
  }
}

const AuthService = new Auth();

export default AuthService;
