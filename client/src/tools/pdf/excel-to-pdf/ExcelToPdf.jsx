import { useState } from 'react';
import { ArrowRight, Download, Loader2, Sheet, Wand2 } from 'lucide-react';
import { Alert, Dropzone, FileBar, PrivacyNote } from '../../../components/ui';
import { readWorkbook, sheetsToPdf } from '../../../utils/convert';
import { downloadBlob, safeBaseName } from '../../../utils/download';
import { formatBytes, formatNumber } from '../../../utils/format';
import useTrackOnce from '../../../hooks/useTrackOnce';

const MAX = 50 * 1024 * 1024;
const MAX_CELLS = 200_000;

export default function ExcelToPdf() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [chosen, setChosen] = useState(new Set());
  const [opts, setOpts] = useState({ orientation: 'auto', pageSize: 'A4', gridlines: true, headerRow: true });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const trackUse = useTrackOnce('excel-to-pdf');

  async function onFiles([f]) {
    setError(''); setResult(null);
    if (f.size === 0) return setError('This file is empty.');
    if (f.size > MAX) return setError('This spreadsheet is larger than 50 MB.');
    if (!/\.(xlsx|xlsm|xls|ods|csv)$/i.test(f.name)) return setError('Please choose an Excel (.xlsx, .xls), OpenDocument (.ods) or CSV file.');
    setBusy(true);
    try {
      const list = await readWorkbook(await f.arrayBuffer());
      setFile(f); setSheets(list);
      setChosen(new Set(list.map((s, i) => (s.cols ? i : -1)).filter((i) => i >= 0)));
    } catch (e) { setError(e.message); }
    setBusy(false);
  }

  const selected = sheets.filter((_, i) => chosen.has(i));
  const cells = selected.reduce((s, sh) => s + sh.rows.length * sh.cols, 0);

  async function convert() {
    setBusy(true); setError(''); setResult(null);
    try {
      const blob = await sheetsToPdf(selected, opts);
      setResult({ blob });
      trackUse({ sheets: selected.length });
    } catch (e) { setError(e.message || 'The PDF could not be created.'); }
    setBusy(false);
  }
  const set = (k, v) => { setOpts({ ...opts, [k]: v }); setResult(null); };
  const first = selected.find((s) => s.rows.length);

  if (!file) {
    return (
      <div className="tool">
        <Dropzone accept=".xlsx,.xlsm,.xls,.ods,.csv" onFiles={onFiles} title="Choose a spreadsheet" hint="XLSX, XLS, ODS or CSV · up to 50 MB" disabled={busy} />
        <PrivacyNote />
        {busy && <p className="tool__placeholder"><Loader2 size={16} className="spin" aria-hidden="true" /> Reading spreadsheet…</p>}
        {error && <Alert type="error">{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="tool">
      <FileBar icon={Sheet} color="green" name={file.name} meta={`${formatBytes(file.size)} · ${sheets.length} sheet${sheets.length === 1 ? '' : 's'}`} onClear={() => { setFile(null); setSheets([]); setResult(null); }} disabled={busy} />
      <div className="convert-flow" aria-hidden="true"><span className="convert-flow__badge">Spreadsheet</span><ArrowRight size={16} /><span className="convert-flow__badge">PDF</span></div>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field__label">Sheets to include</legend>
        <ul className="sheet-list">
          {sheets.map((s, i) => (
            <li key={s.name}>
              <label className="check">
                <input type="checkbox" checked={chosen.has(i)} disabled={!s.cols} onChange={() => { const n = new Set(chosen); n.has(i) ? n.delete(i) : n.add(i); setChosen(n); setResult(null); }} /> {s.name}
              </label>
              <span className="meta">{s.cols ? `${formatNumber(s.rows.length)} rows × ${s.cols} columns` : 'empty'}</span>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="form-row">
        <div className="field">
          <label className="field__label" htmlFor="xp-or">Orientation</label>
          <select id="xp-or" value={opts.orientation} onChange={(e) => set('orientation', e.target.value)}><option value="auto">Automatic (landscape for wide sheets)</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="xp-size">Page size</label>
          <select id="xp-size" value={opts.pageSize} onChange={(e) => set('pageSize', e.target.value)}><option value="A4">A4</option><option value="LETTER">US Letter</option></select>
        </div>
      </div>
      <div className="form-row form-row--wrap">
        <label className="check"><input type="checkbox" checked={opts.gridlines} onChange={(e) => set('gridlines', e.target.checked)} /> Show gridlines</label>
        <label className="check"><input type="checkbox" checked={opts.headerRow} onChange={(e) => set('headerRow', e.target.checked)} /> First row is a header (bold, repeated on every page)</label>
      </div>
      {cells > MAX_CELLS && <Alert type="warning">These sheets contain {formatNumber(cells)} cells. Creating the PDF may take a while and produce hundreds of pages.</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <div className="tool__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={convert} disabled={busy || !selected.length}>
          {busy ? <Loader2 size={18} className="spin" aria-hidden="true" /> : <Wand2 size={18} aria-hidden="true" />} {busy ? 'Creating PDF…' : `Convert ${selected.length} sheet${selected.length === 1 ? '' : 's'} to PDF`}
        </button>
      </div>
      {result && (
        <div className="download-box" aria-live="polite">
          <p><strong>Your PDF is ready</strong> ({formatBytes(result.blob.size)}).</p>
          <button type="button" className="btn btn--accent" onClick={() => downloadBlob(result.blob, `${safeBaseName(file.name)}.pdf`, 'excel-to-pdf')}><Download size={18} aria-hidden="true" /> Download PDF</button>
        </div>
      )}
      {first && (
        <>
          <p className="doc-preview__label">Preview — {first.name} (first rows)</p>
          <div className="sheet-preview"><table><tbody>{first.rows.slice(0, 12).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>
          <p className="field__hint">Values are shown as formatted in the spreadsheet. Charts, pictures and cell colours are not included in the PDF.</p>
        </>
      )}
    </div>
  );
}
