import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThresholdingViewer from './ThresholdingViewer';
import Navbar from './Navbar';
import KMeansViewer from './KMeansViewer';

const ImageViewer = () => {
  const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
  const [imageName, setImageName] = useState(localStorage.getItem("image")); // Estado para almacenar el nombre de la imagen
  const [images, setImages] = useState({
    cenital: `http://localhost:8000/image/${imageName}?x=100`,
    sagital: `http://localhost:8000/image/${imageName}?y=100`
  });
  const [loadingTau, setLoadingTau] = useState(false);

  const [input, setInput] = useState({
	tau: 0,
	kValues: [],
	stringkValues: "",
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
  function getBestTau() {
	setLoadingTau(true);
		fetch(`http://localhost:8000/image/best-tau/${imageName}`)
			.then((response) => response.json())
			.then((data) => {
				setLoadingTau(false);
				setInput({ ...input, tau: Number(data.tau).toFixed(2) });
			})
			.catch((error) => console.error(error));
	}


  return (
		<div className="flex flex-col items-center justify-center mt-9">
			<Navbar />
			<h1 className="text-lg font-bold text-black m-4">Viewer</h1>
			<div className="flex justify-center mb-4">
				<div className="mr-4">
					{images.cenital && (
						<img src={images.cenital} alt="Cenital" width={720} height={320} className="contrast-120" />
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
			<div className="flex flex-row">
				<div className="flex flex-col w-[300px]">
					<div className="my-2">
						<label htmlFor="tau" className="text-black mx-3">
							Tau value
						</label>
						<input
							onChange={(e) => {
								setInput({ ...input, tau: e.target.value, thApllyed: false });
							}}
							className="w-[100px] text-black"
							type="number"
							id="tau"
							name="tau"
							min="0"
							value={input.tau}
						/>
					</div>
					{loadingTau ? (
						<span className='text-black'>Calculating...</span>
					) : (
						<button
							onClick={getBestTau}
							className="mx-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Find the best
						</button>
					)}
					<a
						href="#thv"
						onClick={() => {
							setInput({ ...input, thApllyed: true });
						}}
						className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Apply thresholding
					</a>
				</div>
				<div className="flex flex-col w-[300px]">
					<div className="my-2">
						<label htmlFor="stringkValues" className="text-black mx-3">
							Initial k values
						</label>
						<input
							onChange={(e) => {
								setInput({
									...input,
									stringkValues: e.target.value,
									kValues: [],
									thApllyed: false,
								});
							}}
							className="w-[160px] text-black"
							type="text"
							id="stringkValues"
							name="stringkValues"
							value={input.stringkValues}
						/>
					</div>
					<a
						href="#kms"
						className="row mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
						onClick={() => {
							setInput({
								...input,
								kValues: input.stringkValues.split(",").map(Number),
							});
						}}
					>
						Make k groups
					</a>
				</div>
				<div className="flex flex-col w-[300px]">
					<Link
						className="row mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
						to="/processor"
					>
						Drawer
					</Link>
				</div>
			</div>
			{input.thApllyed && <ThresholdingViewer threshold={input.tau} />}
			{input.kValues.length > 0 && <KMeansViewer kValues={input.kValues} />}
		</div>
	);
};

export default ImageViewer;
