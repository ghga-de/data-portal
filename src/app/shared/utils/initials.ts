/**
 * Get initial letters from a person's name
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

/**
 * Get initial letters
 * @param name the name of a person
 * @returns the initials of the person
 */
export function getInitials(name: string | null | undefined): string | null {
  if (!name) return null;
  const nameParts = name.split(/\s+/).filter((part) => part);
  let initials = '';
  if (nameParts.length) {
    initials += nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length > 1) {
      initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    }
  }
  return initials || null;
}
