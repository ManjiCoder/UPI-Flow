import { banks } from '@/types/constant';
import { isValid, parse } from 'date-fns';

const isValidDate = (dateStr: string) => {
  const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};

const generateICICIRecords = (str: string) => {
  const target =
    '\nDATE\n \nMODE**\n \nPARTICULARS\n \nDEPOSITS\n \nWITHDRAWALS\n \nBALANCE\n';
  const isTarget = str.includes(target);
  if (!isTarget) return false;
  // if (!isTarget) return new Error('Invalid records!');
  const startIdx = str.indexOf(target) + target.length;

  const arr = {};
  const dates: (string | number)[][] = [];
  const newStr = str.slice(startIdx, str.length);
  newStr.split('\n').filter((v, i) => {
    const isDate = isValidDate(v);
    if (isDate) {
      // console.log(v, i + v.length);
      dates.push([v, v.length + i]);
    }
  });
  const n = dates.length;
  // for (let i = 0; i < n; i++) {
  //   const d1 = dates[i][1];

  //   if (dates[i + 1]) {
  //     const d2 = dates[i + 1][1];
  //     console.log(str.slice(startIdx, str.length).slice(d1, d2));
  //   }
  // }
  // console.log(newStr.slice(11, 16));
  // console.log(newStr.slice(16, 24));
  const sample = [
    { date: dates[0][0], details: newStr.slice(0, 25) },
    { date: dates[1][0], details: newStr.slice(25, 143) },
    { date: dates[2][0], details: newStr.slice(143, 250) },
    { date: dates[3][0], details: newStr.slice(250, 340) },
    { date: dates[4][0], details: newStr.slice(340, 452) },
  ];
  console.log(sample);
  return newStr;
};

function passbook(str: string) {
  const records = [];
  if (str.includes(banks.icici)) {
    return generateICICIRecords(str);
  } else if (str.includes(banks.sbi)) {
    // TODO: SBI Function
  }
}

export default passbook;
