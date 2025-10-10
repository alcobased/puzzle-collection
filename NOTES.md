# Project Notes

## App file structure

## dominoSlice initialState
```
{
  grid: {
    data: defaultGrid,
    width: 10,
    height: 10,
    // Sample groups for demonstration purposes
    groups: {
      groupList: [
        { x: 0, y: 0, width: 2, height: 3 },
        { x: 5, y: 2, width: 3, height: 4 },
        { x: 2, y: 5, width: 2, height: 2 },
      ],
      selection: {
        isActive: false, // is a groups currently being selected
        start: null,
        end: null,
      },
    },
  },
  // Other state properties for the domino puzzle can be added here
};
```