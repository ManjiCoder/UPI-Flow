import { banks } from '@/types/constant';
import { isValid, parse } from 'date-fns';
interface Transaction {
  date?: string;
  mode?: string;
  details?: string;
  credit?: number;
  debit?: number;
  balance?: string;
  refNo?: number | null;
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
    const dates: number[] = [];
    newStr.split('\n').forEach((val, i) => {
      if (isValidDate(val)) {
        dates.push(i);
      }
    });
    const lines = newStr.split('\n').filter((str) => str != '');
    let payload: Transaction = {};
    dates.forEach((str, i) => {
      const l1 = str;
      if (dates[i + 1]) {
        const l2 = dates[i + 1];
        const paymentInfo = lines.slice(l1 - 1, l2 - 1);
        const n = paymentInfo.length;
        paymentInfo.forEach((val, idx) => {
          if (idx === 0) {
            payload.date = val;
          } else if (idx === n - 1) {
            payload.balance = val;
          } else if (val.includes('/')) {
            if (!payload.details) {
              payload.details = val;
            } else {
              payload.details += val;
            }
          }
        });
        const refNo = payload.details
          ? payload.details.split('/').find((v) => parseInt(v))
          : null;
        payload.refNo = refNo ? parseInt(refNo) : null;
        transactions.push(payload);
        payload = {};
      }
    });
    console.log(transactions);
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
