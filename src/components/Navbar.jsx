import dayjs from "dayjs";
import {navIcons} from "@constants";
import Logo from "@components/ui/Logo.jsx";
import {useEffect, useState} from "react";

const Navbar = () => {
    const [osTime, setOSTime] = useState(dayjs().format('ddd MMM D h:mm A'));

    useEffect(() => {
        const update = () => setOSTime(dayjs().format('ddd MMM D h:mm A'));
        update();

        const now = dayjs();
        const msUntilNextMinute = (60 - now.second()) * 1000 - now.millisecond();

        const timeoutId = setTimeout(() => {
            update();

            const intervalId = setInterval(update, 60_000);

            return () => clearInterval(intervalId);
        }, msUntilNextMinute)

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <nav>
            <div>
                <Logo className='size-6 fill-[#eaeaea] hover:fill-orange-600 hover:rotate-180 transition-all duration-500 ease-in-out' />
                <p className='font-bold text-[#eaeaea]'>Zero OS</p>
            </div>
            <div>
                <ul>
                    {navIcons.map(({ id, img}) => (
                        <li key={id}>
                            <img src={img} className='icon-hover h-3' alt={`icon-${id}`} />
                        </li>
                    ))}
                </ul>

                <time className='text-[#eaeaea]'>{osTime}</time>
            </div>
        </nav>
    )
}
export default Navbar
