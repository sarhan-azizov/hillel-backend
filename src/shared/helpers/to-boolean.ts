export const toBoolean = ({ value }) =>
  typeof value !== 'boolean' ? value === 'true' : value;
