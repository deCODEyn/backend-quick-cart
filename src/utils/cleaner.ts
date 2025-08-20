export const cleanNumericString = (value: string): string => {
  return value.replace(/\D/g, '');
};
