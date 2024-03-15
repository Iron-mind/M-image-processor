import React, { useState } from 'react';

const ImageViewer = () => {
  const [sliderValue, setSliderValue] = useState(0); // Valor inicial del slider
  const [images, setImages] = useState({
    cenital: null,
    sagital: null
  }); // Estado para almacenar las imágenes

  // Función para manejar el cambio en el slider
  const handleSliderChange = (event) => {
    const value = event.target.value;
    setSliderValue(value);
    // Aquí deberías hacer una solicitud al servidor para obtener las imágenes correspondientes al valor del slider
    // Reemplaza esta línea con tu lógica para obtener las imágenes del servidor
    const newImages = {
      cenital: `https://imgs.search.brave.com/YjueatGolKxK73oKyrGczJGywmCJwrnfenCalg9SUac/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy85/Lzk3L1RhYy1kZS1s/YS1jYWJlemExLmpw/Zw`,
      sagital: `https://imgs.search.brave.com/Jngkv6afL0LXVQt0YqQrL_DtqiUH3m3vcP9QM0Nuhmg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTY5/NjE2NjEvZXMvZm90/by9tcmktZGVsLWNl/cmVicm8uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPThYdW9N/OEMwbzZtdkl6TF8w/LU92ODJkMXV1ZEVT/QXhFUTZkTjh3ZWFB/d1U9`
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

			<input
        title={""+sliderValue}
				type="range"
				min={0}
				max={100}
				value={sliderValue}
				onChange={handleSliderChange}
				className="w-80"
			/>
		</div>
	);
};

export default ImageViewer;
