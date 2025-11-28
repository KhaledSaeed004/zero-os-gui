import gsap from "gsap";
import {useCallback, useEffect, useRef, useState} from "react";

const useMouseSelection = () => {
    const containerRef = useRef(null);
    const selectionBoxRef = useRef(null);

    const [isSelecting, setIsSelecting] = useState(false);
    const [shouldRenderBox, setShouldRenderBox] = useState(false);

    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });

    const [finalBoxStyle, setFinalBoxStyle] = useState({});

    const handleMouseMove = useCallback((event) => {
        if (!isSelecting) return;
        setCurrentMousePos({ x: event.clientX, y: event.clientY });
    }, [isSelecting])

    const handleMouseDown = (event) => {
        event.preventDefault();

        if (event.target !== containerRef.current) return;

        setShouldRenderBox(true);

        setAnchorPoint({ x: event.clientX, y: event.clientY });
        setCurrentMousePos({ x: event.clientX, y: event.clientY });
        setIsSelecting(true);
    }

    const handleMouseUp = useCallback((event) => {
        if (!isSelecting) return;

        // TODO: I may add the ability to actually select elements later here
        console.log("Selection complete!")

        const releaseX = event.clientX;
        const releaseY = event.clientY;

        const left = Math.min(anchorPoint.x, releaseX);
        const top = Math.min(anchorPoint.y, releaseY);

        const width = Math.abs(anchorPoint.x - releaseX);
        const height = Math.abs(anchorPoint.y - releaseY);

        // Store the final calculated geometry
        setFinalBoxStyle({
            left: left + 'px',
            top: top + 'px',
            width: width + 'px',
            height: height + 'px',
        });

        setIsSelecting(false);

        const selectionBoxElement = selectionBoxRef.current;
        if (!selectionBoxElement) {
            setShouldRenderBox(false);
            return;
        }

        gsap.to(selectionBoxElement, { // Use the validated element reference
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
                setShouldRenderBox(false);
                setFinalBoxStyle({});
            }
        });

        setAnchorPoint({ x: 0, y: 0 });
        setCurrentMousePos({ x: 0, y: 0 });
    }, [isSelecting, anchorPoint]);

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
    }, [handleMouseMove, handleMouseUp])

    let activeSelectionBoxStyle = {};

    if (isSelecting) {
        const left = Math.min(anchorPoint.x, currentMousePos.x);
        const top = Math.min(anchorPoint.y, currentMousePos.y);

        const width = Math.abs(anchorPoint.x - currentMousePos.x);
        const height = Math.abs(anchorPoint.y - currentMousePos.y);

        activeSelectionBoxStyle = {
            left: left + 'px',
            top: top + 'px',
            width: width + 'px',
            height: height + 'px',
        };
    } else if (shouldRenderBox) {
        activeSelectionBoxStyle = finalBoxStyle;
    }

    return { activeSelectionBoxStyle, shouldRenderBox, handleMouseDown, selectionBoxRef, containerRef };
}

export default useMouseSelection;