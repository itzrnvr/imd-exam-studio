# Intelligent Model Design

## Three 100-Mark Mock Papers With Solutions

These are practice papers inferred from the supplied lectures and December 2025 paper. They are not official predictions. Each paper deliberately includes substantial numerical work because that is the area most likely to improve through practice.

## Common instructions

- Time: 3 hours per full paper. If you have only 90 minutes, attempt all numericals plus one question from each theory section.
- Maximum marks: 100.
- Answer every question unless a question itself gives an internal choice.
- State all assumptions about padding, stride, bias, overlap, and conventions.
- Show formula, substitution, units, and output shape for numericals.
- A calculator may be used only if your actual exam permits it.

| Section | Questions | Marks |
|---|---|---|
| A | 10 short answers | `10 x 3 = 30` |
| B | 6 structured answers | `6 x 5 = 30` |
| C | 2 long answers | `2 x 10 = 20` |
| D | 1 compulsory case | `20` |
| Total | 19 questions/case | `100` |

<!-- PAGEBREAK -->

# Mock Paper 1 - Most likely mix

## Section A - 30 marks

### Q1 - 3 marks

A training set contains 24,000 samples. Batch size is 150 and the model trains for 15 epochs. Define epoch and batch size, then calculate iterations per epoch and total updates.

### Q2 - 3 marks

Distinguish 1D, 2D, and 3D data with one intelligent-model example of each. Clarify why RGB channels do not necessarily make an image three-dimensional spatial data.

### Q3 - 3 marks

Write formulas and output ranges for sigmoid, tanh, and ReLU. State one weakness of sigmoid in deep hidden layers.

### Q4 - 3 marks

An input feature map is `28 x 28 x 8`. A convolution uses 16 filters of size `3 x 3`, stride 2, padding 1, and dilation 1. Find output shape.

### Q5 - 3 marks

Explain vanishing and exploding gradients in an RNN. Give one suitable mitigation for each.

### Q6 - 3 marks

Name the reset and update gates of a GRU and explain their roles using the course update convention.

### Q7 - 3 marks

Write the scaled dot-product attention formula. Define `Q`, `K`, `V`, and `d_k`.

### Q8 - 3 marks

Define an autoencoder and name three applications. Why is a bottleneck or regularization needed?

### Q9 - 3 marks

Write the FGSM equation and distinguish a targeted attack from an untargeted attack.

### Q10 - 3 marks

Differentiate transfer learning and domain adaptation. Give one example where domain adaptation is the more precise description.

## Section B - 30 marks

### Q11 - 5 marks

An input `32 x 32 x 3` passes through a convolution with 12 filters of `5 x 5`, stride 1, padding 2, followed by `2 x 2`, stride-2 max pooling. Find the shape after each layer and the convolution's trainable parameters including bias. Explain why pooling has zero trainable parameters.

### Q12 - 5 marks

Explain an Inception module and a ResNet bottleneck block. For an Inception module whose four branches produce 64, 96, 32, and 128 channels at the same resolution, find output depth. State how `1 x 1` convolutions reduce cost.

### Q13 - 5 marks

An LSTM has input size 6 and hidden size 8. Calculate its recurrent-cell parameter count. For one scalar unit, use `f=0.7`, `i=0.4`, `c_old=0.5`, candidate `c_tilde=0.2`, and `o=0.6` to calculate new cell and hidden states.

### Q14 - 5 marks

A ViT receives `256 x 256 x 3` images and uses `32 x 32` patches with embedding dimension 128. Find patch count, flattened patch length, sequence length with CLS, patch-projection parameters including bias, and learned positional-embedding parameters.

### Q15 - 5 marks

Describe one full alternating GAN training cycle. Write the minimax objective and the commonly used non-saturating generator loss. State two training difficulties.

### Q16 - 5 marks

Compare L1 regularization, L2 regularization, dropout, data augmentation, and early stopping. For each, state the mechanism and one practical caution.

## Section C - 20 marks

### Q17 - 10 marks

Analyze this CNN completely:

