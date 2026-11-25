import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './PdfCompressor';
import content from './content';

export default function Page() {
  return <ToolLayout id="pdf-compressor" content={content}><Tool /></ToolLayout>;
}
