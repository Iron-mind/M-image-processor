import React, { useState } from 'react';

const ImageViewer = () => {
  const [sliderValuex, setSliderValuex] = useState(0); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(0); // Valor inicial del slider
  const [images, setImages] = useState({
    cenital: null,
    sagital: null
  }); // Estado para almacenar las imágenes

  // Función para manejar el cambio en el slider
  const handleSliderChangex = (event) => {
    const value = event.target.value;
    setSliderValuex(value);
    // Aquí deberías hacer una solicitud al servidor para obtener las imágenes correspondientes al valor del slider
    // Reemplaza esta línea con tu lógica para obtener las imágenes del servidor
    const newImages = {
	  ...images,
      cenital: `http://192.168.100.7:8000/image/sub-01_T1w.nii?x=${value}`,
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
      sagital: `http://192.168.100.7:8000/image/sub-01_T1w.nii?y=${value}`,
    };
    setImages(newImages);
  };

  return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex justify-center mb-4">
				<div className="mr-4">
					{images.cenital && (
						<img
							
							src={images.cenital}
							alt="Cenital"
							width={480}
              				height={320}
						/>
					)}
				</div>
				<div>
					{images.sagital && (
						<img
							
							src={images.sagital}
							alt="Sagital"
							width={480}
              				height={320}
						/>
					)}
				</div>
			</div>
			<div className='row'>
				<input
					title={""+sliderValuex}
					type="range"
					min={50}
					max={170}
					value={sliderValuex}
					onChange={handleSliderChangex}
					className="w-80"
				/>
				<input
					title={""+sliderValuey}
					type="range"
					min={50}
					max={170}
					value={sliderValuey}
					onChange={handleSliderChangey}
					className="w-80"
				/>
			</div>
			
		</div>
	);
};

export default ImageViewer;
