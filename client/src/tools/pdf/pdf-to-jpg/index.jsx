import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './PdfToJpg';
import content from './content';

export default function Page() {
  return <ToolLayout id="pdf-to-jpg" content={content}><Tool /></ToolLayout>;
}
