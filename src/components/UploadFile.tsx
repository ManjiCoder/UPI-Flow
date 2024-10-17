import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import pdfToText from 'react-pdftotext';
import { useNavigate } from 'react-router-dom';

export function UploadFile() {
  const navigation = useNavigate();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const extractText = async (event) => {
    const file = event.target.files[0];
    try {
      const text = await pdfToText(file);
      console.log(text);
      navigation('/records');
    } catch (error) {
      console.error('Failed to extract text from pdf', error);
    }
  };
  return (
    <div className='grid mx-auto w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='picture'>Select PDF</Label>
      <Input id='picture' type='file' onChange={extractText} />
    </div>
  );
}
