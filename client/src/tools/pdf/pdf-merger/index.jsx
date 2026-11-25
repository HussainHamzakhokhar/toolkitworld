import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './PdfMerger';
import content from './content';

export default function Page() {
  return <ToolLayout id="pdf-merger" content={content}><Tool /></ToolLayout>;
}
