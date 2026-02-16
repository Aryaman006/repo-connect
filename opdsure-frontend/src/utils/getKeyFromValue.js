const getKeyFromValue = (value,constant) => {
  for (const key in constant) {
    if (constant[key] === value) {
      return key;
    }
  }
  return null; 
};

export default getKeyFromValue;
