import {useRef} from "react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

const FONT_WEIGHTS = {
    subtitle: { min: 400, max: 800, default: 400 },
    title: { min: 400, max: 900, default: 400 },
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, idx) => (
        <span key={idx} className={className} style={{
            fontVariationSettings: `'wght' ${baseWeight}`
        }}>{char === ' ' ? '\u00A0' : char}</span>
    ))
}

const setupTextHover = (container, type) => {
    if (!container) return () => {};

    const letters = container.querySelectorAll('span');
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, { duration, ease: 'power2.out', fontVariationSettings: `'wght' ${weight}`})
    }

    const handleMouseMove = (event) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = event.clientX - left;

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w /2));
            const intensity = Math.exp(-(distance ** 2 / 20000));

            animateLetter(letter, min + (max - min) * intensity);
        })
    }

    const handleMouseLeave = () => letters.forEach((letter) => animateLetter(letter, base, 0.3))

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    }
}

const Desktop = ({ref}) => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, 'title');
        const subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle');

        return () => {
             titleCleanup();
             subtitleCleanup();
        }
    }, [])

    return (
        <section id='desktop' ref={ref}>
            <p ref={subtitleRef} className=''>{renderText('Welcome, <User>', 'text-6xl text-shadow-gray-500 text-shadow-lg/20 font-georama text-[#eaeaea]', 400)}</p>

            <div className='small-screen'>
                <p>This experience was designed for desktop/tablet screens only.</p>
            </div>
        </section>
    )
}
export default Desktop
