# Intelligent Model Design

## Numerical Practice Workbook

**35 worked examples + 36 independent drills + answer key**

This workbook assumes you are not comfortable with mathematics. Every method is broken into small moves. Keep a blank sheet over the solution, attempt each question, and reveal only one line when stuck.

> A numerical is a recipe. Marks come from choosing the recipe, showing the ingredients, and carrying out the arithmetic - not from doing it in your head.

## How to use this tonight

1. Do Worked Examples 1-12 because CNN arithmetic is the highest-risk area.
2. Do Examples 13-25 for recurrent models, attention, and ViT.
3. Do Examples 26-35 for generative models, attacks, regularization, and metrics.
4. Attempt the independent drills without notes.
5. Mark with the final answer key. Redo every wrong problem from a blank page.

## Your compulsory four-line format

```
Given: write all numbers with symbols.
Formula: write the general equation and define unfamiliar symbols.
Substitution: put the values into the equation.
Answer: state the result, shape, unit, and assumption.
```

## Arithmetic survival rules

- Keep dimensions as integers until the final `floor` or `ceil`.
- For parameter counts, write `kernel height * kernel width * input channels * output channels`, then biases.
- For shapes, calculate height, width, and depth separately.
- In softmax, subtracting the maximum logit is safe and prevents huge exponentials.
- Use at least four decimal places during intermediate probability calculations.
- If a convention is missing, state it: bias included or excluded, padding, stride, overlapping patches, and GRU update convention.

# Formula starter card

| Problem type | Formula | Meaning of symbols |
|---|---|---|
| Updates | `E * ceil(M/B)` | `E` epochs, `M` samples, `B` batch size |
| Conv effective kernel | `K_eff = D(K-1)+1` | `K` physical kernel, `D` dilation |
| Conv output | `floor((N+2P-D(K-1)-1)/S)+1` | `N` input, `P` padding, `S` stride |
| Conv parameters | `(K_h*K_w*C_in+1)*C_out` | `+1` is bias per output channel |
| Dense parameters | `(N_in+1)*N_out` | one bias per output neuron |
| Softmax | `exp(z_i)/sum_j exp(z_j)` | `z_i` class logit |
| Cross-entropy | `-ln(p_c)` | `p_c` correct-class probability |
| Simple RNN | `n_h(n_x+n_h+1)+n_y(n_h+1)` | input, hidden, output sizes |
| LSTM cell | `4n_h(n_x+n_h+1)` | four gate/candidate transforms |
| GRU cell | `3n_h(n_x+n_h+1)` | three transforms |
| Attention | `softmax(QK^T/sqrt(d_k))V` | query, key, value, key dimension |
| ViT patches | `(H/P_h)(W/P_w)` | image and patch dimensions |
| MSE | `(1/n) sum_i (x_i-x_hat_i)^2` | mean squared reconstruction error |
| FGSM | `clip(x+epsilon*sign(gradient_x L))` | attack step of size `epsilon` |

# A. Training, convolution and CNNs

## Worked Example 1 - Epochs, batches and updates

**Question.** A dataset has 100,000 training samples. Batch size is 100 and training runs for 10 epochs. Find iterations per epoch and total parameter updates.

**Solution.**

```
Given: M = 100000, B = 100, E = 10
Batches per epoch = ceil(M/B) = ceil(100000/100) = 1000
Total updates = E * batches per epoch = 10 * 1000 = 10000
Answer: 1000 iterations per epoch; 10000 updates in total.
```

`M` is sample count, `B` is samples per batch, and `E` is epochs.

## Worked Example 2 - Incomplete final batch

**Question.** There are 10,250 samples, batch size 128, and 6 epochs. The last smaller batch is used. Find batches per epoch and total updates.

```
ceil(10250/128) = ceil(80.078125) = 81 batches/epoch
total = 6 * 81 = 486 updates
```

If the problem explicitly says to discard the incomplete batch, use `floor`, giving 80 batches per epoch. Otherwise `ceil` is the usual safe answer.

