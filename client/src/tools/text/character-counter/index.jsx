import ToolLayout from '../../../layouts/ToolLayout';
import Tool from './CharacterCounter';
import content from './content';

export default function Page() {
  return <ToolLayout id="character-counter" content={content}><Tool /></ToolLayout>;
}
