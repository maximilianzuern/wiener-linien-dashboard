export const formatTowards = (towards: string): string => {
  const words = towards.split(" ");
  if (words.length > 1) {
    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    const restOfString = towards.slice(towards.indexOf(" "));
    return firstWord + restOfString;
  } else {
    return towards.charAt(0).toUpperCase() + towards.slice(1).toLowerCase();
  }
};
