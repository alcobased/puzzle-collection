import React from 'react';
import PuzzleBoard from '../../common/PuzzleBoard/PuzzleBoard';
import ControlPanel from '../../common/Controls/ControlPanel';
import TextrisWorkspace from './TextrisWorkspace';
import BoardControls from './BoardControls';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TextrisPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <PuzzleBoard>
        <TextrisWorkspace />
      </PuzzleBoard>
      <ControlPanel>
        <BoardControls />
      </ControlPanel>
    </DndProvider>
  );
};

export default TextrisPage;
