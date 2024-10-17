import pdfToText from 'react-pdftotext';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const extractText = async (event) => {
  const file = event.target.files[0];
  try {
    const text = await pdfToText(file);
    console.log(text);
  } catch (error) {
    console.error('Failed to extract text from pdf', error);
  }
};

export default extractText;
