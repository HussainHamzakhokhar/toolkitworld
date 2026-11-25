import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './PercentageCalculator';
import content from './content';

export default function Page() {
  return <ToolLayout id="percentage-calculator" content={content}><Tool /></ToolLayout>;
}
