import { banks } from '@/types/constant';
import { isValid, parse } from 'date-fns';
interface Transaction {
  date?: string;
  mode?: string;
  details?: string;
  credit?: number;
  debit?: number;
  balance?: number;
  refNo?: number;
}
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
    const newStr = str.slice(startIdx, str.length);

    const transactions: Transaction[] = [];
    const dates = newStr
      .split('\n')
      .filter((val) => val !== '' && isValidDate(val));
    console.table(dates);

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
