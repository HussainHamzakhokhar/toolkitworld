import ToolLayout from '../../../layouts/ToolLayout';
import PdfToOffice from '../pdf-to-word/PdfToWord';
import content from './content';

export default function Page() {
  return <ToolLayout id="pdf-to-excel" content={content}><PdfToOffice target="excel" /></ToolLayout>;
}
