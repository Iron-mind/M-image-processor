import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ImageViewer = () => {
  const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
  const [imageName, setImageName] = useState(localStorage.getItem("image")); // Estado para almacenar el nombre de la imagen
  const [images, setImages] = useState({
    cenital: `http://localhost:8000/image/${imageName}?x=100`,
    sagital: `http://localhost:8000/image/${imageName}?y=100`
  }); // Estado para almacenar las imágenes
  // Función para manejar el cambio en el slider
  const handleSliderChangex = (event) => {
    const value = event.target.value;
    setSliderValuex(value);
    // Aquí deberías hacer una solicitud al servidor para obtener las imágenes correspondientes al valor del slider
    // Reemplaza esta línea con tu lógica para obtener las imágenes del servidor
	
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

  return (
		<div className="flex flex-col items-center justify-center">
			<h1 className='text-lg text-black m-4'>Viewer</h1>
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
			<div className='row'>
				<Link className='mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' to="/">
					Apply thraceholding
				</Link>
				<Link className='mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4' to="/edit">Drawer</Link>
				<Link className='mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4' to="/edit">Drawer</Link>
				<Link className='mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4' to="/edit">Drawer</Link>
			</div>
			
		</div>
	);
};

export default ImageViewer;
