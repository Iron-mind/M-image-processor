
from flask import Flask, jsonify, render_template, request, send_file, send_from_directory
import imageio

from matplotlib import pyplot as plt
import nibabel as nib
import pandas as pd
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__, static_folder='dist/assets', template_folder='dist')

CORS(app, origins=["http://localhost:5173"])



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

 
    # Check if file exists
    if file:
      # Generate unique filename
      filename = file.filename
    
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

@app.route("/image/th/<filename>")
def apply_thresholding(filename):
    # Load the image
    try:
        img = nib.load("./cache/"+filename)
        x = request.args.get("x")
        y = request.args.get("y")
        th = request.args.get("th")
    except:
        return "Image not found"
    
    img = img.get_fdata()
  
    if th is not None:
        thn = int(th)
    else:
        return "Threshold not found"
    img_th = img > thn
    img_th = np.where(img_th, 400, 0).astype(float)
 
    # Selecciona la matriz deseada
    if y is not None:
        matriz = img_th[:,:,int(y)]
    else:
        matriz = img_th[int(x),:,:]
    imagen_webp = imageio.imwrite("<bytes>", matriz, format="webp", lossless=True, method=6)
    output_filename = "draft.webp"

# Save the WebP image to the output directory
    with open(os.path.join("cache", output_filename), "wb") as f:
        f.write(imagen_webp)
    # Retorna la imagen como respuesta al GET
    return send_file("cache/draft.webp", mimetype="image/webp")

@app.route('/')
def page():
    return render_template( 'index.html')
    return send_from_directory('dist', 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
