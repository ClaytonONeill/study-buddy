// Helper methods
export const formatLevel = (level: string): string => {
  if (!level) return "";
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
};

export const getLevelStyles = (level: string): string => {
  switch (level.toLowerCase()) {
    case "beginner":
    case "easy":
      return "bg-green-100 text-green-800 border-green-300";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "advanced":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const formatUserRole = (role: string) =>
  role.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
