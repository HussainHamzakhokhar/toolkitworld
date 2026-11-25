import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './PngToJpg';
import content from './content';

export default function Page() {
  return <ToolLayout id="png-to-jpg" content={content}><Tool /></ToolLayout>;
}
