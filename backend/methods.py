

from matplotlib import pyplot as plt
import numpy as np
import nibabel as nib
import scipy.stats as sp
def scale_matrix(matrix):
    scaled_matrix = (matrix - matrix.min()) * (255 / (matrix.max() - matrix.min()))
    return np.clip(scaled_matrix,0,255)

def isodata(img):
    tau_t = 100
    delta = 100
    tol = 0.01
    while tol < delta:
        img_th = img > tau_t
        m_foreground = img[img_th == 1].mean()
        m_background = img[img_th == 0].mean()
        tau_new = 0.5*(m_background + m_foreground)
        delta = abs(tau_new - tau_t)
        tau_t = tau_new
    return tau_t


def k_means(matriz, ik_values):
    # K-means clustering
    print("K-means")
    k_means = ik_values
    k_values = [[] for _ in range(len(k_means))]
  
    h,w = matriz.shape
    new_matriz = np.zeros(matriz.shape)
    
    tol = 0.001

    con = True
    while con:
        for i in range(h):
            for j in range(w):
                min = np.Infinity
                for km in range(len(k_means)):
                    if abs(matriz[i,j] - k_means[km]) < min:
                        min = k_means[km]
                        k_values[km].append(matriz[i,j])
                new_matriz[i,j] = min

        for i in range(len(k_means)):
            new_mean = np.mean(k_values[i])

            ## si el promedio no cambia en la iteración entonces me detengo
            if abs(new_mean -  k_means[i]) < tol:
                con = False
            k_means[i] = np.mean(k_values[i])
    print(k_means)
    return new_matriz

  # Función para calcular el promedio de los puntos seleccionados
def calcular_promedio(selected_points):

    total = sum(selected_points)
    if total== 0:
        return 0
    return total / len(selected_points)


def region_growing(matriz, seed_points, tol):
    # Creamos una matriz de ceros del mismo tamaño que la matriz original
    region = [[0] * len(matriz[0]) for _ in range(len(matriz))]
    def dentro_limites(x, y):
        return 0 <= x < len(matriz) and 0 <= y < len(matriz[0])

  
    # Función para verificar si un punto adyacente cumple con la condición y agregarlo a la lista de puntos seleccionados
    def revisar_adyacentes(x, y, promedio):
      adyacentes_por_visitar = [(x, y)]
      while adyacentes_por_visitar:
          nx, ny = adyacentes_por_visitar.pop()
          adyacentes = [(nx+1, ny), (nx-1, ny), (nx, ny+1), (nx, ny-1)]
          for px, py in adyacentes:
              if dentro_limites(px, py) and region[px][py] == 0:
                  if abs(matriz[px][py] - promedio) < tol:
                      region[px][py] = 1
                      selected_points.append(matriz[px][py])
                      adyacentes_por_visitar.append((px, py))


    # Iteramos sobre los puntos de inicio (seed_points)
    for sx, sy in seed_points:
        # Paso 1: Agregamos el punto de inicio a la lista de puntos seleccionados
        selected_points = [matriz[sx][sy]]
        region[sx][sy] = 1


        # Paso 3: Calculamos el promedio de los puntos seleccionados
        promedio = calcular_promedio(selected_points)
        # if promedio == 0:
        #   promedio = selected_points[0]
        #   print(promedio)

        # Paso 4: Aplicamos los pasos 1 y 2 a cada uno de los nuevos puntos seleccionados
        while selected_points:
            new_seed_points = [(x, y) for x in range(len(matriz)) for y in range(len(matriz[0])) if region[x][y] == 1]
            selected_points = []
            for nx, ny in new_seed_points:
                revisar_adyacentes(nx, ny, promedio)
    
    print("Region growing")
    # plt.imshow(np.array(region).astype(np.uint8))
    # plt.savefig('./cache/draft_g.jpg')
    return np.array(region).astype(np.uint8) 


def region_growing_3d(img, startI, coordinates, axis):
  tolerance = 25
  aux_startI = startI
  
  annotation_img = np.zeros(img.shape)
  if axis == "z":
    img2d = img[:,:,startI]
    annotation_img[:,:,startI] = region_growing(img2d,coordinates,tolerance )
  elif axis == "x":
    img2d = img[startI,:,:]
    annotation_img[startI,:,:] = region_growing(img2d,coordinates,tolerance )
  elif axis == "y":
    img2d = img[:,startI,:]
    annotation_img[:,startI,:] = region_growing(img2d,coordinates,tolerance )

  img_length = len(img2d)
  for i in range(50):
    if startI-i < 0:
      break
    #case z
    if axis == "z":
        matriz = img[:,:,startI]
        matriz_back = img[:,:,startI-1]
    elif axis == "x":
      matriz = img[startI,:,:]
      matriz_back = img[startI-1,:,:]
    elif axis == "y":
        matriz = img[:,startI,:]
        matriz_back = img[:,startI-1,:]
    selected_p = []

    for sx,sy in coordinates:
      selected_p.append(matriz[sx,sy])

    mean_sp = calcular_promedio(selected_p)

    seed_points = []
    for sx,sy in coordinates:
      if abs(matriz_back[sx,sy] - mean_sp) < tolerance:
        seed_points.append((sx,sy))

    if len(seed_points)==0:
      break

    res = region_growing(matriz_back,seed_points,tolerance )
    #z case
    if axis == "z":
        annotation_img[:,:,startI-1] = res
    if axis == "x":
      annotation_img[startI-1,:,:] = res
    elif axis == "y":
        annotation_img[:,startI-1,:] = res
    startI -= 1

  ## forward region
  startI = aux_startI # asign startI again
  for j in range(50):
    if startI + j > img_length:
      break
    #case z
    if axis == "z":
        matriz = img[:,:,startI]
        matriz_for = img[:,:,startI+1]

    if axis == "x":
        matriz = img[startI,:,:]
        matriz_for = img[startI+1,:,:]
    elif axis == "y":
        matriz = img[:,startI,:]
        matriz_for = img[:,startI+1,:]

    selected_p = []

    for sx,sy in coordinates:
      selected_p.append(matriz[sx,sy])

    mean_sp = calcular_promedio(selected_p)

    seed_points = []
    for sx,sy in coordinates:
      if abs(matriz_for[sx,sy] - mean_sp) < tolerance:
        seed_points.append((sx,sy))

    if len(seed_points)==0:
      break

    res = region_growing(matriz_for,seed_points,tolerance )
    #z case
    if axis == "z":
        annotation_img[:,:,startI+1] = res
    if axis == "x":
        annotation_img[startI+1,:,:] = res
    elif axis == "y":
        annotation_img[:,startI+1,:] = res

    startI += 1
  
  return annotation_img

