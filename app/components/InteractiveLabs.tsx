"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Blocks,
  BrainCircuit,
  Grid3X3,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type LabKey = "cnn" | "sequence" | "attention" | "generation";

const labTabs: { key: LabKey; title: string; subtitle: string; icon: typeof Grid3X3 }[] = [
  { key: "cnn", title: "CNN maths", subtitle: "Shapes, dilation, parameters", icon: Grid3X3 },
  { key: "sequence", title: "LSTM and GRU", subtitle: "Watch memory gates mix", icon: BrainCircuit },
  { key: "attention", title: "Attention and ViT", subtitle: "Weights, patches, tokens", icon: Blocks },
  { key: "generation", title: "GAN and attacks", subtitle: "Losses and FGSM steps", icon: ShieldAlert },
];

function RangeField({
  label,
  symbol,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-field">
      <span><strong>{symbol}</strong> {label}<output>{value}</output></span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="lab-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function SymbolList({ items }: { items: [string, string][] }) {
  return (
    <dl className="symbol-list">
      {items.map(([symbol, meaning]) => (
        <div key={symbol}>
          <dt>{symbol}</dt>
          <dd>{meaning}</dd>
        </div>
      ))}
    </dl>
  );
}

function CnnLab() {
  const [input, setInput] = useState(20);
  const [kernel, setKernel] = useState(5);
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(0);
  const [dilation, setDilation] = useState(1);
  const [channelsIn, setChannelsIn] = useState(3);
  const [channelsOut, setChannelsOut] = useState(16);
  const [rfStep, setRfStep] = useState(1);

  const effectiveKernel = dilation * (kernel - 1) + 1;
  const numerator = input + 2 * padding - dilation * (kernel - 1) - 1;
  const output = Math.max(0, Math.floor(numerator / stride) + 1);
  const parameters = (kernel * kernel * channelsIn + 1) * channelsOut;
  const previewSize = Math.min(input, 15);
  const receptiveField = 1 + 2 * rfStep;

  const resetOldExam = () => {
    setInput(20);
    setKernel(5);
    setStride(1);
    setPadding(0);
    setDilation(1);
    setChannelsIn(3);
    setChannelsOut(16);
  };

  return (
    <section className="lab-panel" aria-labelledby="cnn-lab-title">
      <div className="lab-intro">
        <div>
          <p className="eyebrow">Start with the picture</p>
          <h2 id="cnn-lab-title">A kernel is a small window moving across an input grid</h2>
          <p>
            Kernel size controls the physical window. Dilation inserts gaps between its learned values.
            Stride controls how far it moves. Padding adds a border. Change one control and watch the
            output grid and exam calculation update together.
          </p>
        </div>
        <button type="button" className="button secondary" onClick={resetOldExam}>
          <RefreshCw size={15} aria-hidden="true" /> Old-paper preset
        </button>
      </div>

      <div className="lab-workspace cnn-workspace">
        <div className="control-panel">
          <h3>Change the question</h3>
          <RangeField label="input width/height" symbol="N" value={input} min={8} max={32} onChange={setInput} />
          <RangeField label="kernel size" symbol="K" value={kernel} min={1} max={7} step={2} onChange={setKernel} />
          <RangeField label="stride" symbol="S" value={stride} min={1} max={4} onChange={setStride} />
          <RangeField label="padding per side" symbol="P" value={padding} min={0} max={5} onChange={setPadding} />
          <RangeField label="dilation" symbol="D" value={dilation} min={1} max={4} onChange={setDilation} />
          <RangeField label="input channels" symbol="C_in" value={channelsIn} min={1} max={32} onChange={setChannelsIn} />
          <RangeField label="filters/output channels" symbol="C_out" value={channelsOut} min={1} max={64} onChange={setChannelsOut} />
        </div>

        <div className="visual-panel">
          <div className="grid-explainer">
            <div>
              <span className="visual-label">Input: {input} x {input}</span>
              <div
                className="pixel-grid input-grid"
                style={{ gridTemplateColumns: `repeat(${previewSize}, 1fr)` }}
                role="img"
                aria-label={`Scaled input grid showing a ${kernel} by ${kernel} kernel with dilation ${dilation}`}
              >
                {Array.from({ length: previewSize * previewSize }, (_, index) => {
                  const row = Math.floor(index / previewSize);
                  const col = index % previewSize;
                  const active = row < effectiveKernel && col < effectiveKernel && row % dilation === 0 && col % dilation === 0;
                  const footprint = row < effectiveKernel && col < effectiveKernel;
                  return <span key={index} className={`${footprint ? "footprint" : ""} ${active ? "kernel-value" : ""}`} />;
                })}
              </div>
              <small className="visual-caption">Dark squares are learned kernel values; pale area is the effective footprint.</small>
            </div>
            <ArrowRight className="grid-arrow" aria-hidden="true" />
            <div>
              <span className="visual-label">Output: {output} x {output} x {channelsOut}</span>
              {output > 0 ? (
                <div
                  className="pixel-grid output-grid"
                  style={{ gridTemplateColumns: `repeat(${Math.min(output, 12)}, 1fr)` }}
                  role="img"
                  aria-label={`Scaled output grid with ${output} positions per side and ${channelsOut} channels`}
                >
                  {Array.from({ length: Math.min(output, 12) ** 2 }, (_, index) => <span key={index} />)}
                </div>
              ) : (
                <div className="invalid-output">The effective kernel is larger than the padded input.</div>
              )}
              <small className="visual-caption">Each filter produces one complete output map.</small>
            </div>
          </div>

          <div className="metric-row">
            <Metric label="Effective kernel" value={`${effectiveKernel} x ${effectiveKernel}`} note="D(K - 1) + 1" />
            <Metric label="Output shape" value={`${output} x ${output} x ${channelsOut}`} note="depth = filter count" />
            <Metric label="Trainable parameters" value={parameters.toLocaleString()} note="bias included" />
          </div>
        </div>
      </div>

      <div className="math-tutorial">
        <div className="tutorial-copy">
          <p className="eyebrow">The exact exam method</p>
          <h3>Never jump directly to arithmetic</h3>
          <ol className="math-steps">
            <li><strong>Given</strong><span>N={input}, K={kernel}, S={stride}, P={padding}, D={dilation}</span></li>
            <li><strong>Effective kernel</strong><span>K_eff = {dilation}({kernel} - 1) + 1 = {effectiveKernel}</span></li>
            <li><strong>Formula</strong><span>N_out = floor((N + 2P - D(K - 1) - 1) / S) + 1</span></li>
            <li><strong>Substitute</strong><span>floor(({input} + 2({padding}) - {dilation}({kernel} - 1) - 1) / {stride}) + 1 = {output}</span></li>
            <li><strong>Answer</strong><span>{output} x {output} x {channelsOut}</span></li>
          </ol>
        </div>
        <div>
          <h3>Every symbol</h3>
          <SymbolList items={[
            ["N", "input width or height"],
            ["K", "physical kernel width or height"],
            ["D", "gap multiplier between kernel values; ordinary convolution is 1"],
            ["P", "zeros added to each border"],
            ["S", "number of input positions moved per step"],
            ["C_in", "input depth or channels"],
            ["C_out", "number of filters and output channels"],
            ["floor", "round downward after division"],
          ]} />
        </div>
      </div>

      <div className="rf-tutorial">
        <div>
          <p className="eyebrow">Step-through tutorial</p>
          <h3>Why repeated 3 x 3 layers see more of the image</h3>
          <p>At stride 1, every added 3 x 3 convolution expands the receptive field by two input pixels.</p>
        </div>
        <div className="rf-visual" aria-label={`After ${rfStep} layers the receptive field is ${receptiveField} by ${receptiveField}`}>
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              type="button"
              className={step <= rfStep ? "active" : ""}
              onClick={() => setRfStep(step)}
              aria-pressed={step === rfStep}
            >
              <span>Layer {step}</span>
              <strong>{1 + 2 * step} x {1 + 2 * step}</strong>
            </button>
          ))}
        </div>
        <div className="rf-answer">RF = 1 + {rfStep} x (3 - 1) = <strong>{receptiveField}</strong></div>
      </div>
    </section>
  );
}

