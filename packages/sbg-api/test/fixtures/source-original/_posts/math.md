---
title: Mathematic Test
date: 2024-10-11
tags: [post, markdown]
category: [engine]
---

## Inline math

- $\sqrt{3x-1}+(1+x)^2$

- This is a simple test: $y = mx + b$. This should all be inlined.

- The equation of a line is given by \( y = mx + b \), where \( m \) is the slope and \( b \) is the y-intercept.

- Balance $\$9.99$

- Or even: $y = mx + b$
- Or even: $e^{\imath x} = \cos{x} + \imath\sin{x}$

## Block math

$$\begin{array}{c}

\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &
= \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\

\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\

\nabla \cdot \vec{\mathbf{B}} & = 0

\end{array}$$

## Another samples

Negative sign math

foo$-1+1 = 2$bar

Centered block math

$$
1 + 1 = 2
$$

Complex Math

$$
\begin{aligned}
ax^2+bx+c &= 0\\
x &= \frac{-b\pm\sqrt{b^2-4ac}}{2a}\\
\end{aligned}
$$

Paragraph break in inline math is not allowed

foo $1+1

= 2$ bar

`skipDelimitersCheck` option

aa $ 1 + 1 = 2 $ bb.

Multiline inline math

foo $1 + 1
= 2$ bar

Codeblock 4 spaces

    $$
    1+1 = 2
    $$

Codeblock 3 spaces

   $$
   1+1 = 2
   $$

Multiline display math

$$

  1
+ 1

= 2

$$

Display and inline math can appear in lists

* $1+1 = 2$
* $$
  1+1 = 2
  $$

Escaped $ should not parse

\$1 + 1 = 2\$

Escaped $ within math should not close

$\$1 + \$1 = \$2$

Colors

\textcolor{blue}{F=ma}
\textcolor{228B22}{F=ma}
\colorbox{aqua}{$F=ma$}
\fcolorbox{red}{aqua}{$F=ma$}
