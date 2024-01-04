import { compare, hash } from "bcrypt";

/** Hash the provided password value before storing it in a database */
export async function hashUserPassword(password: string): Promise<string> {
  const hashedPassword: string = await hash(password, 10);
  return hashedPassword;
}

/**
 * Compare the password that is provided by user input, with the hashed password saved in the database.
 * If the comparison passes, the password is correct. Otherwise, invalid credentials were used.
 **/
export async function compareUserPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isPasswordMatching: boolean = await compare(password, hashedPassword);
  return isPasswordMatching;
}