- Input `64 x 64 x 3`
- Conv1: 16 filters, `3 x 3`, stride 1, padding 1
- MaxPool1: `2 x 2`, stride 2
- Conv2: 32 filters, `3 x 3`, stride 1, padding 1
- MaxPool2: `2 x 2`, stride 2
- Flatten and Dense 10

Find every output shape, parameter count per trainable layer, and total parameters. Then explain how replacing flatten+dense with global average pooling plus Dense 10 changes the parameter count and overfitting risk.

### Q18 - 10 marks

For one attention query, `q=[1,0]`, keys `k1=[1,0]`, `k2=[0,1]`, values `v1=[2,0]`, `v2=[0,4]`, and `d_k=2`:

1. Calculate scaled scores, softmax attention weights, and output vector. (6)
2. Describe the Transformer encoder flow using multi-head self-attention, residual connections, layer normalization, and feed-forward network. (4)

## Section D - 20 marks

### Q19 - Compulsory case study

A company has 12,000 aligned sketch/photo pairs at `256 x 256 x 3` and separate unpaired collections of 25,000 summer and 25,000 winter photos. Its Pix2Pix generator is described, for this simplified exam calculation, as seven `3 x 3` convolution layers with channels `3 -> 32 -> 64 -> 128 -> 256 -> 512 -> 1024 -> 2048`, one bias per output channel. A local discriminator is described as dividing the image into non-overlapping `64 x 64` patches.

1. Calculate patch count per image and explain what additional information is needed for a real sliding PatchGAN output map. (3)
2. Calculate the parameters in the seven stated convolutions. Show the general layer formula and total. (7)
3. Choose Pix2Pix or CycleGAN for sketch-to-photo and summer-to-winter. Justify each choice from data pairing and loss design. (4)
4. Write the essential Pix2Pix and CycleGAN losses in words or formulas. (3)
5. State one limitation of each model and three checks before deployment. (3)

<!-- PAGEBREAK -->

# Mock Paper 1 - Solutions and marking guide

## Section A solutions

### A1

Epoch: one pass through all training samples. Batch size: samples processed before one optimizer update.

```
iterations/epoch = 24000/150 = 160
total updates = 15*160 = 2400
```

Award 1 mark definitions, 1 mark iterations, 1 mark total.

### A2

1D: one ordered axis or feature vector, such as ECG/time series. 2D: two spatial axes, such as an X-ray or RGB photograph. 3D: three spatial axes, such as CT/MRI volume. RGB is typically height-width spatial data with a channel axis, not three spatial dimensions.

### A3

```
sigmoid(x)=1/(1+exp(-x)), range (0,1)
tanh(x), range (-1,1)
ReLU(x)=max(0,x), range [0,infinity)
```

Sigmoid saturates at large magnitude, making derivatives small and contributing to vanishing gradients.

### A4

```
floor((28+2*1-3)/2)+1 = floor(27/2)+1 = 14
```

Output is `14 x 14 x 16`.

### A5

Vanishing gradients shrink through repeated derivatives, losing long dependencies; mitigate with LSTM/GRU or suitable initialization. Exploding gradients grow and destabilize learning; mitigate with gradient clipping. Other valid methods earn credit when explained.

### A6

Reset gate `r_t` controls how much old state helps form the candidate. Update gate `z_t` mixes old and candidate states. Course convention:

```
h_t=(1-z_t)h_(t-1)+z_t*h_tilde_t
```

High `z_t` favors new candidate content.

### A7

```
Attention(Q,K,V)=softmax(QK^T/sqrt(d_k))V
```

Q is what is seeking information; K is matched against queries; V contains retrieved information; `d_k` is query/key vector dimension and stabilizes score scale.

### A8

An encoder maps `x` to latent `z`; decoder reconstructs `x_hat`. Applications: compression/dimensionality reduction, denoising, anomaly detection, and representation learning. Bottleneck/regularization prevents trivial identity copying and forces useful structure.

### A9

```
x_adv=clip(x+epsilon*sign(gradient_x L(theta,x,y)))
```

