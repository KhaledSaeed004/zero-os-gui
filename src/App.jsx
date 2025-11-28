import { Navbar, Desktop, Dock, MouseSelection } from "@components";
import { useMouseSelection } from "@hooks";

const App = () => {
    const {selectionBoxRef, shouldRenderBox, activeSelectionBoxStyle, handleMouseDown, containerRef} = useMouseSelection()

    return (
        <main className='relative' ref={containerRef} onMouseDown={handleMouseDown}>
            {shouldRenderBox && <MouseSelection style={activeSelectionBoxStyle} ref={selectionBoxRef} />}
            <Navbar />
            <Desktop  />
            <Dock />
        </main>
    )
}
export default App
