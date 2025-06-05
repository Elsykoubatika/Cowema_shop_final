
/**
 * Removes diacritics (accents) from a string
 * @param str - The input string with potential diacritics
 * @returns The string without diacritics
 */
export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * CSS classes to hide scrollbars while maintaining scroll functionality
 */
export const hideScrollbarStyles = `
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
`;
