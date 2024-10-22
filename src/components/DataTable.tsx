import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppSelector } from '@/redux/hooks';

export function DataTable() {
  const invoices = useAppSelector((state) => state.payments);
  const totalAmt = invoices.reduce((x, y) => {
    // @ts-ignore
    return { balance: x.balance + y.balance };
  }).balance;
  console.log(totalAmt);
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[200px]'>Date</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Ref No.</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead className='text-right'>Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, i) => (
          <TableRow key={i}>
            <TableCell className='font-medium'>{invoice.date}</TableCell>
            <TableCell>{invoice.mode || '-'}</TableCell>
            <TableCell>{invoice.refNo || '-'}</TableCell>
            <TableCell>{invoice.credit || '-'}</TableCell>
            <TableCell>{invoice.debit || '-'}</TableCell>
            <TableCell className='text-right'>{invoice.balance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className='text-right'>{totalAmt}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