## Worked Example 3 - One valid convolution by hand

**Question.** Apply the `2 x 2` kernel to the `4 x 4` input with stride 1 and no padding. CNN convolution normally uses the kernel as written, without flipping it.

```
Input X              Kernel K
1  2  0  1           1   0
3  1  2  2          -1   1
0  1  3  1
2  2  1  0
```

The first output is the sum of element-wise products:

```
Y(1,1) = 1*1 + 2*0 + 3*(-1) + 1*1 = -1
```

Repeating at every valid position gives:

```
Output Y
-1   3   0
 4   3   0
 0   0   2
```

The output is `3 x 3` because `(4-2)/1 + 1 = 3` in each direction.

## Worked Example 4 - General convolution output shape

**Question.** Input is `64 x 48 x 3`. A convolution has 20 filters of size `5 x 3`, stride `2 x 1`, padding `2 x 1`, and dilation 1. Find output shape.

For height:

```
H_out = floor((64 + 2*2 - 1*(5-1) - 1)/2) + 1
      = floor(63/2) + 1 = 31 + 1 = 32
```

For width:

```
W_out = floor((48 + 2*1 - 1*(3-1) - 1)/1) + 1
      = 48
```

Depth equals number of filters, so the answer is `32 x 48 x 20`.

## Worked Example 5 - Dilated convolution

**Question.** A `20 x 20` input uses a `5 x 5` kernel, stride 1, no padding. Calculate outputs for dilation 1, 2, and 3.

```
K_eff = D(K-1)+1
D=1: K_eff=5,  output=20-5+1=16  -> 16 x 16
D=2: K_eff=9,  output=20-9+1=12  -> 12 x 12
D=3: K_eff=13, output=20-13+1=8  -> 8 x 8
```

The number of kernel weights does not change with dilation; only their spacing changes.

## Worked Example 6 - Convolution parameters

**Question.** A layer has 64 filters of size `3 x 3`, receives 32 channels, and uses one bias per filter. Find trainable parameters.

```
weights = 3 * 3 * 32 * 64 = 18432
biases = 64
total = 18432 + 64 = 18496
```

Equivalent compact form: `(3*3*32 + 1)*64 = 18496`.

## Worked Example 7 - Full small CNN: shapes and parameters

**Question.** Analyze this network:

- Input `32 x 32 x 3`
- Conv1: 16 filters, `3 x 3`, stride 1, padding 1
- MaxPool1: `2 x 2`, stride 2
- Conv2: 32 filters, `5 x 5`, stride 1, no padding
- MaxPool2: `2 x 2`, stride 2
- Flatten, Dense 10

| Stage | Output shape | Trainable parameters |
|---|---|---|
| Input | `32 x 32 x 3` | 0 |
| Conv1 | `32 x 32 x 16` | `(3*3*3+1)*16 = 448` |
| Pool1 | `16 x 16 x 16` | 0 |
| Conv2 | `12 x 12 x 32` | `(5*5*16+1)*32 = 12832` |
| Pool2 | `6 x 6 x 32` | 0 |
| Flatten | `1152` | 0 |
| Dense | `10` | `(1152+1)*10 = 11530` |

```
Total trainable parameters = 448 + 12832 + 11530 = 24810
```

## Worked Example 8 - Receptive field through layers

**Question.** Find receptive field after Conv `3 x 3, S=1`, Pool `2 x 2, S=2`, Conv `3 x 3, S=1`, Pool `2 x 2, S=2`.

Start with receptive field `RF=1` and jump `j=1`.

| Layer | Calculation | New RF | New jump |
|---|---|---|---|
| Conv3 | `1 + (3-1)*1` | 3 | `1*1=1` |
| Pool2 | `3 + (2-1)*1` | 4 | `1*2=2` |
| Conv3 | `4 + (3-1)*2` | 8 | `2*1=2` |
| Pool2 | `8 + (2-1)*2` | 10 | `2*2=4` |

Answer: each final feature sees a `10 x 10` input region; neighboring final features are four input pixels apart.

