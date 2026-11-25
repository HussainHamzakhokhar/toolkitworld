import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './ExcelToPdf';
import content from './content';

export default function Page() {
  return <ToolLayout id="excel-to-pdf" content={content}><Tool /></ToolLayout>;
}
