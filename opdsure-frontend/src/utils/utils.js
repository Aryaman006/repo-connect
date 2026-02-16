import dayjs from 'dayjs';
import 'dayjs/locale/en-gb'; 
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function getOrdinal(day) {
  const j = day % 10;
  const k = Math.floor(day % 100 / 10);
  if (k === 1) return `${day}th`;
  if (j === 1) return `${day}st`;
  if (j === 2) return `${day}nd`;
  if (j === 3) return `${day}rd`;
  return `${day}th`;
}

const Utils = {
  DateFormat: (date) => {
    return dayjs(date).format('DD/MM/YYYY');
  },
  DateFormatOrdinal: (date) => {
   
    const parsedDate = dayjs(date);
    const day = parsedDate.date(); 
    const month = parsedDate.format('MMM'); 
    const year = parsedDate.year(); 
    return `${getOrdinal(day)} ${month} ${year}`;
  },
};

export default Utils;