Targeted chooses a specific wrong output; untargeted seeks any wrong output. For a targeted formulation, the sign/direction may be reversed to minimize target-class loss.

### A10

Transfer learning broadly reuses source knowledge for a target task. Domain adaptation specifically handles source-target distribution shift, such as training on synthetic road images and adapting to real camera images for the same segmentation task.

## Section B solutions

### B11

Conv output remains `32 x 32 x 12` because padding 2 preserves size for a `5 x 5`, stride-1 kernel. Parameters:

```
(5*5*3+1)*12 = 912
```

Pool output is `16 x 16 x 12`. Max pooling applies a fixed maximum operation and has no learned weights or biases.

### B12

Inception applies parallel multi-scale branches and concatenates them. Output depth is `64+96+32+128=320`. A `1 x 1` convolution mixes channels and reduces `C_in` before expensive `3 x 3` or `5 x 5` operations. A ResNet bottleneck uses `1 x 1 -> 3 x 3 -> 1 x 1` with an identity/projection shortcut and addition, improving gradient flow.

### B13

```
parameters = 4*8*(6+8+1) = 480
c_new=0.7*0.5+0.4*0.2=0.43
h_new=0.6*tanh(0.43)=0.2432 approximately
```

Award 2 marks count, 2 marks state update, 1 mark formula/symbol clarity.

### B14

```
N=(256/32)^2=64 patches
patch vector=32*32*3=3072
tokens with CLS=65
projection=(3072+1)*128=393344
positions=65*128=8320
```

### B15

Sample real and noise, generate fake, update D to classify real as 1 and fake as 0, then update G through D to make fake appear real. Minimax:

```
min_G max_D E_x ln D(x)+E_z ln(1-D(G(z)))
```

Non-saturating generator: `L_G=-E_z ln D(G(z))`. Difficulties include mode collapse, instability, imbalance, and vanishing gradients.

### B16

- L1 adds `lambda*sum abs(theta)`, promoting sparsity; too strong underfits.
- L2 adds `lambda*sum theta^2`, smoothly shrinking weights; tune scale/convention.
- Dropout randomly masks activations during training; too much harms learning and behavior changes at inference.
- Augmentation adds label-preserving variation; invalid transforms corrupt labels.
- Early stopping monitors validation performance; do not repeatedly tune on the test set.

## Section C solutions

### C17

| Stage | Shape | Parameters |
|---|---|---|
| Conv1 | `64 x 64 x 16` | `(3*3*3+1)*16=448` |
| Pool1 | `32 x 32 x 16` | 0 |
| Conv2 | `32 x 32 x 32` | `(3*3*16+1)*32=4640` |
| Pool2 | `16 x 16 x 32` | 0 |
| Flatten | `8192` | 0 |
| Dense10 | `10` | `(8192+1)*10=81930` |

Total `448+4640+81930=87018`.

Global average pooling converts `16 x 16 x 32` to 32 values. Dense10 then has `(32+1)*10=330`, and total becomes `448+4640+330=5418`. It discards much positional detail but sharply reduces parameters and often overfitting.

### C18

```
dot products=[1,0]
scaled=[1/sqrt(2),0]=[0.7071,0]
softmax=[0.6698,0.3302]
output=0.6698[2,0]+0.3302[0,4]=[1.3395,1.3210]
```

Encoder: embeddings plus positions; multi-head self-attention; residual addition and layer normalization; position-wise feed-forward; second residual addition and normalization. A pre-normalized variant is also acceptable if stated and drawn consistently.

## Section D solution

### D19.1

Non-overlapping patches: `(256/64)^2=16`. A real sliding output also requires stride, padding, and exact discriminator architecture/receptive field.

### D19.2

For each layer:

```
parameters=(3*3*C_in+1)*C_out
```

| Transition | Parameters |
|---|---|
| `3 -> 32` | 896 |
| `32 -> 64` | 18,496 |
| `64 -> 128` | 73,856 |
| `128 -> 256` | 295,168 |
| `256 -> 512` | 1,180,160 |
| `512 -> 1024` | 4,719,616 |
| `1024 -> 2048` | 18,876,416 |

