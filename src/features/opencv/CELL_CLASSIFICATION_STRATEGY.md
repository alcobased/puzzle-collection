# Cell Classification Strategy

This document outlines the strategies for classifying grid cells in the puzzle solver application. The goal is to distinguish between "active" cells (part of the puzzle board) and "inactive" cells (background/empty space) from a processed image of a puzzle.

## Problem Statement: Why Luminance is Not Enough

The initial implementation relied solely on **Luminance Analysis** (brightness). While fast, this approach fails in common scenarios:
1.  **Identical Backgrounds**: If the puzzle sheet (active cells) and the underlying surface (inactive cells) share the same background color (e.g., white paper on a white table), their mean luminance will be nearly identical. The distinction lies in the *content* (ink, lines) within the active cells, which might not significantly shift the *average* brightness.
2.  **Shadows**: A shadow casting across the board can make active cells darker than the background, inverting the classification logic or pushing them below the threshold.
3.  **Variable Lighting**: Uneven lighting (gradients) makes a single global threshold ineffective.

**Conclusion**: The classifier must analyze the **intrinsic features** of individual cells (texture, content, edges) rather than just their average color.

---

## Proposed Strategy: Multi-Feature Analysis

We will treat each cell as a data point and extract a vector of features. We can then classify these vectors using statistical methods or simple heuristics.

### 1. ROI Strategy: Expanded Context
Unlike the luminance approach which focused on the center to avoid noise, feature analysis benefits from **expanding** the ROI.
*   **Concept**: Active cells are typically bounded by grid lines. The table background (inactive area) usually lacks these structured boundaries.
*   **Action**: Expand the cell crop by a margin (e.g., 10-15%) to include the surrounding grid lines.
*   **Benefit**: The presence of strong, straight lines (the grid) becomes a strong positive feature for "Active" classification, distinguishing the board from the empty table.

### 2. Feature Engineering (Per Cell)

For every cell, we extract the following metrics from its ROI (Region of Interest):

#### A. Variance / Standard Deviation (Texture)
*   **Concept**: Empty background cells are usually smooth and uniform. Active cells often contain symbols, text, or distinct colors, resulting in higher pixel variance.
*   **Calculation**: Compute the standard deviation of pixel intensities in the grayscale ROI.
*   **Expectation**: `StdDev(Active) >> StdDev(Inactive)`

#### B. Edge Density (Structure)
*   **Concept**: Active cells contain structural elements (lines, shapes, characters).
*   **Calculation**: Apply an edge detector (Canny or Sobel) and count the number of edge pixels (non-zero) relative to the total pixels.
*   **Expectation**: Active cells will have a higher percentage of edge pixels.

#### C. Color Saturation (If applicable)
*   **Concept**: Puzzle pieces might be colorful, while the background (table/shadows) might be desaturated.
*   **Calculation**: Convert ROI to HSV color space and calculate the mean Saturation (S) channel.
*   **Expectation**: `MeanSat(Active) > MeanSat(Inactive)` (context dependent).

#### E. Border Feature Analysis (Specific Observation)
*   **Observation**: Active cells appear to have an **orange border with a thin black line**. This is likely the grid structure itself.
*   **Strategy**:
    1.  **Color Masking**: Convert ROI to HSV. Create a mask for the specific "orange" hue of the grid lines.
    2.  **Line Detection**: Inside the orange mask (or on the original grayscale), look for thin dark lines using `cv.HoughLinesP` or simple thresholding.
    3.  **Spatial Check**: These features should be prominent in the **margin area** (the outer 15% we added).
*   **Expectation**: Active cells will have a high density of "orange pixels" or "straight black lines" in their periphery. Inactive cells (background table) will lack this specific structured border.

### 2. Classification Logic

Once features are extracted, we combine them to make a decision.

#### Approach A: Weighted Scoring + Otsu
Combine features into a single "Activity Score".
> `ActivityScore = (w1 * NormVariance) + (w2 * NormEdgeDensity)`

Then, apply **Otsu's Thresholding** on this `ActivityScore` array instead of raw luminance. This dynamically finds the split between "boring" and "interesting" cells.

#### Approach B: K-Means Clustering
Treat the features as a 2D or 3D vector `[Variance, EdgeDensity, Saturation]`.
Use **K-Means Clustering** with `K=2` to separate the cells into two clusters.
*   Determine which cluster is "Active" by comparing the centroids (the cluster with higher average Variance/Edges is Active).

### 3. Spatial Coherence (Post-Processing)
After the initial classification, we can use the grid structure to clean up noise:
*   **Island Removal**: If an "Active" cell is surrounded by "Inactive" cells, flip it to Inactive (noise).
*   **Hole Filling**: If an "Inactive" cell is surrounded by "Active" cells, flip it to Active.
*   **Largest Component**: Keep only the largest connected group of active cells.

---

## Implementation Plan

1.  **Update `extractGridStructure`**:
    *   Calculate `stdDev` and `edgeDensity` for each cell.
    *   Return these metrics in the `cells` array for debugging/visualization.
2.  **Visualize Features**:
    *   Update the UI to allow toggling between viewing "Luminance", "Variance", and "Edge Density" heatmaps. This helps us understand which feature is most discriminative.
3.  **Refine Algorithm**:
    *   Implement the "Weighted Scoring" approach first as it is computationally cheaper than K-Means.