def z_score_transform(img:np.ndarray):
  clean_img = img[img>0]
  
  mean_intensity = clean_img.mean()
  std_intensity = clean_img.std()

  mean_matrix = np.full(img.shape, mean_intensity)
 

  new_img = (img - mean_matrix)/ std_intensity
  

  return new_img

def intensity_rescaling(img:np.ndarray):
  values = img[img>0].flatten()
  min_intensity = np.min(values)
  max_intensity = np.max(values)

  matrix_min = np.full(img.shape, min_intensity)
  matrix_max = np.full(img.shape, max_intensity)

  new_img = (img - matrix_min)/ (matrix_max - matrix_min)
  return new_img


def save_nii(img:np.ndarray, filename:str):
  new_nii = nib.Nifti1Image(img, affine=None)
  nib.save(new_nii, filename)
  return True

def histogram_matching(input_img:np.ndarray, test_img:np.ndarray):
   
   fs = h_training(input_img, 5)
   x = np.linspace(5,100,5)
   tes = h_testing(test_img, fs, x)
   return tes
 
def h_training(img:np.ndarray, k_pers):

  x = np.linspace(5,100,k_pers)
  y = np.percentile(img.flatten(),x)

  m = (y[1]-y[0])/(x[1]-x[0])
  b = y[0] - m*x[0]

  fx1 = lambda x: m*x + b
  
  m2 = (y[2]-y[1])/(x[2]-x[1])
  b2 = y[1] - m2*x[1]
  fx2 = lambda x: m2*x + b2

  m3 = (y[3]-y[2])/(x[3]-x[2])
  b3 = y[2] - m3*x[2]
  fx3 = lambda x: m3*x + b3

  m4 = (y[4]-y[3])/(x[4]-x[3])
  b4 = y[3] - m4*x[3]
  fx4 = lambda x: m4*x + b4

  print("x: ",x)
  
  return [ fx1,fx2,fx3,fx4]

def h_testing(img:np.ndarray, functions, landmarks):
  print(img.flatten().shape)
  img_f =img.flatten() 
  img_f_sorted = np.sort(img_f)
  img_f_set = list(set(img_f_sorted ))
  percentiles = sp.percentileofscore(img_f_set, img[:,:,120])
  print(percentiles.shape, img.shape)
  new_img = np.zeros(img[:,:,120].shape)

  # new_img[percentiles > landmarks[0] and percentiles < landmarks[1]] = functions[0](percentiles[percentiles > landmarks[0] and percentiles < landmarks[1]])
  for i in range(len(functions)):
    if (percentiles > landmarks[i]).any() and (percentiles < landmarks[i+1]).any():
        matching_indices = (percentiles > landmarks[i]) & (percentiles < landmarks[i+1])  # Efficient element-wise comparison
        new_img[matching_indices] = functions[i](percentiles[matching_indices])
  
  return new_img
  

aux_img = nib.load("./cache/sub-p8-T1w.nii.gz")
aux_img = aux_img.get_fdata()

input_img = nib.load("./cache/sub-01_T1w.nii")
input_img = input_img.get_fdata()

aux = np.array([[1,3,4],[2,3,4],[3,4,5]])
aux_test = np.array([[10,30,40],[20,30,40],[30,40,50]])

# print(aux_img.shape, input_img.shape)
# ni = histogram_matching(input_img=input_img, test_img=aux_img)
# print(ni.min(), ni.max())
# print(ni)
# plt.hist(ni[ni>0].flatten(), bins=100)


def white_stripe(matrix):
    bins, counts, patches = plt.hist(matrix[matrix>50].flatten(),200)
    bins_r = list(reversed(bins))
    counts_r = list(reversed(counts))
    ws_index = 0
    tol= 100
    for i in range(len(counts )- 3):
      if bins_r[i] < bins_r[i+1] and bins_r[i+1] > bins_r[i+2]:
        if (bins_r[i+1] -bins_r[i]) > tol and (bins_r[i+1] -bins_r[i+2]) > tol:
          #print(bins_r[i],bins_r[i+1],bins_r[i+2], counts_r[i+1])
          ws = counts_r[i+1]
          break
    
   
    new_img = matrix / ws
    return new_img