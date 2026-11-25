import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './TextComparer';
import content from './content';

export default function Page() {
  return <ToolLayout id="text-comparer" content={content}><Tool /></ToolLayout>;
}
