import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThresholdingViewer from './ThresholdingViewer';
import Navbar from './Navbar';

const ImageViewer = () => {
  const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
  const [imageName, setImageName] = useState(localStorage.getItem("image")); // Estado para almacenar el nombre de la imagen
  const [images, setImages] = useState({
    cenital: `http://localhost:8000/image/${imageName}?x=100`,
    sagital: `http://localhost:8000/image/${imageName}?y=100`
  }); 

  const [input, setInput] = useState({
	tau: 0,
	k: 0,
	kValues: [],
	thApllyed: false,
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

  return (
		<div className="flex flex-col items-center justify-center mt-9">
			<Navbar />
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
			<div className='flex flex-row'>
				<div className='flex flex-col w-[300px]'>

					<div className='my-2'>
						<label htmlFor="tau" className='text-black mx-3'>Tau value</label>
						<input onChange={(e)=>{setInput({...input, tau:e.target.value, thApllyed:false})}} className="w-[100px] text-black" type="number" id="tau" name="tau" min="0" />

					</div>
					<a href="#thv" onClick={()=>{setInput({...input, thApllyed:true})}} className='mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' >
						Apply thraceholding
					</a>
				</div>
				<div className='flex flex-col w-[300px]'>
					<Link className='row mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4' to="/processor">K-means</Link>
					
				</div>
				<div className='flex flex-col w-[300px]'>
					<Link className='row mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4' to="/processor">Drawer</Link>
					
				</div>
			</div>
			{
                input.thApllyed &&
				<ThresholdingViewer id="thv" threshold={input.tau} />
			}
			
		</div>
	);
};

export default ImageViewer;
