import { orderPoints } from './manualProcessing';

describe('orderPoints', () => {
  // Test case 1: A simple square
  it('should correctly identify the corners of a square', () => {
    const points = [
      { x: 10, y: 10 },    // Top-left
      { x: 100, y: 10 },   // Top-right
      { x: 100, y: 100 },  // Bottom-right
      { x: 10, y: 100 },   // Bottom-left
    ];
    const result = orderPoints(points);
    expect(result.tl).toEqual({ x: 10, y: 10 });
    expect(result.tr).toEqual({ x: 100, y: 10 });
    expect(result.bl).toEqual({ x: 10, y: 100 });
    expect(result.br).toEqual({ x: 100, y: 100 });
  });

  // Test case 2: A rotated rectangle
  it('should correctly identify the corners of a rotated rectangle', () => {
    const points = [
      { x: 50, y: 10 },   // Top-center (becomes a corner)
      { x: 90, y: 50 },   // Right-center
      { x: 50, y: 90 },   // Bottom-center
      { x: 10, y: 50 },   // Left-center
    ];
    const result = orderPoints(points);
    expect(result.tl).toEqual({ x: 10, y: 50 });
    expect(result.tr).toEqual({ x: 50, y: 10 });
    expect(result.bl).toEqual({ x: 50, y: 90 });
    expect(result.br).toEqual({ x: 90, y: 50 });
  });

  // Test case 3: A skewed quadrilateral (trapezoid)
  it('should correctly identify the corners of a skewed quadrilateral', () => {
    const points = [
      { x: 20, y: 10 },   // Top-left
      { x: 80, y: 20 },   // Top-right
      { x: 100, y: 100 }, // Bottom-right
      { x: 10, y: 90 },   // Bottom-left
    ];
    const result = orderPoints(points);
    expect(result.tl).toEqual({ x: 20, y: 10 });
    expect(result.tr).toEqual({ x: 80, y: 20 });
    expect(result.bl).toEqual({ x: 10, y: 90 });
    expect(result.br).toEqual({ x: 100, y: 100 });
  });

  // Test case 4: Inverted points (like a Z-shape)
  it('should correctly identify the corners when points are in a Z-shape', () => {
    const points = [
      { x: 10, y: 10 },    // Top-left
      { x: 100, y: 100 },  // Bottom-right
      { x: 100, y: 10 },   // Top-right
      { x: 10, y: 100 },   // Bottom-left
    ];
    const result = orderPoints(points);
    expect(result.tl).toEqual({ x: 10, y: 10 });
    expect(result.tr).toEqual({ x: 100, y: 10 });
    expect(result.bl).toEqual({ x: 10, y: 100 });
    expect(result.br).toEqual({ x: 100, y: 100 });
  });
});
