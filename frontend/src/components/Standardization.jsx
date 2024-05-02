
import { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ZScore } from './ZScore';
import { IntensityRescaling } from './IntensityRescaling';
import { HistogramMatching } from './HistogramMatching';
import { WhiteStripe } from './WhiteStripe';

const Standardization = () => {
    const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
    const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
    const [imageName, setImageName] = useState(localStorage.getItem('image')); // Estado para almacenar el nombre de la imagen
    const [referenceImage, setImage] = useState(null);
    const [loadingHM, setLoadingHM] = useState(false);
    const [images, setImages] = useState({
      cenital: `http://localhost:8000/image/${imageName}?x=100`,
      sagital: `http://localhost:8000/image/${imageName}?y=100`
    });
    const navigate = useNavigate();

    const [input, setInput] = useState({
      tau: 0,
      zScore: false,
      intensityRescaling: false,
      whiteStripe: false,
        histogramMatching: false,
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
   
    const applyZScore = () => {
        fetch(`http://localhost:8000/image/z-score/${imageName}`)
            .then((response) => response.json())
            .then(() => {
                alert("Z-Score transformation applied");
                setInput({ ...input, zScore: true });
            })
            .catch((error) => console.error(error));
    };

    const applyIRescaling = () => {
        fetch(`http://localhost:8000/image/intensity-rescaling/${imageName}`)
            .then((response) => response.json())
            .then(() => {
                alert("Intensity rescaling applied");
                setInput({ ...input, intensityRescaling: true });
            }
            )
            .catch((error) => console.error(error));
    };

    let applyHistogramMatching = async () => {
        await handleSubmit();
        setLoadingHM(true);
        fetch(`http://localhost:8000/image/histogram-matching/${imageName}?ref=${referenceImage.name}`)
            .then((response) => response.json())
            .then(() => {

                alert("Histogram Matching applied");
                setInput({ ...input, histogramMatching: true });
            })
            .catch((error) => console.error(error))
            .finally(() => setLoadingHM(false));
    }
    let applyWhiteStripe    = () => {
        fetch(`http://localhost:8000/image/white-stripe/${imageName}`)
            .then((response) => response.json())
            .then(() => {
                alert("White Stripe applied");
                setInput({ ...input, whiteStripe: true });
            })
            .catch((error) => console.error(error));
    }
    const handleImageChange = () => {
        const file = document.getElementById("dropzone-file").files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(file);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {

        //enviar al server
        const formdata = new FormData();
        formdata.append("file", referenceImage, referenceImage.name);

        const requestOptions = {
            method: "POST",
            body: formdata,
        };
        await fetch("http://localhost:8000/image/upload", requestOptions)
            .then(() => {

                localStorage.setItem("referenceImage", referenceImage.name);
                setImage(null);

            })
            .catch((error) => console.error(error));

    }
    return (
			<div className="flex flex-col items-center justify-center mt-9">
				<Navbar />
				<h1 className="text-lg font-bold text-black m-4">Standardization</h1>
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
							<img
								src={images.sagital}
								alt="Sagital"
								width={720}
								height={320}
							/>
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
				<div className='flex flex-row'>
                    <div className='flex flex-col w-[300px]'>
                        <button
                            onClick={applyIRescaling}
                            className='mx-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            Intensity rescaling
                        </button>
                    </div>
                    <div className='flex flex-col w-[300px]'>
                        <button
                        onClick={applyZScore}
                        className='mx-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            z-score transformation
                        </button>
                    </div>
                    <div className='flex flex-col w-[300px]'>
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Medical image (.nii)
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            accept="*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                        <button
                        onClick={applyHistogramMatching}
                        className='mx-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            Histogram Matching
                        </button>

                    </div>
                    <div className='flex flex-col w-[300px]'>
                        <button
                            onClick={applyWhiteStripe}
                            className='mx-4 my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            White Stripe
                        </button>
                    </div>
                    
                </div>
                <div className='flex flex-row'>
                        {input.intensityRescaling && <IntensityRescaling/>}
                </div>
                <div className='flex flex-row'>
                        {input.zScore && <ZScore />}
                </div>
                <div className='flex flex-row'>
                {loadingHM && <span className='text-black'>Calculating... <i>This may take time</i></span>}
                        {input.histogramMatching && <HistogramMatching/>}
                </div>
                <div className='flex flex-row'>
                        {input.whiteStripe && <WhiteStripe/>}
                </div>
                
			</div>
		);
  };

export default Standardization;