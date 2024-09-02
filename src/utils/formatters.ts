export const formatTowards = (towards: string) => {
  const words = towards.toLowerCase().split(" ");
  return words.length > 1
    ? words[0].charAt(0).toUpperCase() + words[0].slice(1) + " " + words.slice(1).join(" ")
    : towards.charAt(0).toUpperCase() + towards.slice(1).toLowerCase();
};