## Worked Example 9 - AlexNet Conv1

**Question.** Input `227 x 227 x 3`, 96 filters of `11 x 11`, stride 4, padding 0. Find shape and parameters.

```
spatial output = floor((227-11)/4)+1 = 55
shape = 55 x 55 x 96
parameters = (11*11*3+1)*96 = 34944
```

Without biases it would be 34,848. State which convention you use.

## Worked Example 10 - Inception concatenation and bottleneck saving

**Question.** An Inception module outputs 128, 192, 96, and 256 channels in four same-resolution branches. Find output depth. Also compare a direct `3 x 3`, 256-to-192 convolution with a `1 x 1` reduction to 64 followed by the same 192-filter `3 x 3` convolution. Ignore bias.

```
concatenated depth = 128+192+96+256 = 672

direct weights = 3*3*256*192 = 442368
bottleneck weights = 1*1*256*64 + 3*3*64*192
                   = 16384 + 110592 = 126976
saving = 442368 - 126976 = 315392 weights
reduction = 315392/442368 * 100 = 71.29 percent
```

## Worked Example 11 - Softmax and cross-entropy

**Question.** Logits are `[2, 1, 0]`; class 1 is correct. Compute softmax and loss. Here class numbering follows vector positions 1, 2, 3.

```
exp(2)=7.3891, exp(1)=2.7183, exp(0)=1
sum=11.1074
p=[7.3891/11.1074, 2.7183/11.1074, 1/11.1074]
 =[0.6652, 0.2447, 0.0900]
L=-ln(0.6652)=0.4076
```

Probabilities sum to approximately 1. Lower loss means greater probability on the correct class.

## Worked Example 12 - Binary classifier metrics

**Question.** `TP=45, TN=40, FP=10, FN=5`. Find accuracy, precision, recall, and F1.

Definitions: `TP` true positives, `TN` true negatives, `FP` false positives, `FN` false negatives.

```
accuracy = (TP+TN)/(TP+TN+FP+FN) = 85/100 = 0.85
precision = TP/(TP+FP) = 45/55 = 0.8182
recall = TP/(TP+FN) = 45/50 = 0.9000
F1 = 2*precision*recall/(precision+recall) = 0.8571
```

# B. RNN, LSTM and GRU

## Worked Example 13 - Simple RNN parameter count

**Question.** Input size `n_x=5`, hidden size `n_h=4`, output size `n_y=3`. Include biases.

```
cell = n_h(n_x+n_h+1) = 4(5+4+1) = 40
output = n_y(n_h+1) = 3(4+1) = 15
total = 40+15 = 55
```

There are still 55 parameters for a sequence of length 5 or 500 because weights are shared across time.

## Worked Example 14 - One scalar RNN update

**Question.** `x_t=0.5`, `h_(t-1)=-0.2`, `W_xh=0.8`, `W_hh=0.5`, `b_h=0.1`. Find `h_t`.

```
a_t = W_xh*x_t + W_hh*h_(t-1) + b_h
    = 0.8*0.5 + 0.5*(-0.2) + 0.1
    = 0.4
h_t = tanh(0.4) = 0.3799
```

`a_t` is the pre-activation; `tanh` squashes it to between -1 and 1.

## Worked Example 15 - LSTM parameter count

**Question.** Input dimension 5 and hidden dimension 4. Find LSTM cell parameters; no separate output layer.

```
4*n_h*(n_x+n_h+1) = 4*4*(5+4+1) = 160
```

Why 4? Forget gate, input gate, candidate memory, and output gate each need weights and bias.

## Worked Example 16 - LSTM state update

**Question.** For one scalar cell, `f_t=0.8`, `i_t=0.3`, `c_(t-1)=0.6`, `c_tilde_t=-0.5`, and `o_t=0.7`. Find `c_t` and `h_t`.

```
c_t = f_t*c_(t-1) + i_t*c_tilde_t
    = 0.8*0.6 + 0.3*(-0.5)
    = 0.48 - 0.15 = 0.33

h_t = o_t*tanh(c_t)
    = 0.7*tanh(0.33)
    = 0.7*0.3185 = 0.2230
```

