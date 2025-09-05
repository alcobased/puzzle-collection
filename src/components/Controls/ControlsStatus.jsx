import { useSelector } from "react-redux"
import { current } from "@reduxjs/toolkit";

const ControlsStatus = () => {
    const imageState = useSelector((state) => state.image)
    
    if (!imageState.data) {
        return <div>No image set</div>
    }
    return <div>Dimensions: {imageState.dimensions.width}x{imageState.dimensions.height}</div>
}

export default ControlsStatus
