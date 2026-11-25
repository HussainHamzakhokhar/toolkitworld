import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './DateCalculator';
import content from './content';

export default function Page() {
  return <ToolLayout id="date-calculator" content={content}><Tool /></ToolLayout>;
}
