
from flask import Flask, jsonify, render_template, request, send_file, send_from_directory
import imageio

from matplotlib import pyplot as plt
import nibabel as nib
import numpy as np
import os
from flask_cors import CORS
from methods import isodata, k_means, region_growing, scale_matrix

app = Flask(__name__, static_folder='dist/assets', template_folder='dist')

CORS(app, origins=["http://localhost:5173"])



# url example: /imagen/sub-01_T1w.nii?y=110
@app.route("/image/best-tau/<filename>")
def best_tau(filename):
   
    try:
        img = nib.load("./cache/"+filename)
        img = img.get_fdata()
    except:
        return "Image not found"
    
    return jsonify({"tau":isodata(img)})

@app.route("/image/<filename>")
def get_imagen(filename):
    # Carga la imagen NIfTI
    try:
        img = nib.load("./cache/"+filename)
        x = request.args.get("x")
        y = request.args.get("y")
    except:
        print("Image not found")
        return "Image not found"

    img = img.get_fdata()
    # Selecciona la matriz deseada
    if y is not None:
        matriz = img[:,:,int(y)]
    else:
        matriz = img[int(x),:,:]
    # Convierte la matriz a una imagen WebP
    matriz = scale_matrix(matriz)

    
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
        thn = float(th)
    else:
        return "Threshold not found"
    img_th = img > thn
    img_th = np.where(img_th, 400, 0).astype(float)
 
    # Selecciona la matriz deseada
    if y is not None:
        matriz = img_th[:,:,int(y)]
    else:
        matriz = img_th[int(x),:,:]

    matriz = scale_matrix(matriz)
    plt.imshow(matriz)
    fname = "draft.jpg"
    plt.savefig('./cache/'+fname)

    # Retorna la imagen como respuesta al GET
    return send_file("cache/draft.jpg", mimetype="image/jpg")

@app.route("/image/kmeans/<filename>")
def apply_kmeans(filename):
    try:
        img = nib.load("./cache/"+filename)
        x = request.args.get("x")
        y = request.args.get("y")
        k_values = request.args.get("kvalues")
    except:
        return "Image not found"

    img = img.get_fdata()
    # Selecciona la matriz deseada
    k_values = [float(v) for v in k_values.split(",")]
    if y is not None:
        matriz = k_means(img[:,:,int(y)], k_values)
    else:
        matriz = k_means(img[int(x),:,:], k_values)
     # Convierte la matriz a una imagen 
    plt.imshow(matriz)
    fname = "draft.jpg"
    plt.savefig('./cache/'+fname)
    return send_file("cache/draft.jpg", mimetype="image/jpg")


@app.route("/image/<filename>/sizes")
def get_sizes(filename):
    try:
        img = nib.load("./cache/"+filename)
        v = request.args.get("view")
    except:
        return "Image not found"
    img = img.get_fdata()
    
    if v == "x":
        w,h = img[0,:,:].shape
    else:
        h,w = img[:,:,0].shape

    print({"w":w,"h":h})
    return jsonify({"w":w,"h":h})


@app.route("/image/<filename>/region-growing", methods=["POST"])
def apply_region_growing(filename):
    points = []
    x = None
    y = None
    if request.method == "POST":
        try:
            
            img = nib.load("./cache/"+filename)
            data = request.json
            view = data["view"]
            if view == "cenital":
                x = data["x"]
            else :
                y = data["y"]
            points = data["points"]
            # print(data)
        except KeyError as e :
            print(e)
            
        img = img.get_fdata()
        print(points[0])
        points = [(round(p[1]/3), round(p[0]/3)) for p in points] # /3 because the image is 3 times bigger than the original from frontend
        

        # Selecciona la matriz deseada
        if y is not None:
            
            matriz = region_growing(img[:,:,int(y)], points, 18)
        else:
            
            matriz = region_growing(img[int(x),:,:], points, 18)

        plt.imshow(matriz)
        random_name = "draft_g-"+str(np.random.randint(0,20))+".jpg"
        plt.savefig('./cache/'+random_name)
        # Convierte la matriz a una imagen WebP
        
        return  jsonify({"msg":"Region growing", "filename":random_name})
    
@app.route("/image/cache/<filename>")
def get_cache(filename):
    return send_from_directory("cache", filename)
    

@app.route('/')
def page():
    return render_template( 'index.html')
  

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
