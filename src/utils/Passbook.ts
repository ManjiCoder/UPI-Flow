import { banks, PaymentModes, Transaction } from '@/types/constant';
import { isValid, parse } from 'date-fns';

function emptyCheck(): (
  value: string,
  index: number,
  array: string[]
) => unknown {
  return (str) => !['', ' '].includes(str.trim());
}

const isValidDate = (dateStr: string, format = 'dd-MM-yyyy') => {
  const parsedDate = parse(dateStr, format, new Date());
  return isValid(parsedDate);
};

const stringToNumber = (str: string) => {
  return parseFloat(str.replaceAll(',', ''));
};

const extractRow = (arr: string[], id: number, bankId: number) => {
  const payload: Transaction = {
    id,
    date: '',
    balance: 0,
  };
  const n = arr.length;
  payload.date = parse(arr[0], 'dd-MM-yyyy', new Date()).toISOString(); // Setting Date
  payload.balance = stringToNumber(arr[n - 1]); // Setting Balance
  payload.bankId = bankId;

  // Setting Details
  const details = arr
    .slice(1, n - 2)
    .filter((str) => /[a-z]/i.test(str))
    .join('');
  payload.details = details;

  if (details.trim().length === 0) {
    payload.details = arr
      .slice(1, n)
      .filter((str) => /[a-z]/i.test(str))
      .join('');
  }

  // Setting referral number of transaction
  const refNo = details.includes(':')
    ? details.split(':')[0]
    : details
        .split('/')
        .filter((char) => !/[a-z]|[-\/]/i.test(char))
        .join('');

  if (refNo.length !== 0) {
    payload.refNo = refNo;
  }

  // Setting Mode of Transaction
  const mode = Object.keys(PaymentModes).find((method) =>
    arr
      .slice(1, n - 2)
      .join('')
      .toLowerCase()
      .includes(method.replaceAll('_', '').toLowerCase())
  );

  if (mode) {
    // @ts-ignore
    payload.mode = PaymentModes[mode];
    // @ts-ignore
    if (PaymentModes[mode] === PaymentModes.CASH) {
      if (refNo.trim().length === 0) {
        payload.refNo = details.split('/')[1];
      }
    }
  }

  // Setting Amount
  const amt = arr.slice(1, n).find((str) => !/[a-z]|[-\\/]/i.test(str));
  if (amt) {
    payload.amt = stringToNumber(amt);
  }

  return payload;
};

const generateICICIRecords = (str: string, bankId: number) => {
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
    const lines = newStr
      .trim()
      .split('\n')
      .filter(emptyCheck())
      .flatMap((str) => str.split(' '));

    // Setting index of valid dates
    lines.forEach((val, i) => {
      if (isValidDate(val) && /[a-z]/i.test(lines[i + 1])) {
        dateIdx.push(i);
      }
    });
    // console.log(lines);

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i + 1;
      const currLine = dateIdx[i];
      const nextLine = dateIdx[j];

      if (!nextLine) {
        let counter = 0;
        let lastBal = 0;
        lines.slice(currLine + 1, currLine + 20).filter((str, idx) => {
          if (!/[a-z]|[-\\/]/i.test(str)) {
            counter += 1;
            if (counter === 2) {
              lastBal = currLine + 1 + idx;
            }
          }
        });
        const arr = lines.slice(currLine, lastBal + 1);
        const rowData = extractRow(arr, transactions.length + 1, bankId);
        transactions.push(rowData);
      } else {
        let arr = lines.slice(currLine, nextLine);
        if (arr.includes('Page')) {
          // @ts-ignore
          arr = arr.slice(arr, arr.indexOf('Page'));
        }
        const rowData = extractRow(arr, transactions.length + 1, bankId);
        transactions.push(rowData);
      }
    }

    // Settings credit or debit
    for (let i = 0; i < transactions.length; i++) {
      let j = i - 1;
      const currRow = transactions[i];
      const prevRow = transactions[j];
      if (!prevRow) {
        // @ts-ignore
        if (currRow.balance < transactions[i + 1].balance) {
          currRow.credit = currRow.amt;
        } else {
          currRow.debit = currRow.amt;
        }
      } else {
        // @ts-ignore
        if (currRow.balance > prevRow.balance) {
          currRow.credit = currRow.amt;
        } else {
          currRow.debit = currRow.amt;
        }
      }
      delete currRow.amt;
    }
    // console.table(dateIdx.map((str) => lines[str]));
    return transactions;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const extractRowPaytm = (arr: string[], id: number, bankId: number) => {
  const payload: Transaction = {
    id: 0,
    date: '',
    balance: 0,
  };
  const n = arr.length;
  const date = new Date(arr.slice(0, 2).join()).toISOString();
  payload.date = date; // setting date
  payload.details = arr[arr.length - 1]; // settings details
  payload.balance = stringToNumber(arr[n - 2].replace('Rs.', '')); // settings balance
  payload.amt = stringToNumber(arr[n - 3].replace('Rs.', '')); // settings amount

  // setting credit or debit
  arr[n - 4] === '+'
    ? (payload.credit = payload.amt)
    : (payload.debit = payload.amt);

  // setting refno
  const refNo = arr.find((line) => /Reference Number/.test(line));
  if (refNo) {
    payload.refNo = refNo.split(': ')[1];
  }
  if (!refNo) {
    const transactionId = arr.find((line) => /Transaction ID/.test(line));
    payload.refNo = transactionId?.split(': ')[1];
  }

  console.log(payload.refNo);
  return payload;
};
const generatePaytmRecords = (str: string, bankId: number) => {
  try {
    const transactions: Transaction[] = [];
    const dateIdx: number[] = [];
    const target =
      '\nDATE & TIME\n \nTRANSACTION DETAILS\n \nAMOUNT\n \nAVAILABLE BALANCE\n';
    const isTarget = str.includes(target);
    if (!isTarget) throw new Error('Invalid records!');
    const startIdx = str.indexOf(target) + target.length;
    const newStr = str.slice(startIdx, str.length);
    const lines = newStr.split('\n').filter(emptyCheck());
    lines.forEach((line, i) => {
      if (isValidDate(line, 'dd MMM yyyy')) {
        dateIdx.push(i);
      }
    });

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i + 1;
      const currLine = dateIdx[i];
      const nextLine = dateIdx[j];

      if (!nextLine) {
        // console.log(currLine, nextLine);
      } else {
        const arr = lines.slice(currLine, nextLine).slice(0, 10);
        const row = extractRowPaytm(arr, transactions.length, bankId);
        transactions.push(row);
      }
    }

    return transactions;
    // console.log(dateIdx.map((val) => lines[val]));
  } catch (error) {
    return false;
  }
};

// Main Function
function passbook(str: string) {
  if (str.includes(banks.icici.name)) {
    return generateICICIRecords(str, banks.icici.id);
  } else if (str.includes(banks.sbi.name)) {
    // TODO: SBI Function
  } else if (str.includes(banks.paytm.name)) {
    return generatePaytmRecords(str, banks.paytm.id);
  }
}

export default passbook;