## Worked Example 17 - GRU parameter count

**Question.** Input dimension 5 and hidden dimension 4. Find GRU cell parameters.

```
3*n_h*(n_x+n_h+1) = 3*4*(5+4+1) = 120
```

## Worked Example 18 - GRU update

**Question.** Using the course convention, `z_t=0.7`, previous hidden state `h_(t-1)=0.5`, and candidate `h_tilde_t=-0.2`. Find new hidden state.

```
h_t = (1-z_t)*h_(t-1) + z_t*h_tilde_t
    = 0.3*0.5 + 0.7*(-0.2)
    = 0.15 - 0.14 = 0.01
```

High `z_t` in this convention gives more weight to the candidate. If your textbook uses the reversed convention, state it before calculating.

## Worked Example 19 - Truncated BPTT windows

**Question.** A sequence has 103 time steps and is processed in non-overlapping TBPTT windows of 20, keeping the final shorter window. How many windows?

```
windows = ceil(103/20) = ceil(5.15) = 6
```

The final window contains 3 time steps. TBPTT reduces memory/computation but limits how far direct gradient propagation reaches in one update.

# C. Attention, Transformer and ViT

## Worked Example 20 - Scaled dot-product attention

**Question.** One query is `q=[1,0]`. Keys are `k1=[1,0]`, `k2=[0,1]`. Values are `v1=[2,0]`, `v2=[0,4]`. Use `d_k=2`.

First calculate scores:

```
q.k1 = 1, q.k2 = 0
scaled scores = [1/sqrt(2), 0] = [0.7071, 0]
```

Softmax weights:

```
exp(0.7071)=2.0281, exp(0)=1
weights = [2.0281/3.0281, 1/3.0281]
        = [0.6698, 0.3302]
```

Weighted values:

```
output = 0.6698*[2,0] + 0.3302*[0,4]
       = [1.3395, 1.3210]
```

## Worked Example 21 - Attention shapes

**Question.** `Q` has shape `6 x 8`, `K` has `10 x 8`, and `V` has `10 x 12`. Find shapes of the score matrix, attention weights, and output.

```
QK^T: (6 x 8)(8 x 10) = 6 x 10
softmax weights: 6 x 10
weights times V: (6 x 10)(10 x 12) = 6 x 12
```

The inner dimensions must match. There are 6 queries attending over 10 key-value positions.

## Worked Example 22 - Multi-head dimensions and projection parameters

**Question.** `d_model=128` and `h=8` heads. Find per-head dimension and the parameters of Q, K, V, and output projections when all are `128 x 128`. Include biases.

```
d_head = d_model/h = 128/8 = 16
weights = 4 * 128 * 128 = 65536
biases = 4 * 128 = 512
total = 66048
```

The four projections are Q, K, V, and output. This count excludes feed-forward and layer-normalization parameters.

## Worked Example 23 - ViT patch count and token size

**Question.** Image `256 x 256 x 3`, patch `32 x 32`. Find patch count, flattened patch length, and sequence length with one CLS token.

```
patches along each side = 256/32 = 8
N = 8*8 = 64 patches
patch vector length = 32*32*3 = 3072
sequence length = N+1 = 65 tokens
```

## Worked Example 24 - ViT patch and positional parameters

**Question.** Continue Example 23 with embedding dimension `D_e=128`. Include patch-projection bias and learned positions for CLS plus all patches.

```
patch projection = (3072+1)*128 = 393344
positional embedding = 65*128 = 8320
CLS token itself = 1*128 = 128 learned parameters
subtotal = 393344+8320+128 = 401792
```

This subtotal excludes Transformer encoder parameters.

## Worked Example 25 - Patch size versus attention cost

**Question.** For a `224 x 224` image, compare non-overlapping patch sizes 16 and 32. Ignore CLS and assume attention-score count is `N^2`.

