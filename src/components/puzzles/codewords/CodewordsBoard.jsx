import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCell, toggleCell } from '../../../features/codewords/codewordsSlice';
import "../../common/Cell.css"; // Reuse common styles
import "./Codewords.css"; // App specific styles

const CodewordsBoard = () => {
    const { mode, cells, grid, mappings, selectedCell, cellSize } = useSelector(state => state.puzzles.codewords);
    const dispatch = useDispatch();

    // We need dimensions to render a grid
    const { width, height } = grid;

    if (!cells || Object.keys(cells).length === 0) return <div>Loading...</div>;

    const handleCellClick = (cellId, isBlack) => {
        if (mode === 'setup') {
            dispatch(toggleCell({ id: cellId }));
        } else {
            if (isBlack) return; // Ignore black cells in solve mode
            dispatch(selectCell(cellId));
        }
    };

    // Helper to get cell at x,y
    const getCell = (x, y) => cells[`${x},${y}`];
    // Helper to get selected cell object
    const selectedCellObj = selectedCell ? cells[selectedCell] : null;

    // Generate grid for rendering
    const renderCells = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = getCell(x, y);
            // Fallback for empty spaces if map is sparse? For now assume dense grid from init
            if (!cell) {
                renderCells.push(<div key={`${x}-${y}`} className="cell empty-cell" style={{ width: '40px', height: '40px' }} />);
                continue;
            }

            const isBlack = cell.isBlack;
            const letter = mappings[cell.number];
            const isSelected = selectedCell === cell.id;
            const isRelated = selectedCellObj && !isBlack && selectedCellObj.number === cell.number;

            renderCells.push(
                <div
                    key={cell.id}
                    className={`cell codewords-cell ${isBlack ? 'black-cell' : ''} ${isSelected ? 'selected' : ''} ${isRelated ? 'related' : ''}`}
                    onClick={() => handleCellClick(cell.id, cell.isBlack)}
                >
                    {!isBlack && (
                        <>
                            <span className="cell-number">{cell.number}</span>
                            <span className="cell-letter">{letter}</span>
                        </>
                    )}
                </div>
            );
        }
    }

    return (
        <div className={`codewords-board mode-${mode}`} style={{
            '--cw-cell-size': `${cellSize}px`,
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, var(--cw-cell-size))`,
            gap: 'var(--cw-cell-gap)'
        }}>
            {renderCells}
        </div>
    );
};

export default CodewordsBoard;
