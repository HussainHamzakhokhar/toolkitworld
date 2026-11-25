import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './ImageResizer';
import content from './content';

export default function Page() {
  return <ToolLayout id="image-resizer" content={content}><Tool /></ToolLayout>;
}