```
P=16: N=(224/16)^2=14^2=196; N^2=38416
P=32: N=(224/32)^2=7^2=49; N^2=2401
ratio = 38416/2401 = 16
```

Halving patch side makes four times as many tokens and approximately sixteen times as many pairwise attention scores.

# D. Autoencoder, GAN, attacks and regularization

## Worked Example 26 - Autoencoder reconstruction MSE

**Question.** `x=[1,0,0.5]`, reconstruction `x_hat=[0.8,0.1,0.4]`. Find SSE and MSE.

```
errors = [0.2,-0.1,0.1]
squared errors = [0.04,0.01,0.01]
SSE = 0.04+0.01+0.01 = 0.06
MSE = SSE/3 = 0.02
```

`SSE` is sum of squared errors. `MSE` divides by the number of values.

## Worked Example 27 - GAN discriminator and generator losses

**Question.** For one real and one generated sample, `D(x)=0.9` and `D(G(z))=0.2`. Compute average binary discriminator loss and non-saturating generator loss.

```
L_D = -0.5[ln D(x) + ln(1-D(G(z)))]
    = -0.5[ln(0.9)+ln(0.8)]
    = 0.1643

L_G = -ln D(G(z)) = -ln(0.2) = 1.6094
```

Some questions use a sum rather than average for `L_D`; that answer is `0.3285`. State the convention.

## Worked Example 28 - Patch count

**Question.** Divide `256 x 256` into non-overlapping `64 x 64` patches.

```
patches per side = 256/64 = 4
total = 4*4 = 16
```

If patches slide with a stated stride `S`, use the convolution-output equation. Patch size alone does not define a real PatchGAN output map.

## Worked Example 29 - Seven-layer Pix2Pix encoder parameters

**Question.** A simplified seven-convolution encoder starts with RGB input and 32 output channels, then doubles channels every layer: `3 -> 32 -> 64 -> 128 -> 256 -> 512 -> 1024 -> 2048`. Every kernel is `3 x 3`; include bias.

| Layer | Parameters |
|---|---|
| `3 -> 32` | `(3*3*3+1)*32 = 896` |
| `32 -> 64` | `(3*3*32+1)*64 = 18496` |
| `64 -> 128` | `(3*3*64+1)*128 = 73856` |
| `128 -> 256` | `(3*3*128+1)*256 = 295168` |
| `256 -> 512` | `(3*3*256+1)*512 = 1180160` |
| `512 -> 1024` | `(3*3*512+1)*1024 = 4719616` |
| `1024 -> 2048` | `(3*3*1024+1)*2048 = 18876416` |

```
total = 25164608 parameters
```

Without bias the total is 25,160,544. The full U-Net decoder would add parameters and cannot be counted without its channel specification.

## Worked Example 30 - Cycle-consistency L1 loss

**Question.** For one `x` sample, `F(G(x))-x = [0.1,-0.2,0]`. For one `y` sample, `G(F(y))-y=[-0.3,0.1]`. Find unweighted cycle loss.

```
X reconstruction L1 = abs(0.1)+abs(-0.2)+abs(0) = 0.3
Y reconstruction L1 = abs(-0.3)+abs(0.1) = 0.4
L_cyc = 0.3+0.4 = 0.7
```

If a coefficient `lambda_cyc` is given, multiply: total cycle term is `lambda_cyc * 0.7`.

## Worked Example 31 - FGSM vector

**Question.** Clean input `x=[0.20,0.90,0.05]`, input gradient `g=[-0.4,0.2,-0.1]`, `epsilon=0.10`, valid range `[0,1]`. Find untargeted FGSM input.

```
sign(g) = [-1,+1,-1]
x + epsilon*sign(g) = [0.10,1.00,-0.05]
clip to [0,1] = [0.10,1.00,0.00]
```

Answer: `x_adv=[0.10,1.00,0.00]`.

## Worked Example 32 - BIM projection idea

**Question.** Original scalar pixel `x=0.60`, `epsilon=0.10`, step `alpha=0.04`, and the gradient sign is positive for four steps. Pixel range is `[0,1]`. Find value after each projected step.

