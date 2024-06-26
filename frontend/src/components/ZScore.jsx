import React from 'react';
import ImageViewer from './ImageViewer';
import { useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

export const ZScore = () => {
	const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
	const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
	const [imageName, setImageName] = useState("z-score-res.nii"); // Estado para almacenar el nombre de la imagen
	const filenamePrev = localStorage.getItem("image");
    const [images, setImages] = useState({
		cenital: `http://localhost:8000/image/${imageName}?x=100`,
		sagital: `http://localhost:8000/image/${imageName}?y=100`,
	});
	const [loadingTau, setLoadingTau] = useState(false);

	const [input, setInput] = useState({
		tau: 0,
		zScoreH: false,
		histogram:false
		
	}); // Estado para almacenar el valor del input
	// Función para manejar el cambio en el slider
	const handleSliderChangex = (event) => {
		const value = event.target.value;
		setSliderValuex(value);

		const newImages = {
			...images,
			cenital: `http://localhost:8000/image/${imageName}?x=${value}`,
		};
		setImages(newImages);
	};
	const handleSliderChangey = (event) => {
		const value = event.target.value;
		setSliderValuey(value);
		// Aquí deberías hacer una solicitud al servidor para obtener las imágenes correspondientes al valor del slider
		// Reemplaza esta línea con tu lógica para obtener las imágenes del servidor

		const newImages = {
			...images,
			sagital: `http://localhost:8000/image/${imageName}?y=${value}`,
		};
		setImages(newImages);
	};
    let getHistogram = async () => {
        if (input.zScoreH) {
            setInput({ ...input, zScoreH: false });
        }
        setTimeout(() => {
             setInput({ ...input, zScoreH: true });
         }, 1000);
        
    }
	return (
		<div className="flex flex-col items-center justify-center mt-9">
			<Navbar />
			<h1 className="text-lg font-bold text-black m-4">Z-score transformation</h1>
			<div className="flex justify-center mb-4">
				<div className="mr-4">
					{images.cenital && (
						<img
							src={images.cenital}
							alt="Cenital"
							width={720}
							height={320}
							className="contrast-120"
						/>
					)}
				</div>
				<div>
					{images.sagital && (
						<img src={images.sagital} alt="Sagital" width={720} height={320} />
					)}
				</div>
			</div>
			<div className="row my-7">
				<input
					title={"" + sliderValuex}
					type="range"
					min={50}
					max={170}
					value={sliderValuex}
					onChange={handleSliderChangex}
					className="w-80 mx-2"
				/>
				<span className="text-black">{sliderValuex}</span>
				<input
					title={"" + sliderValuey}
					type="range"
					min={50}
					max={170}
					value={sliderValuey}
					onChange={handleSliderChangey}
					className="w-80 mx-2"
				/>
				<span className="text-black">{sliderValuey}</span>
			</div>
			<button onClick={getHistogram} className="mx-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Get Histogram
			</button>
            {input.zScoreH && (
                <div className='flex flex-row'>

                    <img className='flex flex-col mx-2' src={"http://localhost:8000/image/histogram/"+imageName} alt="histogram zscore" />
                    <img className='flex flex-col mx-2' src={"http://localhost:8000/image/histogram/"+filenamePrev} alt="histogram" />
                </div>
            )
                }
		</div>
	);
}