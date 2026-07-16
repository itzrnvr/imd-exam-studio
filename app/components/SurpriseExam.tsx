"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Printer, RefreshCw, ShieldAlert } from "lucide-react";

type Marks = 5 | 10 | 15;
type Kind = "Numerical" | "Theory" | "Design";
type Question = { marks: Marks; topic: string; kind: Kind; prompt: string; answer: string };

const bank: Question[] = [
  { marks: 5, topic: "CNN", kind: "Numerical", prompt: "A 32 x 32 input passes through a 3 x 3 convolution with stride 1 and no padding. Find the spatial output size.", answer: "N_out = floor((N + 2P - K)/S) + 1 = floor((32 + 0 - 3)/1) + 1 = 30. Therefore the output is 30 x 30. N = input size, P = padding, K = kernel size, S = stride." },
  { marks: 5, topic: "CNN", kind: "Theory", prompt: "Define receptive field and explain why deeper CNN layers see more context.", answer: "The receptive field is the region of the original input that can affect one activation. Each stacked kernel combines information from the previous layer, so its effective region in the original image grows with depth." },
  { marks: 5, topic: "Sequence models", kind: "Theory", prompt: "State the roles of the input, forget, and output gates in an LSTM.", answer: "The input gate controls new information written to cell state; the forget gate controls old information retained; the output gate controls how much cell information becomes the hidden state." },
  { marks: 5, topic: "Attention", kind: "Theory", prompt: "What do Q, K, and V mean in self-attention?", answer: "Q = query, what a token seeks; K = key, what each token offers for matching; V = value, the information mixed into the output. Attention compares Q with K and uses the resulting weights to combine V." },
  { marks: 5, topic: "ViT", kind: "Numerical", prompt: "A 224 x 224 RGB image is split into 16 x 16 patches. How many patch tokens are formed before adding a class token?", answer: "N = (H/P)(W/P) = (224/16)(224/16) = 14 x 14 = 196. H and W are image height and width; P is patch side length; N is number of patches." },
  { marks: 5, topic: "GAN", kind: "Theory", prompt: "Why are the generator and discriminator trained alternately?", answer: "They optimize opposing objectives. The discriminator learns to separate real from generated samples; the generator learns to fool it. Alternating updates supplies each model with a changing but usable opponent." },
  { marks: 5, topic: "Autoencoders", kind: "Theory", prompt: "Differentiate an undercomplete autoencoder from a denoising autoencoder.", answer: "An undercomplete autoencoder uses a smaller bottleneck to force compression. A denoising autoencoder receives corrupted input but must reconstruct the clean target, encouraging robust features." },
  { marks: 5, topic: "Robustness", kind: "Numerical", prompt: "For x = 0.60, epsilon = 0.10, and sign of the input gradient = -1, compute the FGSM adversarial value before clipping.", answer: "x_adv = x + epsilon sign(gradient) = 0.60 + 0.10(-1) = 0.50. x is the clean input, epsilon is perturbation size, gradient is the loss gradient with respect to x." },
  { marks: 5, topic: "XAI", kind: "Theory", prompt: "Distinguish local and global explanations with one example of each.", answer: "A local explanation describes one prediction, for example a saliency map for one image. A global explanation describes overall model behavior, for example dataset-level feature importance." },
  { marks: 5, topic: "Segmentation", kind: "Numerical", prompt: "A predicted mask and target have intersection 30 and union 50. Find IoU.", answer: "IoU = intersection/union = 30/50 = 0.60. IoU is intersection over union; intersection counts common positive pixels and union counts pixels positive in either mask." },
  { marks: 5, topic: "Training", kind: "Theory", prompt: "State two signs of overfitting and two remedies.", answer: "Signs: training loss falls while validation loss rises; a large training-validation accuracy gap. Remedies include data augmentation, weight decay, dropout, early stopping, or more data." },
  { marks: 5, topic: "Transfer learning", kind: "Theory", prompt: "When would you freeze a pretrained backbone rather than fine-tune all layers?", answer: "Freeze it when the target dataset is small or similar to the source task, or compute is limited. Fine-tune more layers when enough target data exists or the domain differs strongly." },

  { marks: 10, topic: "CNN", kind: "Numerical", prompt: "A 64 x 64 x 3 input is convolved with 16 filters of size 5 x 5, stride 2, padding 2. Find output shape and trainable parameters, including one bias per filter.", answer: "H_out = W_out = floor((64 + 2(2) - 5)/2) + 1 = 32, so output = 32 x 32 x 16. Parameters = (K_h K_w C_in + 1)C_out = (5 x 5 x 3 + 1)16 = 1,216. K_h,K_w = kernel dimensions; C_in,C_out = input/output channels; the +1 is bias." },
  { marks: 10, topic: "CNN", kind: "Numerical", prompt: "Three 3 x 3 convolutions have strides 1, 2, 1. Find receptive field and effective jump after every layer.", answer: "Start r_0 = 1, j_0 = 1. Use r_l = r_(l-1) + (K_l - 1)j_(l-1), j_l = j_(l-1)S_l. Layer 1: r=3,j=1. Layer 2: r=5,j=2. Layer 3: r=9,j=2. r = receptive-field size; j = spacing between adjacent activations in input coordinates; K = kernel; S = stride." },
  { marks: 10, topic: "CNN", kind: "Numerical", prompt: "Find the effective kernel size of a 3 x 3 convolution with dilation 3, then find its output on a 20 x 20 input with stride 1 and no padding.", answer: "K_eff = D(K-1)+1 = 3(3-1)+1 = 7. N_out = floor((20-7)/1)+1 = 14, so output is 14 x 14. D = dilation; K = original kernel size; K_eff = effective kernel size." },
  { marks: 10, topic: "Sequence models", kind: "Numerical", prompt: "Find the parameter count of an LSTM with input size d = 8 and hidden size h = 16, using one bias vector per gate.", answer: "There are four gates. Parameters = 4[h d + h h + h] = 4[16(8) + 16(16) + 16] = 4(400) = 1,600. d = input features; h = hidden units; the three terms are input weights, recurrent weights, and biases." },
  { marks: 10, topic: "Sequence models", kind: "Numerical", prompt: "Find the parameter count of a GRU with input size d = 10 and hidden size h = 20, using one bias vector for each of its three gates.", answer: "Parameters = 3[h d + h h + h] = 3[20(10) + 20(20) + 20] = 3(620) = 1,860. A GRU has update, reset, and candidate computations; d = input size and h = hidden size." },
  { marks: 10, topic: "Attention", kind: "Numerical", prompt: "For one query q = [1,0], keys k1 = [1,0], k2 = [0,1], and values v1 = [2,0], v2 = [0,4], compute scaled dot-product attention.", answer: "Scores = [q.k1, q.k2]/sqrt(d_k) = [1,0]/sqrt(2) = [0.707,0]. Softmax gives approximately [0.670,0.330]. Output = 0.670v1 + 0.330v2 = [1.340,1.320]. q = query; k = key; v = value; d_k = key dimension; softmax converts scores to weights summing to 1." },
  { marks: 10, topic: "ViT", kind: "Numerical", prompt: "A 128 x 128 RGB image uses 16 x 16 patches and embedding dimension 256. Find patch count, token count with one class token, and patch-projection parameters including bias.", answer: "Patches = (128/16)^2 = 64. Tokens = 64 + 1 = 65. Each flattened patch has 16 x 16 x 3 = 768 values. Projection parameters = 768 x 256 + 256 = 196,864. RGB means 3 channels; 256 is embedding dimension." },
  { marks: 10, topic: "Classification", kind: "Numerical", prompt: "Compute softmax probabilities for logits [2, 1, 0] and the cross-entropy loss if class 1 is correct.", answer: "Subtracting the maximum gives [0,-1,-2]. Exponentials are [1,0.3679,0.1353], sum 1.5032. Probabilities are approximately [0.665,0.245,0.090]. Loss L = -ln(p_y) = -ln(0.665) = 0.408. p_y is probability of the true class y." },
  { marks: 10, topic: "Segmentation", kind: "Numerical", prompt: "For a binary mask, TP = 40, FP = 10, and FN = 20. Compute IoU and Dice score.", answer: "IoU = TP/(TP+FP+FN) = 40/70 = 0.571. Dice = 2TP/(2TP+FP+FN) = 80/110 = 0.727. TP = true positives; FP = false positives; FN = false negatives." },
  { marks: 10, topic: "GAN", kind: "Numerical", prompt: "Using binary cross-entropy, compute discriminator loss L_D = -[ln D(x) + ln(1-D(G(z)))] when D(x)=0.8 and D(G(z))=0.3.", answer: "L_D = -[ln(0.8) + ln(0.7)] = -[-0.2231 - 0.3567] = 0.5798. D(x) is discriminator probability for a real sample; G(z) is a generated sample; D(G(z)) is its predicted real probability." },
  { marks: 10, topic: "Sequence models", kind: "Theory", prompt: "Explain vanishing and exploding gradients in an RNN and give suitable remedies.", answer: "Backpropagation through time repeatedly multiplies Jacobians. Factors mostly below 1 make gradients vanish; factors above 1 make them explode. LSTM/GRU gates help preserve information; careful initialization, normalization and truncated BPTT help; gradient clipping directly controls explosion." },
  { marks: 10, topic: "Generative models", kind: "Theory", prompt: "Compare Pix2Pix and CycleGAN by supervision, losses, and suitable use cases.", answer: "Pix2Pix needs paired source-target images and combines adversarial with direct reconstruction loss. CycleGAN uses unpaired domains and adds cycle-consistency (often identity) losses. Use Pix2Pix when aligned pairs exist; CycleGAN for unpaired style/domain translation." },
  { marks: 10, topic: "CNN and ViT", kind: "Theory", prompt: "Compare CNNs and Vision Transformers in inductive bias, data requirements, computation, and interpretability.", answer: "CNNs build in locality and translation equivariance, often learning efficiently from less data. ViTs model global token relations with weaker image-specific bias and commonly benefit from large-scale pretraining. Attention is quadratic in token count; CNN cost depends on feature maps and kernels. Attention maps are inspectable but are not automatically faithful explanations." },
  { marks: 10, topic: "Robustness", kind: "Theory", prompt: "Differentiate evasion, poisoning, and model-extraction attacks, and give one defence for each.", answer: "Evasion perturbs inference inputs: use adversarial training or detection. Poisoning corrupts training data: use data provenance, filtering, and robust training. Extraction queries a model to copy its behavior: use rate limits, monitoring, output restriction, or watermarking." },
  { marks: 10, topic: "XAI and bias", kind: "Theory", prompt: "Explain how an apparently accurate model can still be unfair, and propose an audit.", answer: "Aggregate accuracy can hide subgroup errors caused by imbalance, labels, proxies, or distribution shift. Audit data representation and label quality; report confusion-matrix metrics by relevant groups; inspect calibration and error examples; use local explanations carefully; mitigate and re-evaluate the performance-fairness trade-off." },
  { marks: 10, topic: "Training", kind: "Theory", prompt: "Explain dropout, L1/L2 regularization, batch normalization, and early stopping. State what problem each addresses.", answer: "Dropout randomly masks activations to reduce co-adaptation. L1 encourages sparsity; L2 discourages large weights. Batch normalization stabilizes activation distributions and optimization, with a regularizing side effect. Early stopping halts when validation performance stops improving to limit overfitting." },

  { marks: 15, topic: "CNN design", kind: "Design", prompt: "Design a CNN for 10-class 64 x 64 RGB images. Show all feature-map sizes and parameter formulas for two convolutional blocks and one classifier, then discuss overfitting controls.", answer: "A valid answer states assumptions and traces every shape. Example: Conv 3x3, 32 filters, S=1,P=1 -> 64x64x32; 2x2 pool -> 32x32x32; Conv 3x3,64 -> 32x32x64; pool -> 16x16x64; global average pooling -> 64; dense -> 10. Conv parameters = (K_h K_w C_in +1)C_out; dense = (n_in+1)n_out. Discuss augmentation, weight decay, dropout, early stopping, validation, and why global pooling reduces parameters." },
  { marks: 15, topic: "Sequence design", kind: "Design", prompt: "Design an LSTM-based sentiment classifier. Explain tensor flow, equations conceptually, loss, padding/masking, and how you would diagnose gradient and overfitting problems.", answer: "Expected structure: tokenize -> embeddings [B,T,d] -> LSTM hidden states [B,T,h] -> final/masked pooled state -> dense logits -> softmax. Define B=batch size, T=sequence length, d=embedding size, h=hidden size. Explain forget/input/output gates and cell state, cross-entropy loss, masks for padded tokens, gradient clipping for explosion, validation curves and regularization for overfitting." },
  { marks: 15, topic: "Attention design", kind: "Design", prompt: "Explain a Transformer self-attention block from input embeddings to output, including shapes, scaling, multi-head attention, residual connections, normalization, and complexity.", answer: "For X in R^(N x d_model), Q=XW_Q, K=XW_K, V=XW_V. One head: A=softmax(QK^T/sqrt(d_k)), output AV. Split d_model across H heads, concatenate, project, add residual and normalize; then feed-forward, residual and normalize. N=tokens; d_model=model width; d_k=key width per head; H=head count. Attention time/memory is quadratic in N because QK^T is N x N." },
  { marks: 15, topic: "GAN design", kind: "Design", prompt: "Describe a complete GAN training algorithm and diagnose mode collapse, vanishing generator gradients, and unstable oscillation.", answer: "Sample real x and noise z; generate G(z); update D to score real high and fake low; sample again and update G to make fake score real; alternate. Define G=generator, D=discriminator, z=latent noise. Mode collapse: low diversity—try minibatch features, WGAN-GP, balanced updates. Weak gradients: use non-saturating loss or Wasserstein objective. Instability: tune learning rates, normalize, regularize D, monitor fixed-noise samples and losses." },
  { marks: 15, topic: "Responsible AI", kind: "Design", prompt: "A medical-image model has high overall accuracy but poor performance for one demographic. Propose a technically sound investigation and deployment decision.", answer: "Disaggregate sensitivity, specificity, precision, false rates, calibration, and uncertainty by group; inspect representation, acquisition devices, missingness, labels, and shift; review errors with domain experts; use XAI as supporting evidence, not proof; improve sampling/labels or objectives; validate externally. Define thresholds and human review, monitoring, rollback, documentation, privacy, and do not deploy autonomously until clinically meaningful subgroup safety gates pass." },
  { marks: 15, topic: "Transfer learning", kind: "Design", prompt: "You have only 2,000 labelled images in a domain unlike ImageNet. Build a transfer-learning experiment with baselines, stages, and leakage-safe evaluation.", answer: "Split by independent subject/source before any augmentation; keep test data untouched. Compare a simple baseline, frozen pretrained backbone plus new head, then gradual unfreezing with smaller backbone learning rate. Use domain-appropriate augmentation, stratification, class metrics, repeated runs or cross-validation, early stopping, and ablations. Explain that more domain shift favors fine-tuning but small data raises overfitting risk." },
  { marks: 15, topic: "Model selection", kind: "Design", prompt: "Choose between a CNN, ViT, and hybrid model for a limited-data visual inspection task. Defend the choice and provide an evaluation plan.", answer: "A strong answer connects data size, resolution, local defects, global context, latency, pretrained weights, and hardware to the choice. With limited data and local texture, a pretrained CNN is a defensible baseline; test a pretrained ViT/hybrid if global relations matter. Specify leakage-safe splits, class-sensitive metrics, calibration, latency/memory, ablations, robustness tests, explanations, and error analysis." },
];

