import {forwardRef} from "react";

const MouseSelection = forwardRef(({ style }, ref) => {
    return (
        <span
            ref={ref}
            style={style}
            className='absolute border border-orange-600 bg-orange-600/30'></span>
    )
})

export default MouseSelection;