Total `25,164,608`. This is only the seven stated convolutions, not an unspecified full decoder.

### D19.3-D19.5

Use Pix2Pix for aligned sketch/photo pairs: paired conditional training, U-Net skip connections, PatchGAN, adversarial plus L1 target reconstruction. Use CycleGAN for unpaired summer/winter sets: two mappings and two discriminators, adversarial plus cycle consistency. Pix2Pix requires alignment and may blur or copy artifacts; CycleGAN can change semantics despite cycle consistency. Checks: held-out quantitative metrics, human/visual review, identity/content preservation, subgroup/failure analysis, robustness, and data-license/privacy review. Any three well-justified checks earn credit.

<!-- PAGEBREAK -->

# Mock Paper 2 - Architecture and lab emphasis

## Section A - 30 marks

### Q1 - 3 marks

Define training bias, algorithmic bias, and cognitive bias. Give one mitigation that acts after deployment.

### Q2 - 3 marks

Explain max pooling and average pooling. What is global average pooling and how many outputs does it produce for `10 x 10 x 128`?

### Q3 - 3 marks

Logits are `[1,1,1]` and the second class is correct. Compute softmax probabilities and cross-entropy.

### Q4 - 3 marks

A physical kernel is `3 x 3` with dilation 3. Find effective kernel size and explain why parameter count does not increase.

### Q5 - 3 marks

Distinguish semantic, instance, and panoptic segmentation with a street-scene example.

### Q6 - 3 marks

What is backpropagation through time? Explain truncated BPTT's benefit and limitation.

### Q7 - 3 marks

Why does multi-head attention use several heads? If `d_model=512` and there are 8 heads, find head dimension.

### Q8 - 3 marks

Differentiate a standard autoencoder and variational autoencoder in latent representation, loss, and sampling ability.

### Q9 - 3 marks

Differentiate poisoning and evasion attacks, and white-box and black-box access.

### Q10 - 3 marks

Write L1 and L2 regularized objectives. Which more directly encourages exact zero weights, and why?

## Section B - 30 marks

### Q11 - 5 marks

Perform the valid stride-1 convolution below and give output shape.

```
Input                Kernel
1  0  2              1  -1
2  1  0              0   1
0  3  1
```

### Q12 - 5 marks

Explain why VGG uses repeated `3 x 3` convolutions. Compare parameters in three `3 x 3` layers with one `7 x 7` layer, assuming every input/output has `C` channels and ignoring bias.

### Q13 - 5 marks

A simple RNN has input size 10, hidden size 20, and output size 5. Find recurrent-cell, output-layer, and total parameters including biases. Explain why sequence length is absent.

### Q14 - 5 marks

A GRU has input size 4 and hidden size 3. Find cell parameters. With `z=0.6`, previous hidden `0.2`, and candidate `0.8`, compute the new hidden state using the course convention.

### Q15 - 5 marks

`Q` has shape `7 x 32`, `K` has `11 x 32`, and `V` has `11 x 24`. Find all attention matrix shapes and explain the axis on which softmax operates.

### Q16 - 5 marks

For a medical classifier pretrained on natural images, compare frozen feature extraction, fine-tuning, and domain adaptation. Name one XAI method for a local image explanation and one caution in interpreting it.

## Section C - 20 marks

### Q17 - 10 marks

Design a U-Net-style model for `128 x 128` semantic segmentation. Explain encoder, decoder, bottleneck, skip concatenations, and final output. If four `2 x 2`, stride-2 pooling operations are used, list the spatial size after each. Compare transposed convolution, unpooling, and fixed upsampling.

### Q18 - 10 marks

A binary classifier has `TP=80`, `TN=90`, `FP=10`, and `FN=20`.

1. Compute accuracy, precision, recall, specificity, and F1. (6)
2. Write FGSM and explain how increasing `epsilon` generally affects perceptibility and attack success. (2)
3. Describe an adversarial-training evaluation that avoids reporting misleading robustness. (2)

## Section D - 20 marks

