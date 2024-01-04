import db from "@/db/connection";
import { UserNew, users } from "@/db/schema/users";
import { hashUserPassword } from "@/utils/bcrypt";
import { AuthSignUpSchema } from "@/zod/auth";

/**
 * Service used for handling Authentication functionality
 **/
class Auth {
  async signUp(newUser: UserNew) {
    try {
      // todo: rethink approach
      // todo: fix parsing of the received fields
      const validateProvidedDetails = AuthSignUpSchema.safeParse({
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        password: newUser.password,
      });

      if (!validateProvidedDetails.success) {
        return {
          errors: validateProvidedDetails.error.flatten().fieldErrors,
          message:
            "Missing or incorrect fields provided! Failed creating new user.",
        };
      }

      // Hash the password before storing the data in the database
      const hashedPassword: string = await hashUserPassword(newUser.password);
      console.log("hashed password", hashedPassword);

      // Save the user in the database
      await db.insert(users).values({ ...newUser, password: hashedPassword });
    } catch (error: any) {
      console.log("Failed creating new user!", error?.message);
    }
  }
}

const AuthService = new Auth();

export default AuthService;
