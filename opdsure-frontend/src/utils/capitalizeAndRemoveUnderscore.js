const CapitalizeFirstLetterAndRemoveUnderscore = (str) => {
    if (typeof str !== 'string' || str.length === 0) return '';
    
    const words = str.toLowerCase().split('_');
    
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    return capitalizedWords.join(' ');
  };
export default CapitalizeFirstLetterAndRemoveUnderscore;
  