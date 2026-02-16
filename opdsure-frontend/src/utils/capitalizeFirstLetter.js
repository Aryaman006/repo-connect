const capitalizeFirstLetter = (str) => {
    if (typeof str !== 'string' || str.length === 0) return '';
    str = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    
    return str.replace("_"," ");
  };

export default capitalizeFirstLetter;