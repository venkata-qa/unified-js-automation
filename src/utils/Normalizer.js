// utils/Normalizer.js
function normalizeRow(rowArr) {
  return rowArr.map(val => {
    const maybeDate = new Date(val);
    if (!isNaN(maybeDate) && val.includes(':')) {
      return maybeDate.toISOString().slice(0, 19).replace('T', ' ');
    }
    return val.trim().toLowerCase();
  }).join(',');
}

module.exports = { normalizeRow };
