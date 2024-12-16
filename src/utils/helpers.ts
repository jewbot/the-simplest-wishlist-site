export const generateSystemName = (userName: string, title: string): string => {
  const cleanName = userName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const uniqueId = Math.random().toString().slice(2, 11);
  return `${cleanName}-${cleanTitle}-${uniqueId}`;
};