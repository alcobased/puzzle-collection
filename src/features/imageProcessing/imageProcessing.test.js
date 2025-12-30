import { warpPerspective } from './imageProcessing';

// Mock the global cv object (OpenCV.js)
const mockMat = {
  delete: jest.fn(),
  size: () => ({ width: 800, height: 600 }),
  roi: jest.fn().mockReturnValue({ delete: jest.fn() }),
};

global.cv = {
  Mat: jest.fn().mockImplementation(() => mockMat),
  imread: jest.fn().mockReturnValue(mockMat),
  matFromArray: jest.fn().mockReturnValue({ delete: jest.fn() }),
  getPerspectiveTransform: jest.fn().mockReturnValue({ delete: jest.fn() }),
  warpPerspective: jest.fn(),
  imshow: jest.fn(), // Mock for matToDataUrl
  Scalar: jest.fn(),
  Size: jest.fn(),
  Rect: jest.fn(),
  INTER_LINEAR: 'INTER_LINEAR',
  BORDER_CONSTANT: 'BORDER_CONSTANT',
  CV_32FC2: 'CV_32FC2',
};

// Mock the document object for canvas creation
global.document = {
  createElement: (tag) => {
    if (tag === 'canvas') {
      return {
        getContext: jest.fn().mockReturnValue({
          drawImage: jest.fn(),
        }),
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock-data-url'),
      };
    }
    return {};
  },
};


describe('warpPerspective', () => {

  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  it('should successfully warp an image given valid points', async () => {
    const mockImgEl = { width: 800, height: 600, tagName: 'IMG' };
    const perspectivePoints = [
      { x: 100, y: 100 }, // tl
      { x: 700, y: 100 }, // tr
      { x: 700, y: 500 }, // br
      { x: 100, y: 500 }, // bl
    ];
    
    const result = await warpPerspective(mockImgEl, perspectivePoints, 1);

    expect(cv.imread).toHaveBeenCalledWith(mockImgEl);
    expect(cv.getPerspectiveTransform).toHaveBeenCalled();
    expect(cv.warpPerspective).toHaveBeenCalled();
    expect(result).toBe('data:image/png;base64,mock-data-url');
    // Ensure all created mats are deleted
    expect(mockMat.delete).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if perspective points result in zero or negative dimensions', async () => {
    const mockImgEl = { width: 800, height: 600, tagName: 'IMG' };
    // Collinear points that will result in avgH = 0
    const perspectivePoints = [
      { x: 100, y: 100 },
      { x: 700, y: 100 },
      { x: 100, y: 100 },
      { x: 700, y: 100 },
    ];

    // Expect the promise to reject with a specific error
    await expect(warpPerspective(mockImgEl, perspectivePoints)).rejects.toThrow(
      'Perspective dimensions must be positive.'
    );

    // Check that the source mat was deleted even on error
    expect(mockMat.delete).toHaveBeenCalledTimes(1);
  });

  it('should correctly order points regardless of input order', async () => {
      const mockImgEl = { width: 800, height: 600, tagName: 'IMG' };
      const pointsUnordered = [
        { x: 700, y: 500 }, // br
        { x: 100, y: 100 }, // tl
        { x: 100, y: 500 }, // bl
        { x: 700, y: 100 }, // tr
      ];
      
      // Expected ordered source coordinates for getPerspectiveTransform:
      // [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]
      const expectedSrcCoords = [100, 100, 700, 100, 700, 500, 100, 500];

      // Spy on matFromArray to capture its arguments
      const matFromArraySpy = jest.spyOn(cv, 'matFromArray');
      
      await warpPerspective(mockImgEl, pointsUnordered, 1);
      
      // The first call to matFromArray is for the source triangle of points
      // The fourth argument to that call is the array of coordinates
      expect(matFromArraySpy.mock.calls[0][3]).toEqual(expectedSrcCoords);

      matFromArraySpy.mockRestore();
  });

});
