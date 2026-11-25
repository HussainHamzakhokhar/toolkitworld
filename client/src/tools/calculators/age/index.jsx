import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './AgeCalculator';
import content from './content';

export default function Page() {
  return <ToolLayout id="age-calculator" content={content}><Tool /></ToolLayout>;
}
