import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './DiscountCalculator';
import content from './content';

export default function Page() {
  return <ToolLayout id="discount-calculator" content={content}><Tool /></ToolLayout>;
}
