/**
 * Formats the "towards" field by capitalizing the first letter of the first word and keeping the rest of the string unchanged.
 * This is needed because the Wiener Linien API returns the "towards" field sometimes in all uppercase.
 */
export const formatTowards = (towards: string): string => {
  const words = towards.split(/[\s-.]/);
  if (words.length > 1) {
    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    const restOfString = towards.slice(towards.indexOf(words[0]) + words[0].length);
    return firstWord + restOfString;
  } else {
    return towards.charAt(0).toUpperCase() + towards.slice(1).toLowerCase();
  }
};