Allowed adversarial interval is `[x-epsilon, x+epsilon]=[0.50,0.70]`.

```
step 1: 0.60+0.04=0.64
step 2: 0.64+0.04=0.68
step 3: 0.68+0.04=0.72 -> project to 0.70
step 4: 0.70+0.04=0.74 -> project to 0.70
```

Projection prevents the cumulative attack from exceeding `epsilon` around the clean input.

## Worked Example 33 - L1 and L2 regularized loss

**Question.** Data loss is 0.50, parameters are `theta=[2,-1,0.5]`, and `lambda=0.10`. Compute total L1 and L2 losses using the lecture convention without a `1/2` factor.

```
sum abs(theta) = 2+1+0.5 = 3.5
L_L1 = 0.50 + 0.10*3.5 = 0.85

sum theta^2 = 4+1+0.25 = 5.25
L_L2 = 0.50 + 0.10*5.25 = 1.025
```

Do not infer that L1 is always numerically larger or smaller; it depends on values and the formula convention.

## Worked Example 34 - One gradient-descent update

**Question.** Current weight `w=1.20`, gradient `dL/dw=0.50`, learning rate `eta=0.10`. Find updated weight.

```
w_new = w_old - eta*(dL/dw)
      = 1.20 - 0.10*0.50
      = 1.15
```

`eta` is learning rate. The minus sign moves against the loss gradient.

## Worked Example 35 - Precision-recall tradeoff

**Question.** Model A has precision 0.90 and recall 0.60. Model B has precision 0.75 and recall 0.80. Find both F1 scores.

```
F1_A = 2*0.90*0.60/(0.90+0.60) = 1.08/1.50 = 0.72
F1_B = 2*0.75*0.80/(0.75+0.80) = 1.20/1.55 = 0.7742
```

Model B has the higher balance under F1 even though Model A has higher precision.

# Independent drills - do not look at the key

## Level 1 - Build confidence

1. A training set has 7,500 samples, batch size 50, and 12 epochs. Find batches per epoch and total updates.
2. A training set has 5,001 samples and batch size 64. The last incomplete batch is kept. Find batches per epoch.
3. Find output shape for input `28 x 28 x 1`, 10 filters of `5 x 5`, stride 1, no padding.
4. Find output shape for input `32 x 32 x 3`, 24 filters of `3 x 3`, stride 2, padding 1.
5. Find parameters in a `5 x 5` convolution from 16 to 40 channels, including bias.
6. A feature map is `8 x 8 x 64`. It is flattened and connected to 100 neurons. Find dense parameters.
7. A `2 x 2`, stride-2 max pool receives `18 x 18 x 20`, no padding. Find output and trainable parameters.
8. Compute ReLU and sigmoid approximately for `x=0`. Then compute Leaky ReLU with `alpha=0.01` for `x=-4`.
9. For true-class probability 0.8, compute cross-entropy loss.
10. A scalar LSTM has `f=0.9`, `i=0.2`, old cell `c=0.5`, candidate `-0.4`. Find new cell state.
11. Using the course GRU convention, `z=0.25`, old hidden `0.8`, candidate `0`. Find new hidden state.
12. A `128 x 128 x 3` image uses `16 x 16` ViT patches. Find patch count and flattened patch length.

## Level 2 - Exam standard