### Q19 - Compulsory CIFAR-10 lab case

A student uses 45,000 training and 5,000 validation images of shape `32 x 32 x 3`, batch size 128, and 20 epochs. The network is Conv32 `3 x 3` same padding, MaxPool2, Conv64 `3 x 3` same padding, MaxPool2, global average pooling, Dense10 softmax. All convolutions have stride 1 and bias.

1. Calculate batches per epoch and total training updates. (4)
2. List all output shapes and calculate all trainable parameters. (8)
3. Explain normalization, one-hot labels, cross-entropy, and Adam in this workflow. (4)
4. Give four reliable anti-overfitting/evaluation practices and identify the role of the untouched test set. (4)

<!-- PAGEBREAK -->

# Mock Paper 2 - Solutions and marking guide

## Section A solutions

1. Training bias comes from sampling/labels, algorithmic bias from objectives/features/model decisions, cognitive bias from human assumptions. Post-deployment mitigation: subgroup monitoring, audit, threshold update, or human review.
2. Max takes maximum, average takes mean, global average averages every spatial position per channel. `10 x 10 x 128 -> 128` outputs.
3. Equal logits give `[1/3,1/3,1/3]`; `L=-ln(1/3)=1.0986`.
4. `K_eff=3(3-1)+1=7`. Dilation changes spacing, not the nine learned elements per input-output channel pair.
5. Semantic labels each pixel class; instance separates individual cars; panoptic combines countable instances with background classes such as road/sky.
6. BPTT unfolds time and propagates gradients through recurrent uses. Truncation lowers memory/cost but limits direct long-range credit assignment.
7. Heads learn different relations/subspaces. `512/8=64` features per head.
8. Standard AE maps to a point code and reconstruction loss. VAE predicts distribution parameters, adds KL regularization, and samples a smooth latent space.
9. Poisoning changes training pipeline; evasion changes inference input. White-box knows internals/gradients; black-box relies on queries or transfer.
10. `L+lambda sum abs(theta)` and `L+lambda sum theta^2`. L1 has a constant-magnitude pull away from zero and a non-smooth point at zero, promoting sparsity.

## Section B solutions

### B11

Output shape is `2 x 2`.

```
top-left = 1*1+0*(-1)+2*0+1*1 = 2
top-right = 0*1+2*(-1)+1*0+0*1 = -2
bottom-left = 2*1+1*(-1)+0*0+3*1 = 4
bottom-right = 1*1+0*(-1)+3*0+1*1 = 2

Output = [ 2  -2 ]
         [ 4   2 ]
```

### B12

Three `3 x 3` stride-1 layers produce a `7 x 7` receptive field, add three nonlinear transformations, and use `3*9C^2=27C^2` weights. One `7 x 7` uses `49C^2`; repeated small kernels use about 44.9 percent fewer weights under equal channel assumptions.

### B13

```
cell=20(10+20+1)=620
output=5(20+1)=105
total=725
```

Weights are shared over time, so sequence length changes operations/activations but not trainable parameters.

### B14

```
parameters=3*3*(4+3+1)=72
h_new=(1-0.6)*0.2+0.6*0.8=0.56
```

### B15

`QK^T` is `(7 x 32)(32 x 11)=7 x 11`. Softmax weights remain `7 x 11`; each of the 7 query rows is normalized across 11 keys. Output `(7 x 11)(11 x 24)=7 x 24`.

### B16

Frozen feature extraction trains only a new head and is safer with little data. Fine-tuning adapts some/all pretrained layers with a small learning rate. Domain adaptation explicitly handles natural-image versus medical-image distribution shift. Grad-CAM gives a local class heatmap, but correlation/localization is not proof of causal reasoning and may be coarse.

## Section C solutions

### C17

Spatial sequence after four pools: `128 -> 64 -> 32 -> 16 -> 8`. The encoder learns increasingly semantic features; bottleneck is deepest representation; decoder upsamples; encoder features at matching scales are concatenated to restore fine boundaries; final `1 x 1` convolution maps features to class logits per pixel. Transposed convolution learns upsampling but can create checkerboard artifacts; unpooling can reuse max-pool indices; interpolation is fixed, stable, and followed by convolution for learning.

