import { banks } from '@/types/constant';
import { isValid, parse } from 'date-fns';
// const sample = [
//   { date: dates[0][0], details: newStr.slice(0, 25) },
//   { date: dates[1][0], details: newStr.slice(25, 143) },
//   { date: dates[2][0], details: newStr.slice(143, 250) },
//   { date: dates[3][0], details: newStr.slice(250, 340) },
//   { date: dates[4][0], details: newStr.slice(340, 452) },
// ];
// console.log(sample);
const isValidDate = (dateStr: string) => {
  const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};

export const generateICICIRecords = (str: string) => {
  try {
    const target =
      '\nDATE\n \nMODE**\n \nPARTICULARS\n \nDEPOSITS\n \nWITHDRAWALS\n \nBALANCE\n';
    const isTarget = str.includes(target);
    if (!isTarget) throw new Error('Invalid records!');
    const startIdx = str.indexOf(target) + target.length;

    const dates: (string | number)[][] = [];
    const newStr = str.slice(startIdx, str.length);
    newStr.split('\n').filter((v, i) => {
      const isDate = isValidDate(v);
      if (isDate) {
        console.log(v);
        dates.push([v, v.length + i]);
      }
    });
    return newStr;
  } catch (error) {
    console.log(error);
    return false;
  }
};

function passbook(str: string) {
  if (str.includes(banks.icici)) {
    return generateICICIRecords(str);
  } else if (str.includes(banks.sbi)) {
    // TODO: SBI Function
  }
}

export default passbook;
