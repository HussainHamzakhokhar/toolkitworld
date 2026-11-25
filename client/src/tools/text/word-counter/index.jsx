import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './WordCounter';
import content from './content';

export default function Page() {
  return <ToolLayout id="word-counter" content={content}><Tool /></ToolLayout>;
}
