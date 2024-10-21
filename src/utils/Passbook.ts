import { banks, PaymentModes, Transaction } from '@/types/constant';
import { isValid, parse } from 'date-fns';

function emptyCheck(): (
  value: string,
  index: number,
  array: string[]
) => unknown {
  return (str) => !['', ' '].includes(str.trim());
}

const isValidDate = (dateStr: string) => {
  const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};

const extractRow = (arr: string[]) => {
  const payload: Transaction = {};
  const n = arr.length;
  payload.date = arr[0]; // Setting Date
  payload.balance = arr[n - 1]; // Setting Balance

  // Setting Details
  const details = arr
    .slice(1, n - 2)
    .filter((str) => /[a-z]/i.test(str))
    .join('');
  payload.details = details;

  // Setting referral number of transaction
  const refNo = details
    .split('/')
    .filter((char) => !/[a-z]/i.test(char))
    .join('');
  if (refNo.length !== 0) {
    payload.refNo = parseFloat(refNo);
  }

  // Setting Mode of Transaction
  const mode = Object.values(PaymentModes).find((method) =>
    details.toLowerCase().includes(method.toLowerCase())
  );
  if (mode) {
    payload.mode = mode;
  }

  // Setting Amount
  const amt = arr.slice(1, n).find((str) => !/[a-z]/i.test(str));
  if (amt) {
    payload.amt = amt;
  }

  return payload;
};

export const generateICICIRecords = (str: string) => {
  try {
    const transactions: Transaction[] = [];
    const dateIdx: number[] = [];

    const target =
      '\nDATE\n \nMODE**\n \nPARTICULARS\n \nDEPOSITS\n \nWITHDRAWALS\n \nBALANCE\n';
    const isTarget = str.includes(target);
    if (!isTarget) throw new Error('Invalid records!');
    const startIdx = str.indexOf(target) + target.length;
    const newStr = str.slice(startIdx, str.length);

    // lines is like collection of transacition in the table
    const lines = newStr.trim().split('\n').filter(emptyCheck());

    // Setting index of valid dates
    lines.forEach((val, i) => {
      if (isValidDate(val)) {
        dateIdx.push(i);
      }
    });
    // console.log(lines);

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i + 1;
      const currLine = dateIdx[i];
      const nextLine = dateIdx[j];

      if (!nextLine) {
        // const arr = lines.slice(currLine, lines.length - 2);
        // const rowData = extractRow(arr);
        // transactions.push(rowData);
      } else {
        const arr = lines.slice(currLine, nextLine);
        const rowData = extractRow(arr);
        transactions.push(rowData);
      }
    }
    // console.log(dateIdx.map((str) => lines[str]));
    return transactions;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Main Function
function passbook(str: string) {
  if (str.includes(banks.icici)) {
    return generateICICIRecords(str);
  } else if (str.includes(banks.sbi)) {
    // TODO: SBI Function
  }
}

export default passbook;