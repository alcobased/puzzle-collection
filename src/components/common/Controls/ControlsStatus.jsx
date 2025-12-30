import { useSelector } from "react-redux";
import ControlSection from "./ControlSection";

const ControlsStatus = () => {
    const { data: imageData, dimensions } = useSelector((state) => state.image);
    const { cellSet, activeQueue, queueSet } = useSelector((state) => state.puzzles.pathfinder.cells);
    const { activeList, lists } = useSelector((state) => state.words);

    const totalCells = Object.keys(cellSet).length;
    const totalQueues = Object.keys(queueSet).length;
    const totalLists = Object.keys(lists).length;

    return (
        <ControlSection title="Status">
            <div>
                Image: {imageData ? `${dimensions.width}x${dimensions.height}` : "Not Loaded"}
            </div>
            <div>
                Cells: <strong>{totalCells}</strong>
            </div>
            <div>
                Queues: <strong>{totalQueues}</strong>
            </div>
            <div>
                Active Queue: <strong>{activeQueue || 'None'}</strong>
            </div>
            <div>
                Word Lists: <strong>{totalLists}</strong>
            </div>
            <div>
                Active List: <strong>{activeList || 'None'}</strong>
            </div>
        </ControlSection>
    );
};

export default ControlsStatus;
