import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './WordToPdf';
import content from './content';

export default function Page() {
  return <ToolLayout id="word-to-pdf" content={content}><Tool /></ToolLayout>;
}