const topics = ["CNN", "Sequence models", "Attention + ViT", "GANs", "Autoencoders", "Segmentation", "Training", "Transfer learning", "Robustness", "XAI + bias"];
const patterns: Record<number, Marks[]> = {
  25: [5, 10, 10],
  50: [5, 5, 10, 15, 15],
  100: [5, 5, 10, 10, 10, 10, 10, 10, 15, 15],
};

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function generate(total: number, mode: string, seed: number) {
  const random = seeded(seed);
  const used = new Set<number>();
  return patterns[total].map((marks, slot) => {
    const preferred: Kind[] = mode === "numerical" ? ["Numerical", "Design"] : mode === "theory" ? ["Theory", "Design"] : mode === "long" ? ["Design", "Theory"] : slot % 3 === 0 ? ["Numerical", "Theory"] : slot % 3 === 1 ? ["Theory", "Numerical"] : ["Design", "Numerical", "Theory"];
    let candidates: number[] = [];
    for (const kind of preferred) {
      candidates = bank.map((q, index) => ({ q, index })).filter(({ q, index }) => q.marks === marks && q.kind === kind && !used.has(index)).map(({ index }) => index);
      if (candidates.length) break;
    }
    if (!candidates.length) candidates = bank.map((q, index) => ({ q, index })).filter(({ q, index }) => q.marks === marks && !used.has(index)).map(({ index }) => index);
    const chosen = candidates[Math.floor(random() * candidates.length)];
    used.add(chosen);
    return bank[chosen];
  });
}