13. Input `50 x 50`, kernel `3`, dilation 3, stride 2, padding 3. Find effective kernel and output size.
14. Analyze shapes and total parameters: input `28 x 28 x 1`; Conv 8 filters `3 x 3`, padding 1; Pool `2 x 2`, stride 2; Conv 16 filters `3 x 3`, no padding; flatten; Dense 10. Include biases.
15. Two `3 x 3`, stride-1 convolutions are followed by `2 x 2`, stride-2 pooling. Find final receptive field and jump.
16. Direct convolution maps 128 channels to 256 with a `5 x 5` kernel. A bottleneck instead maps 128 to 32 by `1 x 1`, then 32 to 256 by `5 x 5`. Ignore bias. Find both parameter counts and percent saving.
17. Logits `[1,1,1]` with class 2 correct. Find probabilities and cross-entropy.
18. A simple RNN has input 10, hidden 20, output 4. Include all biases. Find parameters.
19. An LSTM has input 12 and hidden 16. A dense output maps 16 to 5 classes. Find total parameters.
20. A GRU has input 12 and hidden 16, with no separate output. Find parameters.
21. For a scalar LSTM: `f=0.6`, `i=0.5`, `c_old=-0.4`, candidate `0.8`, `o=0.75`. Find `c_new` and `h_new`.
22. `Q` is `7 x 32`, `K` is `11 x 32`, `V` is `11 x 24`. Find attention-score and output shapes.
23. `d_model=512`, heads=8. Find dimension per head. If sequence length is 100, how many attention scores exist across all heads?
24. A `224 x 224 x 3` ViT uses `16 x 16` patches and embedding dimension 768. Find patch count, sequence length with CLS, flattened patch length, and patch-projection parameters including bias.

## Level 3 - Case and ambiguity handling

25. A `64 x 64 x 3` input enters Conv1 with 32 `3 x 3`, stride 1, padding 1; Pool `2 x 2`, stride 2; Conv2 with 64 `3 x 3`, stride 2, padding 1; global average pooling; Dense 5. Find every shape and total parameters.
26. A `30 x 30` input uses a `5 x 5` dilated kernel with `D=2`, stride 2. Find output for (a) no padding and (b) padding 4.
27. An input `x=[1,2]` and reconstruction `[0,2.5]` are evaluated by MSE. Find SSE, MSE, and RMSE.
28. For `D(real)=0.75`, `D(fake)=0.25`, calculate discriminator loss using the average BCE convention and non-saturating generator loss.
29. A `256 x 256` image is scanned with a `64 x 64` patch, stride 32, no padding. Find number of patch positions. Compare with non-overlapping patches.
30. In CycleGAN, two L1 reconstruction errors are 1.2 and 0.8. `lambda_cyc=10`; adversarial losses total 1.5. Find combined objective under simple addition.
31. Clean vector `[0.02,0.50,0.98]`, gradient signs `[-1,+1,+1]`, `epsilon=0.05`, valid pixels `[0,1]`. Find FGSM output.
32. `TP=72, TN=18, FP=6, FN=4`. Find accuracy, precision, recall, specificity, and F1.
33. A model has data loss 2.0 and weights `[-2,3]`. With `lambda=0.01`, calculate L1 and L2 total losses using the stated lecture formulas.
34. A Pix2Pix encoder has channels `3 -> 64 -> 128 -> 256`, all `4 x 4` kernels with no bias. Find total parameters.
35. A ViT changes patch size from 32 to 16 for a `256 x 256` image. Ignore CLS. Find token counts and the factor increase in `N^2` attention scores.
36. A dataset has 60,000 samples. Use 70 percent train, 15 percent validation, 15 percent test. With train batch size 256 and incomplete batch retained, find split counts and training batches per epoch.

<!-- PAGEBREAK -->

# Answer key

## Level 1 answers

1. `150` batches/epoch; `1800` updates.
2. `ceil(5001/64)=79` batches.
3. `(28-5)+1=24`, so `24 x 24 x 10`.
4. `floor((32+2-3)/2)+1=16`, so `16 x 16 x 24`.
5. `(5*5*16+1)*40 = 16040`.
6. Input neurons `8*8*64=4096`; `(4096+1)*100 = 409700`.
7. `9 x 9 x 20`; zero trainable parameters.
8. `ReLU(0)=0`; `sigmoid(0)=0.5`; Leaky ReLU `=-0.04`.
9. `-ln(0.8)=0.2231`.
10. `c_new=0.9*0.5+0.2*(-0.4)=0.37`.
11. `h_new=(1-0.25)*0.8+0.25*0=0.6`.
12. `(128/16)^2=64` patches; vector length `16*16*3=768`.