### C18

Total `200`.

```
accuracy=(80+90)/200=0.85
precision=80/(80+10)=0.8889
recall=80/(80+20)=0.8
specificity=90/(90+10)=0.9
F1=2*0.8889*0.8/(0.8889+0.8)=0.8421
```

FGSM: `x_adv=clip(x+epsilon*sign(gradient_x L))`. Higher `epsilon` usually increases attack strength but also visible distortion. Robust evaluation reports clean and adversarial accuracy across multiple strengths and adaptive attacks, prevents leakage, and does not rely on one attack that may be defeated by gradient masking.

## Section D solution

### D19.1

```
batches/epoch=ceil(45000/128)=352
total updates=352*20=7040
```

### D19.2

| Stage | Shape | Parameters |
|---|---|---|
| Conv32 | `32 x 32 x 32` | `(3*3*3+1)*32=896` |
| Pool | `16 x 16 x 32` | 0 |
| Conv64 | `16 x 16 x 64` | `(3*3*32+1)*64=18496` |
| Pool | `8 x 8 x 64` | 0 |
| Global average | `64` | 0 |
| Dense10 | `10` | `(64+1)*10=650` |

Total `20,042`.

### D19.3-D19.4

Scale pixels for stable optimization; one-hot vector represents one of ten classes when categorical cross-entropy is used; cross-entropy penalizes low probability on the true class; Adam adaptively scales gradient updates. Reliable practices: augmentation, dropout/weight decay, validation-based early stopping, checkpoint best validation model, inspect per-class metrics/confusion matrix, and avoid leakage. The test set is used once for final generalization estimation, not for tuning.

<!-- PAGEBREAK -->

# Mock Paper 3 - Harder integrated paper

## Section A - 30 marks

### Q1 - 3 marks

Why can an intelligent model fail even when its test accuracy is high? Give three concerns relevant to healthcare, finance, or autonomous systems.

### Q2 - 3 marks

Differentiate parameters and hyperparameters. Classify weights, bias, learning rate, batch size, and number of filters.

### Q3 - 3 marks

A `30 x 30` input uses a `5 x 5` kernel with dilation 2, stride 2, and no padding. Find effective kernel and output size.

### Q4 - 3 marks

Explain why a `1 x 1` convolution can change channel depth but still learn useful combinations.

### Q5 - 3 marks

Differentiate a ResNet residual addition from a U-Net skip concatenation.

### Q6 - 3 marks

Compare simple RNN, LSTM, and GRU in memory mechanism and parameter cost.

### Q7 - 3 marks

Why are positional encodings needed in a Transformer? Distinguish a token embedding from a positional embedding.

### Q8 - 3 marks

Compare Pix2Pix and CycleGAN in data, generator design, and essential loss.

### Q9 - 3 marks

Explain LIME and SHAP as local explanation methods and state one limitation of each.

### Q10 - 3 marks

Give three LLM applications, why the architecture is suitable, and one common risk across them.

## Section B - 30 marks

### Q11 - 5 marks

A feature extractor has Conv `3 x 3, S=1`, Conv `3 x 3, S=2`, and dilated Conv `3 x 3, D=2, S=1`. Find final receptive field and jump, starting at `RF=1, jump=1`.

### Q12 - 5 marks

Compare a direct `5 x 5`, 128-to-256 convolution against a `1 x 1`, 128-to-32 bottleneck followed by `5 x 5`, 32-to-256. Ignore biases. Find both parameter counts and percentage reduction.

### Q13 - 5 marks

An LSTM has input size 12, hidden size 16, and Dense5 output. Calculate all parameters. Explain the role of each of its four transformations.

### Q14 - 5 marks

A Transformer has `d_model=128`, 8 heads. Find head dimension and Q/K/V/output projection parameters including biases. If the sequence has 65 tokens, find attention-score entries across all heads.

### Q15 - 5 marks

