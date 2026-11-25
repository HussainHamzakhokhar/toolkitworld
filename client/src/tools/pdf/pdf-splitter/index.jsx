import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './PdfSplitter';
import content from './content';

export default function Page() {
  return <ToolLayout id="pdf-splitter" content={content}><Tool /></ToolLayout>;
}
