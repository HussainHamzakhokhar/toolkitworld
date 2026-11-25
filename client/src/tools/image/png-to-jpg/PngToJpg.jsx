import { useState } from 'react';
import ImageConverter from '../shared/ImageConverter';

const SWATCHES = ['#FFFFFF', '#000000', '#F1F5F9', '#FDE68A'];

export default function PngToJpg() {
  const [bg, setBg] = useState('#FFFFFF');
  const [quality, setQuality] = useState(90);
  return (
    <>
      <div className="options-bar">
        <div className="field">
          <span className="field__label" id="bg-l">Background for transparent areas</span>
          <div className="swatches" role="radiogroup" aria-labelledby="bg-l">
            {SWATCHES.map((c) => (
              <button type="button" key={c} role="radio" aria-checked={bg === c} aria-label={`Background ${c}`} className={`swatch${bg === c ? ' is-active' : ''}`} style={{ background: c }} onClick={() => setBg(c)} />
            ))}
            <label className="swatch-custom">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value.toUpperCase())} aria-label="Custom background colour" />
              <span>{bg}</span>
            </label>
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="q-range">JPG quality: <strong>{quality}%</strong></label>
          <input id="q-range" type="range" min={10} max={100} step={1} value={quality} onChange={(e) => setQuality(+e.target.value)} />
          <p className="field__hint">80–92% is a good balance of quality and size. Lower = smaller file.</p>
        </div>
      </div>
      <ImageConverter toolId="png-to-jpg" accept="image/png,.png" allowedKinds={['png']} inputLabel="PNG" outputType="image/jpeg"
        background={bg} quality={quality / 100} optionsKey={`${bg}-${quality}`} />
    </>
  );
}
