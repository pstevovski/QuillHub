/**
 * Utility function for extracting the initials from the name of the user.
 *
 * @example Username of "John Doe" should provide "JD" as output.
 */
export default function getNameInitials(
  first_name: string,
  last_name: string
): string {
  let initials: string = "";

  if (first_name) initials += first_name.charAt(0).toUpperCase();
  if (last_name) initials += last_name.charAt(0).toUpperCase();

  return initials;
}
