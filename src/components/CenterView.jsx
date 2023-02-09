import {useMap} from "react-leaflet";
import {useEffect} from "react";


export function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if(center !== undefined){
            map.setView(center)
        }
    }, [center])
    return null;
}