function SequenceLab() {
  const [model, setModel] = useState<"lstm" | "gru">("lstm");
  const [f, setF] = useState(0.8);
  const [i, setI] = useState(0.3);
  const [o, setO] = useState(0.7);
  const [cPrevious, setCPrevious] = useState(0.6);
  const [candidate, setCandidate] = useState(-0.5);
  const [z, setZ] = useState(0.7);
  const [hPrevious, setHPrevious] = useState(0.5);
  const [inputSize, setInputSize] = useState(5);
  const [hiddenSize, setHiddenSize] = useState(4);

  const cell = f * cPrevious + i * candidate;
  const hidden = o * Math.tanh(cell);
  const gruHidden = (1 - z) * hPrevious + z * candidate;
  const parameterCount = (model === "lstm" ? 4 : 3) * hiddenSize * (inputSize + hiddenSize + 1);

  return (
    <section className="lab-panel" aria-labelledby="sequence-lab-title">
      <div className="lab-intro">
        <div>
          <p className="eyebrow">Think of gates as dimmer switches</p>
          <h2 id="sequence-lab-title">LSTM and GRU mix old memory with proposed new memory</h2>
          <p>
            A gate is a number from 0 to 1. Zero means block this path; one means pass it fully. The
            multiplication is therefore not mysterious: it is simply controlling how much information survives.
          </p>
        </div>
        <div className="segmented" role="tablist" aria-label="Choose sequence model">
          <button type="button" role="tab" aria-selected={model === "lstm"} onClick={() => setModel("lstm")}>LSTM</button>
          <button type="button" role="tab" aria-selected={model === "gru"} onClick={() => setModel("gru")}>GRU</button>
        </div>
      </div>

      <div className="lab-workspace sequence-workspace">
        <div className="control-panel">
          <h3>{model === "lstm" ? "Move each LSTM gate" : "Move the GRU update gate"}</h3>
          {model === "lstm" ? (
            <>
              <RangeField label="forget gate" symbol="f_t" value={f} min={0} max={1} step={0.05} onChange={setF} />
              <RangeField label="input gate" symbol="i_t" value={i} min={0} max={1} step={0.05} onChange={setI} />
              <RangeField label="output gate" symbol="o_t" value={o} min={0} max={1} step={0.05} onChange={setO} />
              <RangeField label="previous cell" symbol="c_(t-1)" value={cPrevious} min={-1} max={1} step={0.05} onChange={setCPrevious} />
            </>
          ) : (
            <>
              <RangeField label="update gate" symbol="z_t" value={z} min={0} max={1} step={0.05} onChange={setZ} />
              <RangeField label="previous hidden state" symbol="h_(t-1)" value={hPrevious} min={-1} max={1} step={0.05} onChange={setHPrevious} />
            </>
          )}
          <RangeField label="candidate content" symbol={model === "lstm" ? "c_tilde" : "h_tilde"} value={candidate} min={-1} max={1} step={0.05} onChange={setCandidate} />
          <hr />
          <RangeField label="input dimension" symbol="n_x" value={inputSize} min={1} max={20} onChange={setInputSize} />
          <RangeField label="hidden dimension" symbol="n_h" value={hiddenSize} min={1} max={20} onChange={setHiddenSize} />
        </div>

        <div className="visual-panel memory-visual">
          {model === "lstm" ? (
            <>
              <div className="memory-flow" aria-label="LSTM old memory and candidate memory combine into a new cell state">
                <div className="memory-source old"><span>Old memory</span><strong>{cPrevious.toFixed(2)}</strong></div>
                <div className="gate-node"><span>forget x</span><strong>{f.toFixed(2)}</strong><small>= {(f * cPrevious).toFixed(3)}</small></div>
                <span className="flow-arrow">+</span>
                <div className="gate-node"><span>input x candidate</span><strong>{i.toFixed(2)} x {candidate.toFixed(2)}</strong><small>= {(i * candidate).toFixed(3)}</small></div>
                <ArrowRight aria-hidden="true" />
                <div className="memory-source new"><span>New cell c_t</span><strong>{cell.toFixed(3)}</strong></div>
              </div>
              <div className="output-flow">
                <span>tanh(c_t) = {Math.tanh(cell).toFixed(3)}</span>
                <span>x output gate {o.toFixed(2)}</span>
                <strong>h_t = {hidden.toFixed(3)}</strong>
              </div>
            </>
          ) : (
            <div className="memory-flow gru-flow" aria-label="GRU old state and candidate state combine using update gate">
              <div className="memory-source old"><span>Old state</span><strong>{hPrevious.toFixed(2)}</strong></div>
              <div className="gate-node"><span>old share</span><strong>1 - z = {(1 - z).toFixed(2)}</strong><small>= {((1 - z) * hPrevious).toFixed(3)}</small></div>
              <span className="flow-arrow">+</span>
              <div className="gate-node"><span>candidate share</span><strong>z = {z.toFixed(2)}</strong><small>= {(z * candidate).toFixed(3)}</small></div>
              <ArrowRight aria-hidden="true" />
              <div className="memory-source new"><span>New h_t</span><strong>{gruHidden.toFixed(3)}</strong></div>
            </div>
          )}

          <div className="metric-row">
            <Metric label="New memory/state" value={(model === "lstm" ? cell : gruHidden).toFixed(3)} note={model === "lstm" ? "c_t" : "h_t"} />
            {model === "lstm" ? <Metric label="Exposed hidden state" value={hidden.toFixed(3)} note="o_t x tanh(c_t)" /> : null}
            <Metric label="Cell parameters" value={parameterCount.toLocaleString()} note={`${model === "lstm" ? 4 : 3} transforms`} />
          </div>
        </div>
      </div>

      <div className="math-tutorial">
        <div>
          <p className="eyebrow">Live substitution</p>
          <h3>{model === "lstm" ? "LSTM cell calculation" : "GRU state calculation"}</h3>
          {model === "lstm" ? (
            <ol className="math-steps">
              <li><strong>Keep old</strong><span>f_t x c_(t-1) = {f.toFixed(2)} x {cPrevious.toFixed(2)} = {(f * cPrevious).toFixed(3)}</span></li>
              <li><strong>Write new</strong><span>i_t x c_tilde = {i.toFixed(2)} x {candidate.toFixed(2)} = {(i * candidate).toFixed(3)}</span></li>
              <li><strong>Add</strong><span>c_t = {(f * cPrevious).toFixed(3)} + {(i * candidate).toFixed(3)} = {cell.toFixed(3)}</span></li>
              <li><strong>Expose</strong><span>h_t = {o.toFixed(2)} x tanh({cell.toFixed(3)}) = {hidden.toFixed(3)}</span></li>
            </ol>
          ) : (
            <ol className="math-steps">
              <li><strong>Old share</strong><span>(1 - z_t)h_(t-1) = {(1 - z).toFixed(2)} x {hPrevious.toFixed(2)}</span></li>
              <li><strong>New share</strong><span>z_t h_tilde = {z.toFixed(2)} x {candidate.toFixed(2)}</span></li>
              <li><strong>Add</strong><span>h_t = {((1 - z) * hPrevious).toFixed(3)} + {(z * candidate).toFixed(3)} = {gruHidden.toFixed(3)}</span></li>
            </ol>
          )}
        </div>
        <div>
          <h3>Every symbol</h3>
          <SymbolList items={model === "lstm" ? [
            ["f_t", "forget gate: fraction of old cell memory retained"],
            ["i_t", "input gate: fraction of candidate written"],
            ["c_tilde", "candidate memory proposed at this step"],
            ["c_t", "new long-term cell state"],
            ["o_t", "output gate: fraction exposed as hidden state"],
            ["h_t", "new visible hidden state"],
          ] : [
            ["z_t", "update gate; in the course convention, high z favors candidate"],
            ["h_(t-1)", "previous hidden state"],
            ["h_tilde", "candidate hidden state"],
            ["h_t", "new mixed hidden state"],
          ]} />
        </div>
      </div>
    </section>
  );
}