For `D(real)=0.75` and `D(fake)=0.25`, calculate average discriminator BCE and non-saturating generator loss. Interpret which network currently has the easier task.

### Q16 - 5 marks

A model has data loss 0.5, parameters `[2,-1,0.5]`, and `lambda=0.1`. Calculate L1 and L2 total objectives. Explain why comparing their raw penalty values alone does not choose the better model.

## Section C - 20 marks

### Q17 - 10 marks

Explain AlexNet, VGG, Inception, and ResNet as a progression in CNN design. Include at least one calculation or formula illustrating a design choice, and discuss depth, computation, gradient flow, and overfitting.

### Q18 - 10 marks

Design a sequence classifier and compare an LSTM, a bidirectional GRU, and a Transformer encoder for the task. Discuss parameter sharing, long-range context, parallelism, causal/streaming constraints, padding masks, and an appropriate output/loss.

## Section D - 20 marks

### Q19 - Compulsory robust-ViT case

A safety inspection system classifies `224 x 224 x 3` images. A ViT uses `16 x 16` patches, embedding dimension 256, one CLS token, and 8 attention heads. An evaluation set produces `TP=72`, `TN=18`, `FP=6`, `FN=4`. One normalized pixel vector is `x=[0.02,0.50,0.98]`; its input-gradient signs are `[-1,+1,+1]`, with FGSM `epsilon=0.05`.

1. Find patch count, patch vector length, sequence length, patch-projection parameters including bias, positional parameters, and CLS-token parameters. (7)
2. Find per-head dimension and attention-score entries across all heads. (3)
3. Calculate accuracy, precision, recall, specificity, and F1. (5)
4. Calculate the adversarial pixel vector after clipping to `[0,1]`. (2)
5. Recommend three controls using robustness, XAI, monitoring, or human review. Explain why a heatmap alone is insufficient. (3)

<!-- PAGEBREAK -->

# Mock Paper 3 - Solutions and marking guide

## Section A solutions

1. Accuracy can hide subgroup errors, distribution shift, calibration/uncertainty, adversarial vulnerability, data leakage, or costly false negatives. Any three contextualized concerns.
2. Parameters are learned: weights and biases. Hyperparameters are chosen/configured: learning rate, batch size, and number of filters, though filters determine how many learned parameters exist.
3. `K_eff=2(5-1)+1=9`; output `floor((30-9)/2)+1=11`.
4. At each pixel a `1 x 1` filter takes a learned weighted combination across all input channels. Multiple filters create any requested output depth at low spatial cost.
5. ResNet usually adds `F(x)+x` at similar semantic scale for optimization. U-Net concatenates matching encoder detail with decoder features for spatial recovery, increasing channel depth.
6. RNN has one recurrent state and least cost but weak long memory; GRU uses reset/update and three transforms; LSTM has separate cell plus four transforms and usually most parameters.
7. Attention alone has no order. Token embedding encodes content; positional embedding/encoding identifies order or patch location.
8. Pix2Pix is paired, commonly U-Net+PatchGAN, adversarial+L1. CycleGAN is unpaired, two residual generators/discriminators, adversarial+cycle consistency.
9. LIME fits a local simple surrogate and may be unstable/sensitive to sampling. SHAP assigns Shapley-style contributions and can be computationally expensive or assumption-sensitive.
10. Examples: summarization, QA, code, extraction, translation. Self-attention models context and generation; common risk is hallucination, bias, privacy leakage, or unsafe output.

## Section B solutions

### B11

Use effective kernel for the dilated layer.

| Layer | RF calculation | RF | Jump |
|---|---|---|---|
| Conv3 S1 | `1+(3-1)*1` | 3 | 1 |
| Conv3 S2 | `3+(3-1)*1` | 5 | 2 |
| Conv3 D2 | `5+(5-1)*2` | 13 | 2 |

The dilated physical `3 x 3` has effective size 5. Final receptive field is `13 x 13`; jump is 2.

### B12

```
direct=5*5*128*256=819200
bottleneck=1*1*128*32+5*5*32*256
          =4096+204800=208896
reduction=(819200-208896)/819200*100=74.50 percent
```

