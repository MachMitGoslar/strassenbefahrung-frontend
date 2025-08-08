import React, { useState, useEffect } from 'react';
import './Slider.css'
import { getInfo } from '../../../services/GetInfo';
import { useLocation } from 'react-router-dom';

interface ImageSliderProps {
    images: string[];
    interval: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, interval }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [infoOpen, setInfoOpen]=useState(false);
    const [pictureInfo, setPictureInfo]=useState([]);
    const [rotate, setRotate]=useState(false);

    const baseUrl: string= "https://www.google.com/maps?q=";

    // Verwenden der useLocation-Hook, um die aktuelle URL zu bekommen
    const location = useLocation();

    // Erstellen einer neuen Instanz von URLSearchParams mit dem Query-String
    const queryParams = new URLSearchParams(location.search);
    
    useEffect(() => {
        if (isPaused) return; // Keine Aktualisierung, wenn pausiert

        const timer = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval, isPaused]);

    const handlePauseClick = () => {
        setIsPaused(true);
    };

    const handlePlayClick = () => {
        setIsPaused(false);
        setInfoOpen(false);
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsPaused(true);
        setInfoOpen(false);
    };

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        setIsPaused(true);
        setInfoOpen(false);
    };

    const handleResetClick = () => {
        setCurrentIndex(0);
        setIsPaused(true);
    };

    function handleInfoClick(){
        // @ts-ignore
        getInfo(images[currentIndex],queryParams.get('selected')).then(response=>{
            let anzahlZeichen= response[1].trim().length-8;
            console.log(response[1].trim().substring(0,anzahlZeichen))
            setPictureInfo(response[1].trim().substring(0,anzahlZeichen));
        }) 
        setInfoOpen(!infoOpen);
        setIsPaused(true);
    }

    const handleImageDimension = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if(naturalWidth<naturalHeight){
            setRotate(true);
        }else setRotate(false);
    };



    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <button title={"Info zum aktuellen Bild"} className={"image-button"} onClick={handleInfoClick}>Info</button>
            <div className="image-slider">
                <img onLoad={handleImageDimension}
                    style={{//height: window.innerHeight * 0.9
                        width: '100%',
                          transform: rotate ? 'rotate(90deg)' : 'none',
                        transformOrigin: 'center center',}} src={images[currentIndex]}/>
            </div>
            <div className={'controls-overlay'}>
            <div className={'controls-wrapper'}>
            <div className="controls">
                <button title="Zurück zum Start"
                        onClick={handleResetClick}>
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADzUlEQVR4nO2aSWsUURDHf6ImI4qa0ahHPYm7H0JciEsUPLjd3C4uRK8u5+hJDOjVj+CCuBNQcdeAuHtyObjdjIYoLYX/hiL2zHS/6ZlpxT80zExVvVf9XlW9qnoD//Hvogx0A0eAc8Az4AswpMc+PxXNeNYAHRQEJWALcBH4CUQZnx/ABWAz0N6KFxgH7APeO6W+A1eBA9qZOVrxsXo69JvRDgLXJBPLvwN6tDhNQRfw2ilwF9gKTAoYazKwDbjnxnsFrKCBsJU64Sa8DyzNcfzlwEM3fl8jdmeGFLcJvgK7gNF5T8LvMfcAg263p+c1+Cxtd6SoM5/GYyHwXHO+lA51odMNeAeYSvPQAVzX3K9lFUEoOXO6CYyn+RgP3HJmFuQzJ5w52WHXKkxxVmEBIHOIjR27GT6RxmcGpZNFt9SHXXxOWHQqCvY6509lYvvdOdGIEBuKMcAj6WYvVRUll3bkcdiN1bmQl8wK6fa2Vm622UWIetGlDDjKUWaUi6Qbqw10SUyWO4ViNnB2RJabp8wO0c9XYigrrf4emABamDwODGuiLymUCpHpUH0zXEnPtRrgSoBNbwc+St4mOAlMq6JUiIxHv3hWkYCjIlo9EWLTkYqkuY6epNTKAJmROCye3j8oKkGNuJrsNm0n7/oEPq9UiEwlxNZzOon4QkSr4rLY9B6ZShJ8bZFVphrmicd29g98FrGc0aarwUehrDLVMFU8H5KIQyK2jfh9CfDYTXAZWEA61CNTDe2uT5D6RZIc2rY2DeqRCX6RLKZlrZ9TGU0rq0ytgq+iaaV19r6iO/s5Ea0DWAsjQ+mLgPCbRqYS1lULv/GBaM2ztFhZxAOxW0TrFmZB7D8fEnyhVoqSRSYpRbFFSUzG4qTROoBFTRrLLmmcWInpggaxNmZR0/idoptPV8QmMVkvtqiF1QPRN9Qqdd+JcRnFK3W7pNubNNcQPWJ+UMDmw4B0251GoOR6vVlXs5Hocel/6kuhuFsxqOZYq7EY+Bba3elzK2BhslXoVFPOdDkWMkBJbaFIjeRWNLEnALelw+167hk7XTi8o+/NQhm4oblf5XHhM8ttrZnZIprjEy9dcjkzr4GnOzMbVO/VwmHeGKPo9M2ZU636Jchn4gAQqaGc1+3rKB12A278Y42+e1/utj1SL3ZH4L8Yysqd4rQjkinleVtcc3f2qiseKzCk9PqQ+k7zFLbb9EzRpdE68fS7PkGcduxu1T8g2tUVP68SIMr4DCuL3dCqF0jCJPVirWo7o7vHT+5PNfb5icrTXvFWrCf+g78cvwBpX8ky6knSXgAAAABJRU5ErkJggg=="/>
                </button>
                <button title="Zurück"
                        onClick={handlePrevClick}>
                    <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADc0lEQVR4nO2ay0tVURTGf5LpDSPzqiWNahhG9VeYYg9zVtmssEkm1rTH2BoJgn9HIWJRIfSyhylEZtaobBDZrKtiYSz8DizqXr333HPPPYofHLi691n7sdZej28f2MLmRRroAG4Dw8AH4CewpMd+T6vN+pwC6kgIUsB54D7wB1gp8PkNjAJdQHU5FrADuAp8c5NaBB4B16WZg9rx7Xrq9D9ruwE81jvB+3NAnzYnFrQDn90EXgEXgNoQsnYDF4HXTt4noI0SwnZqyA34BmiJUH4r8NbJHyyFdpo0cRvgF3AZ2Bb1IKzKvAJknLb3RiX8gNS9Iq9ziNLjMDCjMWc1h6LQ6AS+BBqID3XAE439WVYRCilnTs+AGuJHDfDCmVmoMzPkzMmCXblQ76zCHEDBLjY42HGciXzOTEZzMu+Wd7AL4oR5p6Sg1x3+vEzsmosTUbrYJgW+5yHfrwQmNTdb1JpIubSjJeJFTEvuBFARUk6bZHxdLzfrch6iFIuYLsaNsroBgSc9u1bHB+pkuVMUsKj8TjItrd8XgcxuyRvJ1SGttHoxZAJYSk38GyitvlnONc/TGvQhydSEx5hknyAL7qjR6okkasLjluT3kwXDajxJcjXxr/XcJQs+qtGquKRqIkCz26z/MK/GdII1EaBBY30nC5bUWEXhmIpJEwGqHU+weRcyX4Rp7XGmNRODaTWuZVqb5rAPq9EYwLCISzOda7nfICAaebahA2KHGo0tLBal1syYZB/PlYwFSaMxgCRUM2mXNO7K1WlUAxuNSUI1c0ny7EznxDl1spI0qYXVhGSdWa/UnVPHY5RmMVZ3h0W7ZHzJ5xqiz9XWUZMPkyLcwpIPU5pbTz4vpBzXa4RyUtDnzlp1oWxFRuRYuXEUWAjL7gy6HTDaslxoFClncxkIIyAlWmhFdl0OEnsnMK45jBdzz9ioxCy4VrC/40IaeOqu44q+8DngVGtmdoR4zsSsxrSsfH9Ugvc6M8uIezV3GDUq5Z0WnDlZdhApUs4BBIEtqtvXCgW7KSd/oNR3761O7QFr3x3yK4a0cqcg7ViRKUVJoK+rnV6x4sEElpRe3xTv1Cy3XaWnXpdGneoz5niCIO3oKdcXENVixUdUAhT6Cceystgz5VpANtSKi7Wq7Z6SxB/uoxr7/V7lab/65qwntsAGx1+7t04xbgmu8QAAAABJRU5ErkJggg=="/>
                </button>
                {isPaused ? (
                    <button title={"Play"}
                            style={{backgroundColor: "#9265ff"
                            }} className="play-icon" onClick={handlePlayClick}>
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABj0lEQVR4nO2ZPUsDQRCGHyNRiAgJKJjGxiY2amE6u1Qi+QWCf8EqvY0/wNJSS1srsVEbsbGziDYWWihYGATFj6wszMJyaOVddMZ94Dj27vaOl73deXcGEolEIkMHGMEADugCyxgQ4uQ4BGZRipOjJ+cXYBMYQ6mQOrANfEj7FlgDhlAmJLAInEbXj4F5FArxlGQ07uSeH6VdYBJlQgJVYAt4k2cegHVgGGVCAg3gIHr2HFhCoZBAG7iO+uwD0ygU4qkAG8Cz9HuS9ijKhARmgL2o/xWwgkIhgRZw8RfcgfuhEE9ZVrNHederrHbjKBMSqEu86f+GO3A5Cgk0gbOMO5hDoZDYHdxn3MEEyoQEajJf3ot2B0ULCSwAJ0W6g0EJQSb9KnAj3/SLwg4wRQ4kIf/t16ppn+wmlt9mJiAeaQuI6i1K2YJpbH1h4/3WWO3G6lLbxqpiYavbjpIPfRkRVcmHhvZ0UFV7gq70Tcq0sKg8qCR24VE5D8yVFXpWCj3OQumta6EY2rFSnk4kEujlE4Rx1mgQiGC0AAAAAElFTkSuQmCC"/>
                    </button>
                ) : (
                    <button title={"Pausieren"}
                            style={{backgroundColor: "#9265ff"
                            }} className="pause-icon" onClick={handlePauseClick}>
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZUlEQVR4nO3ZsQ3AIBAEQfpv+p1cAQ7O2EYzEhH64MVmrAUAe83N89R8zXGLvHVfY5HwIm3SCmm1SSuk1SatkFabtEJabdIKabVJK6TVJq2QVpu0Qlpt0vpqWnPKt8L8fREAWHEBbnI+0BRFWvcAAAAASUVORK5CYII="/>
                    </button>
                )}
                <button title={"Nächstes"}
                        onClick={handleNextClick}>
                    <img width="50" height="50" src="https://img.icons8.com/ios/50/circled-chevron-right--v1.png"
                         alt="circled-chevron-right--v1"/>
                </button>
            </div>
            </div>
            </div>
            {infoOpen &&
                <div className={"info-box"}>
                    <pre>
                    <text>
                        Adresse: {pictureInfo} <br/>
                        <br/>
                    </text>
                    </pre>
                </div>
            }
        </div>
    );
};

export default ImageSlider;
