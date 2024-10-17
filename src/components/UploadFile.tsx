import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import extractText from '@/utils/logic';

export function UploadFile() {
  return (
    <div className='grid mx-auto w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='picture'>Select PDF</Label>
      <Input id='picture' type='file' onChange={extractText} />
    </div>
  );
}
