import { isValid, parse } from 'date-fns';

class Passbook {
  private records: string;
  private isValidDate(dateStr: string) {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    return isValid(parsedDate);
  }
  constructor(parameters: any) {
    this.records = parameters;
  }
  getRecordsICICI() {
    const str = this.records;
    const target = `
DATE
 
MODE**
 
PARTICULARS
 
DEPOSITS
 
WITHDRAWALS
 
BALANCE

`;
    const isTarget = str.includes(target);
    if (!isTarget) return new Error('Invalid records target not found!');
    const startIdx = str.indexOf(target) + target.length;
    const arr = str.slice(startIdx, str.length).split('\n');
    const payload = {};
    arr.forEach((val) => {
      console.log(val);
      const isValidDateStr = this.isValidDate(val);
    });
  }
}

export default Passbook;