function AttentionLab() {
  const [mode, setMode] = useState<"attention" | "vit">("attention");
  const [scores, setScores] = useState([1, 0, -0.5]);
  const [keyDimension, setKeyDimension] = useState(2);
  const [imageSize, setImageSize] = useState(256);
  const [patchSize, setPatchSize] = useState(32);
  const [channels, setChannels] = useState(3);
  const [embedding, setEmbedding] = useState(128);

  const scaled = scores.map((score) => score / Math.sqrt(keyDimension));
  const maxScore = Math.max(...scaled);
  const exponentials = scaled.map((score) => Math.exp(score - maxScore));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  const weights = exponentials.map((value) => value / total);
  const values = [[2, 0], [0, 4], [1, 1]];
  const output = [0, 1].map((dimension) => weights.reduce((sum, weight, index) => sum + weight * values[index][dimension], 0));

  const patchesPerSide = imageSize / patchSize;
  const patchCount = patchesPerSide * patchesPerSide;
  const patchVector = patchSize * patchSize * channels;
  const tokens = patchCount + 1;
  const projection = (patchVector + 1) * embedding;
  const positions = tokens * embedding;

  return (
    <section className="lab-panel" aria-labelledby="attention-lab-title">
      <div className="lab-intro">
        <div>
          <p className="eyebrow">Similarity becomes a percentage</p>
          <h2 id="attention-lab-title">Attention decides how much information to retrieve from each position</h2>
          <p>
            First calculate similarity scores, scale them, and apply softmax. Softmax turns arbitrary
            scores into positive weights that add to 1 - literally a percentage allocation of attention.
          </p>
        </div>
        <div className="segmented" role="tablist" aria-label="Choose attention tutorial">
          <button type="button" role="tab" aria-selected={mode === "attention"} onClick={() => setMode("attention")}>Attention</button>
          <button type="button" role="tab" aria-selected={mode === "vit"} onClick={() => setMode("vit")}>ViT patches</button>
        </div>
      </div>

      {mode === "attention" ? (
        <>
          <div className="lab-workspace attention-workspace">
            <div className="control-panel">
              <h3>Change the three query-key scores</h3>
              {scores.map((score, index) => (
                <RangeField
                  key={index}
                  label={`score for key ${index + 1}`}
                  symbol={`q.k${index + 1}`}
                  value={score}
                  min={-2}
                  max={2}
                  step={0.1}
                  onChange={(value) => setScores((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))}
                />
              ))}
              <RangeField label="key/query dimension" symbol="d_k" value={keyDimension} min={1} max={16} onChange={setKeyDimension} />
            </div>

            <div className="visual-panel attention-visual">
              <div className="attention-bars" role="img" aria-label={`Attention weights are ${weights.map((weight) => `${(weight * 100).toFixed(1)} percent`).join(", ")}`}>
                {weights.map((weight, index) => (
                  <div className="attention-row" key={index}>
                    <span>Key {index + 1}<small>value [{values[index].join(", ")}]</small></span>
                    <div className="bar-track"><span style={{ width: `${weight * 100}%` }} /></div>
                    <strong>{(weight * 100).toFixed(1)}%</strong>
                  </div>
                ))}
              </div>
              <div className="attention-output">
                <span>Weighted value returned</span>
                <strong>[{output[0].toFixed(3)}, {output[1].toFixed(3)}]</strong>
                <small>Each value vector is multiplied by its weight, then added.</small>
              </div>
            </div>
          </div>

          <div className="math-tutorial">
            <div>
              <p className="eyebrow">From score to answer</p>
              <h3>One operation at a time</h3>
              <ol className="math-steps">
                <li><strong>Raw scores</strong><span>[{scores.map((score) => score.toFixed(1)).join(", ")}]</span></li>
                <li><strong>Scale</strong><span>divide by sqrt({keyDimension}) = {Math.sqrt(keyDimension).toFixed(3)} {" -> "} [{scaled.map((score) => score.toFixed(3)).join(", ")}]</span></li>
                <li><strong>Softmax</strong><span>[{weights.map((weight) => weight.toFixed(3)).join(", ")}] and the entries sum to 1</span></li>
                <li><strong>Weighted sum</strong><span>sum(weight_i x value_i) = [{output.map((value) => value.toFixed(3)).join(", ")}]</span></li>
              </ol>
            </div>
            <div>
              <h3>Every symbol</h3>
              <SymbolList items={[
                ["Q", "queries: what each position is looking for"],
                ["K", "keys: descriptions used for matching"],
                ["V", "values: information actually returned"],
                ["QK^T", "all query-key dot-product similarity scores"],
                ["d_k", "number of components in a query/key vector"],
                ["sqrt(d_k)", "scale that stops softmax becoming too sharp"],
              ]} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="lab-workspace vit-workspace">
            <div className="control-panel">
              <h3>Slice an image into tokens</h3>
              <label className="select-field"><span><strong>H, W</strong> image size</span><select value={imageSize} onChange={(event) => setImageSize(Number(event.target.value))}><option>128</option><option>224</option><option>256</option></select></label>
              <label className="select-field"><span><strong>P</strong> patch side</span><select value={patchSize} onChange={(event) => setPatchSize(Number(event.target.value))}><option>8</option><option>16</option><option>32</option></select></label>
              <label className="select-field"><span><strong>C</strong> channels</span><select value={channels} onChange={(event) => setChannels(Number(event.target.value))}><option value="1">1 grayscale</option><option value="3">3 RGB</option></select></label>
              <label className="select-field"><span><strong>D_e</strong> embedding size</span><select value={embedding} onChange={(event) => setEmbedding(Number(event.target.value))}><option>64</option><option>128</option><option>256</option><option>768</option></select></label>
              <button type="button" className="button secondary" onClick={() => { setImageSize(256); setPatchSize(32); setChannels(3); setEmbedding(128); }}>Old-paper preset</button>
            </div>

            <div className="visual-panel vit-visual">
              <div className="vit-image" style={{ "--patches": patchesPerSide } as CSSProperties} role="img" aria-label={`${imageSize} pixel image divided into ${patchCount} patches`}>
                <span>Image<br />{imageSize} x {imageSize} x {channels}</span>
              </div>
              <ArrowRight aria-hidden="true" />
              <div className="token-stack" aria-label={`${patchCount} patch tokens plus one classification token`}>
                <div className="cls-token">CLS</div>
                {Array.from({ length: Math.min(8, patchCount) }, (_, index) => <div key={index}>P{index + 1}</div>)}
                {patchCount > 8 ? <span>+ {patchCount - 8} more</span> : null}
              </div>
              <div className="metric-row">
                <Metric label="Patches" value={patchCount.toLocaleString()} note={`${patchesPerSide} x ${patchesPerSide}`} />
                <Metric label="Patch vector" value={patchVector.toLocaleString()} note="P x P x C values" />
                <Metric label="Tokens with CLS" value={tokens.toLocaleString()} note="N + 1" />
                <Metric label="Projection params" value={projection.toLocaleString()} note="bias included" />
              </div>
            </div>
          </div>

          <div className="math-tutorial">
            <div>
              <p className="eyebrow">Patch arithmetic</p>
              <h3>The image becomes a sequence</h3>
              <ol className="math-steps">
                <li><strong>Along each side</strong><span>{imageSize} / {patchSize} = {patchesPerSide} patches</span></li>
                <li><strong>Total patches N</strong><span>{patchesPerSide} x {patchesPerSide} = {patchCount}</span></li>
                <li><strong>Flatten one patch</strong><span>{patchSize} x {patchSize} x {channels} = {patchVector} values</span></li>
                <li><strong>Add CLS</strong><span>{patchCount} + 1 = {tokens} tokens</span></li>
                <li><strong>Project</strong><span>({patchVector} + 1 bias) x {embedding} = {projection.toLocaleString()} parameters</span></li>
              </ol>
            </div>
            <div>
              <h3>Every symbol</h3>
              <SymbolList items={[
                ["H, W", "image height and width"],
                ["P", "patch side length; patches are P x P"],
                ["C", "image channels"],
                ["N", "number of non-overlapping patches"],
                ["D_e", "length of each learned patch embedding"],
                ["CLS", "extra token used to collect information for classification"],
              ]} />
              <p className="position-note">Learned positional parameters here: {positions.toLocaleString()} = {tokens} tokens x {embedding} dimensions.</p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function GenerationLab() {
  const [mode, setMode] = useState<"gan" | "fgsm">("gan");
  const [realScore, setRealScore] = useState(0.9);
  const [fakeScore, setFakeScore] = useState(0.2);
  const [epsilon, setEpsilon] = useState(0.1);
  const [pixels, setPixels] = useState([0.2, 0.9, 0.05]);
  const [signs, setSigns] = useState([-1, 1, -1]);

  const discriminatorLoss = -0.5 * (Math.log(realScore) + Math.log(1 - fakeScore));
  const generatorLoss = -Math.log(fakeScore);
  const attacked = pixels.map((pixel, index) => Math.min(1, Math.max(0, pixel + epsilon * signs[index])));

  return (
    <section className="lab-panel" aria-labelledby="generation-lab-title">
      <div className="lab-intro">
        <div>
          <p className="eyebrow">Probabilities make the losses readable</p>
          <h2 id="generation-lab-title">GAN training and adversarial attacks are two different contests</h2>
          <p>
            In a GAN, a generator tries to fool a discriminator. In FGSM, an attacker moves the input
            in the direction that increases a trained model's loss. Use the switch to see both without
            mixing their objectives.
          </p>
        </div>
        <div className="segmented" role="tablist" aria-label="Choose generative or adversarial tutorial">
          <button type="button" role="tab" aria-selected={mode === "gan"} onClick={() => setMode("gan")}>GAN losses</button>
          <button type="button" role="tab" aria-selected={mode === "fgsm"} onClick={() => setMode("fgsm")}>FGSM attack</button>
        </div>
      </div>

      {mode === "gan" ? (
        <>
          <div className="lab-workspace gan-workspace">
            <div className="control-panel">
              <h3>Change discriminator confidence</h3>
              <RangeField label="probability real sample is real" symbol="D(x)" value={realScore} min={0.01} max={0.99} step={0.01} onChange={setRealScore} />
              <RangeField label="probability fake sample is real" symbol="D(G(z))" value={fakeScore} min={0.01} max={0.99} step={0.01} onChange={setFakeScore} />
            </div>
            <div className="visual-panel gan-visual">
              <div className="gan-flow" aria-label="Noise passes through generator then discriminator while real data enters discriminator directly">
                <div><span>noise z</span></div><ArrowRight /><div className="generator"><strong>Generator G</strong><span>creates G(z)</span></div><ArrowRight />
                <div className="discriminator"><strong>Discriminator D</strong><span>real or fake?</span></div>
                <div className="real-route"><span>real x</span><ArrowRight /></div>
              </div>
              <div className="gan-scores">
                <div><span>Real sample judged real</span><div className="bar-track"><span style={{ width: `${realScore * 100}%` }} /></div><strong>{(realScore * 100).toFixed(0)}%</strong></div>
                <div><span>Fake sample judged real</span><div className="bar-track"><span style={{ width: `${fakeScore * 100}%` }} /></div><strong>{(fakeScore * 100).toFixed(0)}%</strong></div>
              </div>
              <div className="metric-row">
                <Metric label="Discriminator loss" value={discriminatorLoss.toFixed(4)} note="average BCE" />
                <Metric label="Generator loss" value={generatorLoss.toFixed(4)} note="-ln D(G(z))" />
              </div>
            </div>
          </div>

          <div className="math-tutorial">
            <div>
              <p className="eyebrow">Loss without fear</p>
              <h3>A confident correct probability should give a small loss</h3>
              <ol className="math-steps">
                <li><strong>Real term</strong><span>-ln({realScore.toFixed(2)}) = {(-Math.log(realScore)).toFixed(4)}</span></li>
                <li><strong>Fake term</strong><span>-ln(1 - {fakeScore.toFixed(2)}) = {(-Math.log(1 - fakeScore)).toFixed(4)}</span></li>
                <li><strong>D average</strong><span>({(-Math.log(realScore)).toFixed(4)} + {(-Math.log(1 - fakeScore)).toFixed(4)}) / 2 = {discriminatorLoss.toFixed(4)}</span></li>
                <li><strong>G wants fake judged real</strong><span>-ln({fakeScore.toFixed(2)}) = {generatorLoss.toFixed(4)}</span></li>
              </ol>
            </div>
            <div>
              <h3>Every symbol</h3>
              <SymbolList items={[
                ["z", "random noise supplied to the generator"],
                ["G(z)", "generated or fake sample"],
                ["D(x)", "discriminator's real probability for a real sample"],
                ["D(G(z))", "real probability assigned to a generated sample"],
                ["ln", "natural logarithm; confident correct values produce small loss"],
              ]} />
            </div>
          </div>

          <div className="translation-diagrams">
            <div>
              <strong>Pix2Pix: paired</strong>
              <span>sketch</span><ArrowRight /><span>U-Net G</span><ArrowRight /><span>matching photo</span>
              <small>Adversarial realism + L1 against the aligned target</small>
            </div>
            <div>
              <strong>CycleGAN: unpaired</strong>
              <span>summer X</span><ArrowRight /><span>G</span><ArrowRight /><span>winter Y</span><ArrowRight /><span>F</span><ArrowRight /><span>rebuild X</span>
              <small>Adversarial realism + cycle consistency</small>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="lab-workspace fgsm-workspace">
            <div className="control-panel">
              <h3>Build one FGSM step</h3>
              <RangeField label="attack strength" symbol="epsilon" value={epsilon} min={0} max={0.3} step={0.01} onChange={setEpsilon} />
              {pixels.map((pixel, index) => (
                <div className="pixel-control" key={index}>
                  <RangeField label={`clean pixel ${index + 1}`} symbol={`x${index + 1}`} value={pixel} min={0} max={1} step={0.01} onChange={(value) => setPixels((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} />
                  <button type="button" onClick={() => setSigns((current) => current.map((item, itemIndex) => itemIndex === index ? -item : item))} aria-label={`Change gradient sign for pixel ${index + 1}`}>
                    sign = {signs[index] > 0 ? "+1" : "-1"}
                  </button>
                </div>
              ))}
            </div>
            <div className="visual-panel fgsm-visual">
              <div className="pixel-bars" role="img" aria-label={`Clean pixels ${pixels.join(", ")} become attacked pixels ${attacked.join(", ")}`}>
                {pixels.map((pixel, index) => (
                  <div key={index}>
                    <span>Pixel {index + 1}</span>
                    <div className="pixel-pair">
                      <div><small>clean {pixel.toFixed(2)}</small><span style={{ height: `${pixel * 100}%` }} /></div>
                      <ArrowRight size={17} aria-hidden="true" />
                      <div className="attacked"><small>adv {attacked[index].toFixed(2)}</small><span style={{ height: `${attacked[index] * 100}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="fgsm-equation">
                <span>x_adv = clip(x + epsilon x sign(gradient_x L), 0, 1)</span>
                <strong>[{attacked.map((value) => value.toFixed(2)).join(", ")}]</strong>
              </div>
            </div>
          </div>

          <div className="math-tutorial">
            <div>
              <p className="eyebrow">Three small moves</p>
              <h3>FGSM is add, then clip</h3>
              <ol className="math-steps">
                <li><strong>Direction</strong><span>sign(gradient) = [{signs.map((sign) => sign > 0 ? "+1" : "-1").join(", ")}]</span></li>
                <li><strong>Add</strong><span>x + {epsilon.toFixed(2)} x sign = [{pixels.map((pixel, index) => (pixel + epsilon * signs[index]).toFixed(2)).join(", ")}]</span></li>
                <li><strong>Clip</strong><span>force every pixel into [0, 1] {" -> "} [{attacked.map((value) => value.toFixed(2)).join(", ")}]</span></li>
              </ol>
            </div>
            <div>
              <h3>Every symbol</h3>
              <SymbolList items={[
                ["x", "clean input vector or image"],
                ["x_adv", "adversarially changed input"],
                ["epsilon", "maximum one-step change for each component"],
                ["gradient_x L", "direction that increases loss with respect to input"],
                ["sign", "replace each gradient component by -1, 0, or +1"],
                ["clip", "force pixels back into their legal range"],
              ]} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export function InteractiveLabs() {
  const [active, setActive] = useState<LabKey>("cnn");

  return (
    <div className="labs-shell">
      <div className="lab-picker" role="tablist" aria-label="Choose an interactive numerical lab">
        {labTabs.map(({ key, title, subtitle, icon: Icon }) => (
          <button type="button" role="tab" aria-selected={active === key} onClick={() => setActive(key)} key={key}>
            <Icon size={20} aria-hidden="true" />
            <span><strong>{title}</strong><small>{subtitle}</small></span>
          </button>
        ))}
      </div>
      <div className="lab-tip"><Sparkles size={16} aria-hidden="true" /> Start with the default values, read each line, then move only one control at a time.</div>
      {active === "cnn" ? <CnnLab /> : null}
      {active === "sequence" ? <SequenceLab /> : null}
      {active === "attention" ? <AttentionLab /> : null}
      {active === "generation" ? <GenerationLab /> : null}
    </div>
  );
}
