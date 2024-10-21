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

    // lines is like collection of transacition in the table
    const lines = newStr
      .trim()
      .split('\n')
      .filter((str) => !['', ' '].includes(str));

    // Setting index of valid dates
    lines.forEach((val, i) => {
      if (isValidDate(val)) {
        dateIdx.push(i);
      }
    });

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i - 1;
      const currLine = dateIdx[i];
      const prevLine = dateIdx[j];
      const currDate = lines[dateIdx[i]];
      const prevDate = lines[dateIdx[j]];
      if (!prevDate) {
        //
      } else {
        const arr = lines.slice(prevLine, currLine);
        const n = arr.length;
        payload.date = arr[0]; // Setting Date
        payload.balance = arr[n - 1]; // Setting Balance

        // Setting Details
        const details = arr
          .slice(1, n - 2)
          .filter((str) => /[a-z]/i.test(str))
          .join('');
        payload.details = details;

        // Setting Amount
        const amt = arr.slice(1, n - 1).find((str) => !/[a-z]/i.test(str));
        if (amt) {
          payload.amt = amt;
        }
        transactions.push(payload);
        payload = {};
      }
    }
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
