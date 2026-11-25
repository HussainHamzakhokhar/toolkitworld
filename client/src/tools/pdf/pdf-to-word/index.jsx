import ToolLayout from '../../../layouts/ToolLayout';
import PdfToOffice from './PdfToWord';
import content from './content';

export default function Page() {
  return <ToolLayout id="pdf-to-word" content={content}><PdfToOffice target="word" /></ToolLayout>;
}
