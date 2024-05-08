/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import Navbar from './Navbar';

const Registration = () => {
  const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
  const [imageName, setImageName] = useState(localStorage.getItem("image"));
  const [referenceImage, setImage] = useState(null);
  const [selectedView, setSelectedView] = useState("cenital"); //or sagital
  const refImageName = localStorage.getItem("referenceImage");
  const [images, setImages] = useState({
    cenital: `http://localhost:8000/image/${imageName}?x=100`,
    sagital: `http://localhost:8000/image/${imageName}?y=100`,
    cenitalRef: `http://localhost:8000/image/${refImageName}?x=100`,
    sagitalRef: `http://localhost:8000/image/${refImageName}?y=100`,
    cenitalRes: `http://localhost:8000/image/registration-res.nii?x=100`,
    sagitalRes: `http://localhost:8000/image/registration-res.nii?y=100`,
  });

  // Component logic and state go here
  const handleSliderChangex = (event) => {
    const value = event.target.value;
    setSliderValuex(value);

    const newImages = {
      ...images,
      cenital: `http://localhost:8000/image/${imageName}?x=${value}`,
      cenitalRef: `http://localhost:8000/image/${refImageName}?x=${value}`,
      cenitalRes: `http://localhost:8000/image/registration-res.nii?x=${value}`,
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
      sagitalRef: `http://localhost:8000/image/${refImageName}?y=${value}`,
      sagitalRes: `http://localhost:8000/image/registration-res.nii?y=${value}`,
    };
    setImages(newImages);
  };
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

  const applyTransform = async () => {

    fetch(`http://localhost:8000/image/registration/${imageName}?ref=${refImageName}`)
      .then((response) => response.json())
      .then((data) => {
        alert("Registration done");
      })
      .catch((error) => console.error(error));

  }
  return (
    // JSX code for the component's UI goes here
    <div>

      <Navbar />
      <div className="mt-8" id="kms">
        <Navbar />
        <h1 className="text-lg font-bold text-black">Growing region viewer</h1>

        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setSelectedView("cenital")}
            className=" px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Profile
          </button>

          <button
            onClick={() => setSelectedView("sagital")}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            Above
          </button>
        </div>
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
        <div className="flex flex-col w-[300px]">
          <div className="my-2">
            <button
              onClick={() => {
                handleSubmit()
              }}
              className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Load image
            </button>
          </div>
        </div>
        <div className="my-5 relative">
          {selectedView == "cenital" && images.cenital && (
            <div className='flex row'>
              <img
                src={images.cenital}
                alt="Cenital"
                width={"150%"}
                height={"auto"}
                className="mb-8 mx-1"
              />
              <img
                src={images.cenitalRef}
                alt="Cenital"
                width={"150%"}
                height={"auto"}
                className="mb-8 mx-1"
              />
            </div>
          )}{" "}
          -
          {selectedView == "sagital" && images.sagital && (
            <div className='flex row'>
              <img
                src={images.sagital}
                alt="sagital"
                width={"150%"}
                height={"auto"}
                className="mb-8 inline-block"
              />
              <img
                src={images.sagitalRef}
                alt="sagital"
                width={"150%"}
                className="mb-8 mx-1"
              />

            </div>
          )}

        </div>

        <div className="row my-7">
          {selectedView == "cenital" ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div className="flex flex-row justify-center">
          <div className="flex flex-col w-[300px]">
            <div className="my-2">
              <button
                onClick={() => {
                  applyTransform()
                }}
                className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Apply transform
              </button>
            </div>
          </div>

        </div>




        <div className="my-5 relative">
          {selectedView == "cenital" && images.cenital && (
            <div className='flex row'>
              <img
                src={images.cenital}
                alt="Cenital"
                width={"150%"}
                height={"auto"}
                className="mb-8 mx-1"
              />
              <img
                src={images.cenitalRes}
                alt="Cenital"
                width={"150%"}
                height={"auto"}
                className="mb-8 mx-1"
              />
            </div>
          )}{" "}
          -
          {selectedView == "sagital" && images.sagital && (
            <div className='flex row'>
              <img
                src={images.sagital}
                alt="sagital"
                width={"150%"}
                height={"auto"}
                className="mb-8 inline-block"
              />
              <img
                src={images.sagitalRes}
                alt="sagital"
                width={"150%"}
                className="mb-8 mx-1"
              />

            </div>
          )}

        </div>




      </div>

    </div >
  );
};

export default Registration;