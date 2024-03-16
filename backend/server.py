
from flask import Flask, jsonify, request, send_file
import imageio

import nibabel as nib
import pandas as pd
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

@app.route("/")
def hello_world():
    return "Hola Mundo!"

# url example: /imagen/sub-01_T1w.nii?y=110
@app.route("/image/<filename>")
def get_imagen(filename):
    # Carga la imagen NIfTI
    try:
        img = nib.load("./cache/"+filename)
        x = request.args.get("x")
        y = request.args.get("y")
    except:
        return "Image not found"

    img = img.get_fdata()
    # Selecciona la matriz deseada
    if y is not None:
        matriz = img[:,:,int(y)]
    else:
        matriz = img[int(x),:,:]
    # Convierte la matriz a una imagen WebP
    imagen_webp = imageio.imwrite("<bytes>", matriz, format="webp", lossless=True, method=6)
    output_filename = "draft.webp"

# Save the WebP image to the output directory
    with open(os.path.join("cache", output_filename), "wb") as f:
        f.write(imagen_webp)
    # Retorna la imagen como respuesta al GET
    return send_file("cache/draft.webp", mimetype="image/webp")

@app.route("/image/upload", methods=["POST"])
def handle_upload():
  # Check if request method is POST
  if request.method == "POST":
    # Access uploaded file
    
    file = request.files["file"] # Assuming file input field is named "file"

    # print(type(file))
    # return jsonify(file)
    # Check if file exists
    if file:
      # Generate unique filename
      filename = file.filename
      print(filename)
      # Save file to cache folder
    #   ruta_cache = Path("cache")
      file.save(os.path.join("cache", filename))
      
      # Prepare response
      message = f"Archivo recibido: {filename}"
      response = {"message": message}
      return jsonify(response)
    
    # Return error if file not found
    return jsonify({"error": "No se ha recibido ningún archivo"}), 400
  
  # Return error if not POST request
  return jsonify({"error": "Unsupported request method"}), 405

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
