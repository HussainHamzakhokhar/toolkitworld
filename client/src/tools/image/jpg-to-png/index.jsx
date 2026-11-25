import ToolLayout from '../../../layouts/ToolLayout';
import ImageConverter from '../shared/ImageConverter';
import content from './content';

export default function Page() {
  return (
    <ToolLayout id="jpg-to-png" content={content}>
      <ImageConverter toolId="jpg-to-png" accept="image/jpeg,.jpg,.jpeg,.jfif" allowedKinds={['jpeg']} inputLabel="JPG" outputType="image/png" />
    </ToolLayout>
  );
}
