import { useEffect, useState } from 'react';

export default function MediaQuery(props){
    const [matches, setMatches] = useState(matchMedia(props.query));
    const render = props.render;

    useEffect(() => {
        function listener(ev){
            setMatches(ev);
        }
        
        matches.addListener(listener)

        return () => matches.removeListener(listener);
    }, [])

    return <>{ matches.matches ? render(true) : render(false) }</>
};