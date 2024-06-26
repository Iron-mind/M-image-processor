import React from 'react';
import { useState } from 'react';


const ThresholdingViewer = ({threshold}) => {
    const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
  const [imageName, setImageName] = useState(localStorage.getItem("image")); // Estado para almacenar el nombre de la imagen
  const [images, setImages] = useState({
    cenital: `http://localhost:8000/image/th/${imageName}?x=100&th=${threshold}`,
    sagital: `http://localhost:8000/image/th/${imageName}?y=100&th=${threshold}`
  }); 

  const handleSliderChangex = (event) => {
    const value = event.target.value;
    setSliderValuex(value);
    
    const newImages = {
	  ...images,
      cenital: `http://localhost:8000/image/th/${imageName}?x=${value}&th=${threshold}`,
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
      sagital: `http://localhost:8000/image/th/${imageName}?y=${value}&th=${threshold}`,
    };
    setImages(newImages);
  };
  let getThresdholdingResult = () => {
		fetch(
			`http://localhost:8000/image/cache/thresholding-res.nii`
		)
		.then((response) => response.blob())
		.then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			let prefix = imageName.split(".")[0];
			a.download = prefix+"_th_res.nii";
			a.click();
		})
		.catch((error) => console.error(error));
	};
    return (
        <div className='mt-8' id="thv">
			
            <h1 className='text-lg font-bold text-black'>Thresholding Viewer</h1>
            <div className="flex justify-center mb-4 w-[1600px]">
				<div className="mr-4">
					{images.cenital && (
						<img
							
							src={images.cenital}
							alt="Cenital"
							width={900} 
              				height={320}
						/>
					)}
				</div>
				<div>
					{images.sagital && (
						<img
							
							src={images.sagital}
							alt="Sagital"
							width={900} 
              				height={320}
						/>
					)}
				</div>
			</div>
			<div className='row my-7'>
				<input
					title={""+sliderValuex}
					type="range"
					min={50}
					max={170}
					value={sliderValuex}
					onChange={handleSliderChangex}
					className="w-80 mx-2"
				/>
				<span className='text-black'>
					{sliderValuex}
				</span>
				<input
					title={""+sliderValuey}
					type="range"
					min={50}
					max={170}
					value={sliderValuey}
					onChange={handleSliderChangey}
					className="w-80 mx-2"
				/>
				<span className='text-black'>
					{sliderValuey}
				</span>
			</div>
			<button 
				onClick={getThresdholdingResult}
				className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Save result
			</button>
        </div>
    );
};

export default ThresholdingViewer;