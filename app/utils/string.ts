export const getInitialsName = (name: string, charsAmount = 2): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, charsAmount)
    .join('');