### B13

```
LSTM=4*16*(12+16+1)=1856
Dense=(16+1)*5=85
total=1941
```

Four transformations produce forget gate, input gate, candidate cell content, and output gate.

### B14

```
d_head=128/8=16
projection weights=4*128*128=65536
biases=4*128=512
projection total=66048
score entries=8*65*65=33800
```

### B15

```
L_D=-0.5[ln(0.75)+ln(1-0.25)]=0.2877
L_G=-ln(0.25)=1.3863
```

D is currently doing relatively well on both examples; G has a high loss and must improve. This one snapshot does not prove stable training.

### B16

```
L1=0.5+0.1*(2+1+0.5)=0.85
L2=0.5+0.1*(4+1+0.25)=1.025
```

Different penalties have different scales and geometry. Choose `lambda` by validation/generalization, not by whichever numeric objective happens to be smaller.

## Section C solutions

### C17 marking points

- AlexNet: large early kernels, ReLU, GPU, dropout/augmentation; e.g. Conv1 output `55 x 55 x 96` from `227`, kernel 11, stride 4.
- VGG: uniform deep `3 x 3` stacks; three such layers have RF 7 and `27C^2` versus `49C^2` weights for one `7 x 7` under equal channels.
- Inception: parallel scales and channel concatenation; `1 x 1` bottlenecks reduce cost.
- ResNet: `H(x)=F(x)+x`; direct gradient/information route, projection when shapes differ, bottleneck blocks.
- Tradeoffs: depth improves representation but increases compute/overfitting; augmentation/regularization and good optimization are still needed.

Award up to 2 marks each architecture and 2 marks coherent progression/calculation.

### C18 marking points

- LSTM shares recurrent parameters, handles order sequentially, has explicit cell memory, supports streaming in forward direction.
- Bidirectional GRU is lighter per direction but processes past and future; cannot produce truly online output without future context.
- Transformer parallelizes positions during training and models long relations through attention, but standard attention is quadratic and needs positional information.
- Use padding masks so padded tokens do not receive attention; use a causal mask only if future tokens must be hidden.
- Many-to-one classification can use final state, pooled valid states, or a special token, followed by Dense softmax and cross-entropy for single-label classes.

## Section D solution

### D19.1

```
N=(224/16)^2=14^2=196 patches
patch vector=16*16*3=768
sequence length=197
projection=(768+1)*256=196864
positions=197*256=50432
CLS token=256
```

Subtotal for these embeddings is `247,552` parameters.

### D19.2

```
d_head=256/8=32
score entries=8*197*197=310472
```

### D19.3

Total is 100.

```
accuracy=(72+18)/100=0.90
precision=72/(72+6)=0.9231
recall=72/(72+4)=0.9474
specificity=18/(18+6)=0.75
F1=2*0.9231*0.9474/(0.9231+0.9474)=0.9351
```

### D19.4

```
raw=[0.02,0.50,0.98]+0.05[-1,+1,+1]
   =[-0.03,0.55,1.03]
clipped=[0,0.55,1]
```

### D19.5

Valid controls include adversarial training and multi-attack evaluation, subgroup/shift monitoring, confidence-based escalation, calibrated thresholds, human review of uncertain/high-impact decisions, and Grad-CAM/other XAI audits. A heatmap is coarse, can be unstable, and shows association with a prediction rather than causal correctness; it must not replace robustness or outcome validation.

# How to score yourself

| Score | Meaning tonight | Next action |
|---|---|---|
| 80-100 | Strong coverage | Redo only errors and memorize formula sheet |
| 65-79 | Passable but leaks marks | Redo every numerical and two weak theory answers |
| 50-64 | Recognition without reliable recall | Focus on Paper 1 solutions and Workbook Level 1-2 |
| Below 50 | Too much material still passive | Stop full mocks; master CNN, RNN gates, attention, GAN, and five comparisons |

For theory marking, award yourself only if the point is explicit on paper. Thinking the idea is not the same as writing it.
