export const getLineBackgroundColor = (lineName: string) => {
  const lowerName = lineName.toLowerCase();
  switch (lowerName) {
    case "u1":
      return "bg-metro-u1";
    case "u2":
      return "bg-metro-u2";
    case "u3":
      return "bg-metro-u3";
    case "u4":
      return "bg-metro-u4";
    case "u5":
      return "bg-metro-u5";
    case "u6":
      return "bg-metro-u6";
    default:
      return "bg-black";
  }
};
