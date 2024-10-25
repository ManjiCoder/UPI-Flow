import { setRows } from '@/redux/features/UPI/paymentsSlices';
import { useAppDispatch } from '@/redux/hooks';
import passbook from '@/utils/Passbook';
import { File } from 'buffer';
import * as PDFJS from 'pdfjs-dist';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input } from './ui/input';
import { Label } from './ui/label';
PDFJS.GlobalWorkerOptions.workerSrc = `${
  import.meta.env.VITE_BASE_URL
}/pdf.worker.mjs`;

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';

export default function UploadFile() {
  const navigator = useNavigate();
  const [pdfText, setPdfText] = useState('');
  const [pass, setPass] = useState('');
  const [isPass, setIsPass] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef: any = useRef();

  const inputFocused = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const dispatch = useAppDispatch();

  const onSuccess = (event: ProgressEvent<FileReader>) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!event.target || !event.target.result) return;
        const fileBuffer = event.target.result;
        const data = await PDFJS.getDocument({
          data: fileBuffer,
          password: pass,
        }).promise;
        const totalPages = data.numPages;

        let text = '';
        for (let i = 1; i <= totalPages; i++) {
          const page = await data.getPage(i);
          const pageText = await page.getTextContent();
          // @ts-ignore
          const textContext = pageText.items.map((obj) => obj.str).join('\n');
          text += textContext;
        }
        setPdfText(text);
        // console.log(text);
        const rows = passbook(text);
        // console.table(rows);
        if (!rows) {
          return reject('PDF invalid for logic');
        }
        dispatch(setRows(rows));
        navigator('/records');
        resolve(rows);
      } catch (error: any) {
        if (
          ['No password given', 'Incorrect Password'].includes(error.message)
        ) {
          setIsPass(true);
        }
        reject(error);
      }
    });
  };

  const proccessFile = (file: File | null) => {
    if (!file) return toast.warn('File is missing.');

    const reader = new FileReader();
    // @ts-ignore
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      const p = onSuccess(e);
      toast.promise(p, {
        pending: 'File is processing...',
        success: 'Text processed successfully',
        error: {
          render({ data }: any) {
            return data.message || 'Error occured while reading file';
          },
        },
      });
    };

    reader.onerror = (error) => {
      console.error(error, 'Error occured while reading file');
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files && e.target.files[0];
    // console.log(file, 'change');
    if (targetFile) {
      try {
        // @ts-ignore
        setFile(targetFile);
      } catch (error) {}
      // @ts-ignore
      proccessFile(targetFile);
    }
  };

  return (
    <div className='grid mx-auto w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='picture'>Select PDF</Label>
      <Input
        id='picture'
        type='file'
        accept='application/pdf'
        onChange={handleChange}
        value={''}
      />

      <AlertDialog
        open={isPass}
        onOpenChange={(open) => {
          setIsPass(open);
          inputFocused();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='line-clamp-1'>
              Enter Password{' '}
              <span className='font-normal'>
                {file ? `for ${file.name}` : ''}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className='text-balance'>
              The selected file: <b>{file?.name}</b> is password protected,
              please provide password to procced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (file) {
                proccessFile(file);
              }
            }}
            className='flex flex-col gap-y-4'
          >
            <div className='relative'>
              <Input
                type={isOpen ? 'text' : 'password'}
                onChange={(e) => setPass(e.target.value)}
                value={pass}
                autoFocus={true}
                ref={inputRef}
              />
              <Button
                type='button'
                variant='link'
                className='absolute right-0 top-0'
                onClick={() => {
                  setIsOpen(!isOpen);
                  inputFocused();
                }}
              >
                {isOpen ? <Eye /> : <EyeOff />}
              </Button>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type='submit'>Submit</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <pre className='overflow-hidden pt-10 text-sm'>{pdfText}</pre>
    </div>
  );
}