## Level 2 answers

13. `K_eff=3(3-1)+1=7`; output `floor((50+6-7)/2)+1=25`.
14. Conv1 `28 x 28 x 8`, 80 params; pool `14 x 14 x 8`; Conv2 `12 x 12 x 16`, 1168 params; flatten 2304; dense 23,050; total `24,298`.
15. Start `RF=1,j=1`; after two convs `RF=5,j=1`; after pool `RF=6,j=2`.
16. Direct `5*5*128*256=819200`; bottleneck `128*32+5*5*32*256=208896`; saving `610304`, or `74.50 percent`.
17. Each probability `1/3`; loss `-ln(1/3)=1.0986`.
18. Cell `20(10+20+1)=620`; output `4(20+1)=84`; total `704`.
19. LSTM `4*16*(12+16+1)=1856`; dense `(16+1)*5=85`; total `1941`.
20. `3*16*(12+16+1)=1392`.
21. `c_new=0.6*(-0.4)+0.5*0.8=0.16`; `h_new=0.75*tanh(0.16)=0.1190` approximately.
22. Score/weights `7 x 11`; output `7 x 24`.
23. Per-head `512/8=64`; scores `8*100*100=80000`.
24. `196` patches; `197` tokens; patch vector `768`; projection `(768+1)*768=590592`.

## Level 3 answers

25. Conv1 `64 x 64 x 32`, params 896; pool `32 x 32 x 32`; Conv2 `16 x 16 x 64`, params 18,496; global average `64`; dense `5`, params 325; total `19,717`.
26. `K_eff=9`. No padding: `floor((30-9)/2)+1=11`. Padding 4: `floor((30+8-9)/2)+1=15`.
27. Squared errors `[1,0.25]`; SSE `1.25`; MSE `0.625`; RMSE `sqrt(0.625)=0.7906`.
28. `L_D=-0.5[ln(0.75)+ln(0.75)]=0.2877`; `L_G=-ln(0.25)=1.3863`.
29. Per side `floor((256-64)/32)+1=7`; total `49`. Non-overlapping gives `16`.
30. Cycle term `10*(1.2+0.8)=20`; combined `20+1.5=21.5`.
31. Raw `[-0.03,0.55,1.03]`; clipped `[0,0.55,1]`.
32. Total 100; accuracy `0.90`; precision `72/78=0.9231`; recall `72/76=0.9474`; specificity `18/24=0.75`; F1 `0.9351` approximately.
33. L1 `2+0.01*(2+3)=2.05`; L2 `2+0.01*(4+9)=2.13`.
34. `4*4*3*64 + 4*4*64*128 + 4*4*128*256 = 1,182,720`.
35. Patch 32: `64` tokens and `4096` scores. Patch 16: `256` tokens and `65536` scores. Increase factor `16`.
36. Train `42000`, validation `9000`, test `9000`; `ceil(42000/256)=165` train batches/epoch.

# Error diagnosis table

| If you got this wrong | Likely cause | Repair sentence |
|---|---|---|
| Conv output by one | Forgot final `+1` or used physical instead of effective kernel | Write the full numerator before dividing |
| Conv parameters | Forgot input channels or bias count | Each filter spans all input channels and has one bias |
| Dense parameters | Forgot flatten size | Multiply height, width, channels first |
| RNN parameters too large | Multiplied by time steps | Recurrent weights are shared |
| LSTM/GRU count | Forgot factor 4 or 3 | Count independent gate/candidate transforms |
| Attention output shape | Multiplied wrong dimensions | Write matrix shapes beside every factor |
| ViT token count | Counted pixels rather than patches | Divide each image side by patch side, then multiply |
| GAN sign | Forgot BCE minus sign | A correct confident probability should produce low positive loss |
| FGSM outside pixel range | Forgot clipping/projection | Apply attack, then clip |
| F1 | Averaged precision and recall | Use the harmonic mean formula |

> You are exam-ready on a question type only after solving it correctly twice from a blank page.
