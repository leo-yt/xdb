const pickObj = (obj, keys) => {
  const picked = {};
  keys.forEach(key => {
    if (obj[key]!== undefined) {
      picked[key] = obj[key];
    }
  });
  return picked;
};

module.exports = {
  pickObj
};