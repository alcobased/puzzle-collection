import { useSelector } from "react-redux";

const ControlsStatus = () => {
    const { data: imageData, dimensions } = useSelector((state) => state.image);
    const { cellSet, activeQueue, queueSet } = useSelector((state) => state.cells);
    const { activeWordSet, wordSet } = useSelector((state) => state.words);

    const totalCells = Object.keys(cellSet).length;
    const totalQueues = Object.keys(queueSet).length;
    const totalWordSets = Object.keys(wordSet).length;

    return (
        <fieldset>
            <legend>Status</legend>
            <div>
                Image: {imageData ? `${dimensions.width}x${dimensions.height}` : "Not Loaded"}
            </div>
            <div>
                Cells: <strong>{totalCells}</strong>
            </div>
            <div>
                Active Queue: <strong>{activeQueue || 'None'}</strong>
            </div>
            <div>
                Active Word Set: <strong>{activeWordSet || 'None'}</strong>
            </div>
        </fieldset>
    );
};

export default ControlsStatus;
