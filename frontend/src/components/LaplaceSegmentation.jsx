
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import AnnotationCanvas from './CanvaTransparent';

const LaplaceSegmentation = () => {
  const [sliderValuex, setSliderValuex] = useState(100); // Valor inicial del slider
  const [sliderValuey, setSliderValuey] = useState(100); // Valor inicial del slider
  const [imageName, setImageName] = useState(localStorage.getItem("image")); // Estado para almacenar el nombre de la imagen
  const [images, setImages] = useState({
    cenital: `http://localhost:8000/image/${imageName}?x=100`,
    sagital: `http://localhost:8000/image/${imageName}?y=100`,
    growing: ``
  });
  const [color, setColor] = useState("green"); // Color de los trazos en el canvas
  const [greenPoints, setGreenPoints] = useState([]); // Estado para almacenar los puntos de la región creciente
  const [points, setPoints] = useState([]); // Estado para almacenar los puntos de la región creciente
  const [sizes, setSizes] = useState({ w: 720, h: 480 });
  const [selectedView, setSelectedView] = useState("cenital"); //or sagital
  const [growingReady, setGrowingReady] = useState(false);
  useEffect(() => {
    function fetchData() {
      fetch(`http://localhost:8000/image/${imageName}/sizes?view=x`)
        .then((response) => response.json())
        .then((data) => {

          setSizes({ w: data.w, h: data.h });
        })
        .catch((error) => console.error(error));
    }

    fetchData();
  }, []);

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
    setPoints([]);
    setGreenPoints([]);
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
  const addNewPoint = (point) => {
    setGrowingReady(false);
    setImages({ ...images, growing: "" });
    if (color === "green") {
      if (!point) return setGreenPoints([]);
      setGreenPoints([...greenPoints, point]);
    } else {
      if (!point) return setPoints([]);
      setPoints([...points, point]);
    }

  }

  const applyLaplaceSegmentation = () => {
    setGrowingReady(false);
    setImages({ ...images, growing: "" });
    let v = selectedView === "cenital" ? "x" : "y";
    let val = selectedView === "cenital" ? sliderValuex : sliderValuey;
    fetch(`http://localhost:8000/image/${imageName}/laplace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points,
        greenPoints,
        [v]: val,
        view: selectedView,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGrowingReady(true);
        setImages({ ...images, growing: "http://localhost:8000/image/cache/" + data.filename });

      })
      .catch((error) => console.error(error));
  }

  function getLaplaceSegmentation() {
    fetch(`http://localhost:8000/image/cache/laplace-res.nii`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        let prefix = imageName.split(".")[0];
        a.download = prefix + "_rgr.nii";
        a.click();
      })
      .catch((error) => console.error(error));
  }
  return (
    <div className="mt-8" id="kms">
      <Navbar />
      <h1 className="text-lg font-bold text-black">Segmentation - select a bg and fg</h1>

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

      <div className="flex justify-center mb-4">
        <div className="my-5 relative">
          {selectedView == "cenital" && images.cenital && (
            <img
              src={images.cenital}
              alt="Cenital"
              width={sizes.w * 3}
              height={sizes.h * 3}
              className="mb-8"
            />
          )}{" "}
          -
          {selectedView == "sagital" && images.sagital && (
            <img
              src={images.sagital}
              alt="sagital"
              width={sizes.w * 3}
              height={sizes.h * 3}
              className="mb-8 inline-block"
            />
          )}
          <AnnotationCanvas view={selectedView} addPoint={addNewPoint} color={color} />
          <button onClick={() => { setColor("red") }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-5 mx-2">
            red
          </button>
          <button onClick={() => { setColor("green") }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-5">
            green
          </button>
        </div>
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
                if (points.length < 1) {
                  alert("Please select a point first");
                } else {
                  applyLaplaceSegmentation();
                }
              }}
              className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Apply Segmentation
            </button>
          </div>
        </div>

      </div>
      {growingReady && (
        <div className="flex flex-col justify-center">
          <img
            src={images.growing}
            alt="regional growing - mediacal image"
            width={sizes.w * 3 + 300}
          />
          <div className="my-4">
            <button
              onClick={getLaplaceSegmentation}
              className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save result
            </button>
          </div>
        </div>

      )}
    </div>
  );
};


export default LaplaceSegmentation;