export function SurpriseExam() {
  const [total, setTotal] = useState(100);
  const [mode, setMode] = useState("balanced");
  const [seed, setSeed] = useState(2607);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [ready, setReady] = useState<string[]>([]);
  const paper = useMemo(() => generate(total, mode, seed), [total, mode, seed]);

  useEffect(() => {
    try { setReady(JSON.parse(localStorage.getItem("imd-readiness") || "[]")); } catch { setReady([]); }
  }, []);

  const toggleReady = (topic: string) => setReady((current) => {
    const next = current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic];
    localStorage.setItem("imd-readiness", JSON.stringify(next));
    return next;
  });

  const regenerate = () => { setSeed((value) => value + 7919); setRevealed([]); };

  return (
    <div className="surprise-stack">
      <section className="sample-warning">
        <ShieldAlert size={22} aria-hidden="true" />
        <div><strong>The previous paper is evidence, not a promise.</strong><span>Prepare by learning each idea, formula, symbol, and answer structure—not by memorising one pattern.</span></div>
      </section>

      <section className="surprise-builder">
        <div className="surprise-controls">
          <label>Paper size<select value={total} onChange={(event) => setTotal(Number(event.target.value))}><option value={25}>25 marks</option><option value={50}>50 marks</option><option value={100}>100 marks</option></select></label>
          <label>Challenge<select value={mode} onChange={(event) => setMode(event.target.value)}><option value="balanced">Unpredictable balanced</option><option value="numerical">Numerical-heavy</option><option value="theory">Theory-heavy</option><option value="long">Long-answer heavy</option></select></label>
          <button className="button primary" type="button" onClick={regenerate}><RefreshCw size={17} /> New paper</button>
          <button className="button secondary" type="button" onClick={() => window.print()}><Printer size={17} /> Print</button>
        </div>
        <p className="paper-summary">Exact total: <strong>{paper.reduce((sum, q) => sum + q.marks, 0)} marks</strong> · {paper.filter((q) => q.kind === "Numerical").length} direct numericals · seed {seed}</p>
      </section>

      <section className="generated-paper">
        <div className="paper-heading"><div><p className="eyebrow">Fresh unseen combination</p><h2>Intelligent Model Design — practice paper</h2></div><strong>{total} marks</strong></div>
        <p className="exam-instruction">Attempt every question without notes. For numericals: Given → Formula → Substitute → Answer with units/shape. For theory: definition → mechanism → reason → limitation/example.</p>
        <ol className="surprise-questions">
          {paper.map((question, index) => {
            const open = revealed.includes(index);
            return <li key={`${seed}-${index}`}>
              <div className="question-meta"><span>{question.topic} · {question.kind}</span><strong>[{question.marks} marks]</strong></div>
              <p>{question.prompt}</p>
              <button className="answer-toggle" type="button" onClick={() => setRevealed((current) => open ? current.filter((item) => item !== index) : [...current, index])}>{open ? "Hide marking outline" : "Reveal marking outline"}</button>
              {open && <div className="answer-outline"><strong>Marking outline</strong><p>{question.answer}</p></div>}
            </li>;
          })}
        </ol>
      </section>

      <section className="readiness-section">
        <div className="section-heading"><div><p className="eyebrow">Anti-surprise checklist</p><h2>Can you answer without recognising the wording?</h2></div><p>{ready.length}/{topics.length} areas genuinely ready</p></div>
        <div className="readiness-grid">{topics.map((topic) => <button key={topic} type="button" className={ready.includes(topic) ? "ready" : ""} onClick={() => toggleReady(topic)}><span>{ready.includes(topic) ? <Check size={16} /> : null}</span>{topic}</button>)}</div>
        <p className="readiness-rule">Mark a topic ready only if you can explain it aloud, define every symbol, and solve one unseen question without looking.</p>
      </section>
    </div>
  );
}
