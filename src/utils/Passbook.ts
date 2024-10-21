import { banks } from '@/types/constant';
import { isValid, parse } from 'date-fns';
interface Transaction {
  date?: string;
  mode?: string;
  details?: string;
  credit?: string;
  debit?: string;
  balance?: string;
  refNo?: number | null;
  amt?: string;
}

const isValidDate = (dateStr: string) => {
  const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};

export const generateICICIRecords = (str: string) => {
  try {
    const transactions: Transaction[] = [];
    const dateIdx: number[] = [];
    let payload: Transaction = {};

    const target =
      '\nDATE\n \nMODE**\n \nPARTICULARS\n \nDEPOSITS\n \nWITHDRAWALS\n \nBALANCE\n';
    const isTarget = str.includes(target);
    if (!isTarget) throw new Error('Invalid records!');
    const startIdx = str.indexOf(target) + target.length;
    const newStr = str.slice(startIdx, str.length);
    const lines = newStr
      .trim()
      .split('\n')
      .filter((str) => !['', ' '].includes(str));

    lines.forEach((val, i) => {
      if (isValidDate(val)) {
        dateIdx.push(i);
      }
    });

    console.log(lines);
    return transactions;
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
