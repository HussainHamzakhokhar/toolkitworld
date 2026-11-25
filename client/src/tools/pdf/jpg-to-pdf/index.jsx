import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './JpgToPdf';
import content from './content';

export default function Page() {
  return <ToolLayout id="jpg-to-pdf" content={content}><Tool /></ToolLayout>;
}
