function isString(value) {
  return typeof value === 'string';
}

function addQuotesToString(value) {
  return isString(value) ? `"${value}"` : value;
}

function formatData(value) {
  const type = typeof value;

  switch (type) {
    case 'string':
      return addQuotesToString(value);
    case 'object':
      return `'${JSON.stringify(value)}'`;
    default:
      return value;
  }
}

export default formatData;
