import './Diashow.css'
import {useEffect, useState} from "react";
import {getPictures} from "../../services/GetPictures";
import {useLocation} from "react-router-dom";
import ImageSlider from "./slider/Slider";

export default function Diashow(){
    const [pictures, setPictures]=useState([]);

    // Verwenden der useLocation-Hook, um die aktuelle URL zu bekommen
    const location = useLocation();

    // Erstellen einer neuen Instanz von URLSearchParams mit dem Query-String
    const queryParams = new URLSearchParams(location.search);

    // Auslesen des Werts des "id"-Parameters
    const id = queryParams.get('id');
    const selectedMap = queryParams.get('selected');

    useEffect(() => {
        // @ts-ignore
        getPictures(+id, selectedMap).then(response=>{
            console.log(response);
            setPictures(response);
        })

    }, [id, selectedMap]);

    useEffect(() => {
        console.log("testen");
    }, [pictures]);

    return (
        <ImageSlider images={pictures} interval={500}/>
            );
}