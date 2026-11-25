import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './CaseConverter';
import content from './content';

export default function Page() {
  return <ToolLayout id="case-converter" content={content}><Tool /></ToolLayout>;
}
