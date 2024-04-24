import React, { useState } from 'react';
import Navbar from './Navbar';
import {  useNavigate } from 'react-router-dom';
const ImageLoader = () => {
   const navigate = useNavigate()
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleImageChange = (event) => {
    const file = document.getElementById("dropzone-file").files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(file);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
	setUploading(true);
    //enviar al server
	const formdata = new FormData();
	formdata.append("file", image, image.name);

	const requestOptions = {
		method: "POST",
		body: formdata,
	};

	fetch("http://localhost:8000/image/upload", requestOptions)
		.then((response) =>{
			setUploading(false);
			
			localStorage.setItem("image", image.name);
			setImage(null);
			navigate("/view")
		})
		.catch((error) => console.error(error));
	};

  return (
		<div className="flex flex-col items-center">
			<Navbar />
			{image == null && (
				<div class="flex items-center justify-center w-full">
					<label
						for="dropzone-file"
						class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
					>
						<div class="flex flex-col items-center justify-center pt-5 pb-6">
							<svg
								class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 16"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="font-semibold">Click to upload</span> or drag and
								drop
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								Medical image (.nii)
							</p>
						</div>
						<input
							id="dropzone-file"
							type="file"
							accept="*"
							onChange={handleImageChange}
							class="hidden"
						/>
					</label>
				</div>
			)}

			{image && (
				<div className="mb-4 text-black">
					{image.name} - {(image.size / 1048576).toFixed(2)} MB
				</div>
			)}
			{image && (
				<div>
					{uploading ? (
						<div>loading</div>
					) : (
						
						<button
							onClick={handleSubmit}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Inspect
						</button>
						
					)}
				</div>
			)}
		</div>
	);
};

export default ImageLoader;
