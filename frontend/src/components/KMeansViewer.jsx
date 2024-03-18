import React from 'react';
import { useState } from 'react';
import Navbar from './Navbar';


const KMeansViewer = ({kValues}) => {
    const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
  const [imageName, setImageName] = useState(localStorage.getItem("image")); // Estado para almacenar el nombre de la imagen
  const [images, setImages] = useState({
    cenital: `http://localhost:8000/image/kmeans/${imageName}?x=100&kvalues=${kValues}`,
    sagital: `http://localhost:8000/image/kmeans/${imageName}?y=100&kvalues=${kValues}`
  }); 

  const handleSliderChangex = (event) => {
    const value = event.target.value;
    setSliderValuex(value);
    
    const newImages = {
	  ...images,
      cenital: `http://localhost:8000/image/kmeans/${imageName}?x=${value}&kvalues=${kValues}`,
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
      sagital: `http://localhost:8000/image/kmeans/${imageName}?y=${value}&kvalues=${kValues}`,
    };
    setImages(newImages);
  };
    return (
        <div className='mt-8' id="kms">
			<Navbar />
            <h1 className='text-black'>K means Viewer</h1>
            <div className="flex justify-center mb-4">
				<div className="mr-4">
					{images.cenital && (
						<img
							
							src={images.cenital}
							alt="Cenital"
							width={720} 
              				height={320}
						/>
					)}
				</div>
				<div>
					{images.sagital && (
						<img
							
							src={images.sagital}
							alt="Sagital"
							width={720} 
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
        </div>
    );
};

export default KMeansViewer;