import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './GpaCalculator';
import content from './content';

export default function Page() {
  return <ToolLayout id="gpa-calculator" content={content}><Tool /></ToolLayout>;
}
