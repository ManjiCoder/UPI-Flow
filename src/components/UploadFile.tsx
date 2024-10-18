/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as pdfjsLib from 'pdfjs-dist';
import { useState } from 'react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `http://localhost:5173/pdf.worker.mjs`;

export function UploadFile() {
  const [text, setText] = useState('');
  const extractText = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;

      try {
        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer,
          password: 'NARE0512',
        }).promise;
        console.log(`Number of pages: ${pdf.numPages}`);

        // Loop through all the pages and extract text
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          const extractedText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          console.log(`Page ${pageNum} text: ${extractedText}`);
          setText(extractedText);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  };

  return (
    <div className='grid mx-auto w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='picture'>Select PDF</Label>
      <Input
        id='picture'
        type='file'
        accept='application/pdf'
        onChange={extractText}
      />
      {text}
    </div>
  );
}
