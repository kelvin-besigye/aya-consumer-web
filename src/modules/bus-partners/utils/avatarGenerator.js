// A smart utility that extracts the first letters of a bus company's name
// e.g., "Kampala Modern Executive" -> "KM"
export const getInitials = (name) => {
  if (!name) return "AB"; // AyaBus default
    const words = name.split(' ');
      if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        return (words[0][0] + words[1][0]).toUpperCase();
        };