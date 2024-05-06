

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
  min_t = img.min() #minimo trasformado (suele ser el cero el minimo)
  max_t = img.max()
  rang = abs(max_t - min_t)
    
    
  tol = rang/20
  clean_img = img[img>(min_t + tol)]
  
  mean_intensity = clean_img.mean()
  std_intensity = clean_img.std()
  print("mean_intensity", mean_intensity)
  mean_matrix = np.full(img.shape, mean_intensity)
 

  new_img = (img - mean_matrix) * (1/ std_intensity)
  
  
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

  




def transform(value, functions, doms, img_testing ):
  per_value = sp.percentileofscore(img_testing.flatten(),value)
  for i in range(len(functions)-1):
    if( per_value >= doms[i][0] and per_value <  doms[i+1][0]):
      print(value, functions[i](value))
      return functions[i](per_value)
    elif per_value >= doms[i][0]:
      return functions[i](per_value)
  return -1 #max



# print(x,y, y_intensity,len(funcs))
# print( len(doms))

def histogram_matching(input_img:np.ndarray, test_img:np.ndarray):
  #input_img is a reference image

   fs,doms = h_training(input_img,test_img, k_pers=5)
   tes = h_testing(test_img, fs, doms)
   return tes

def h_training(img:np.ndarray,img_t, k_pers):

  x = np.linspace(5,95,k_pers)
  y = np.percentile(img.flatten(),x) ## y training

  img_testing = img_t #np.random.randint(1, 9, size=(8, 8))*10#np.array([[10,30,20],[20,30,20],[30,20,20]]) # img to tranform
  y_intensity = np.percentile(img_testing.flatten(),x)

  funcs = []
  doms = []
  for i in range(len(x)-1):
    m = int(y[i+1]-y[i])/(x[i+1]-x[i])
    b = y[i] - m*x[i]
    if int(b) < 0:
      b = abs(b)
    fx1 = lambda x: m*x + int(b)
    funcs.append(fx1)
    per_min = sp.percentileofscore(img_testing.flatten(),y_intensity[i])
    per_max =  sp.percentileofscore(img_testing.flatten(),y_intensity[i])
    doms.append( [per_min, per_max])

  return (funcs, doms)

def h_testing(img:np.ndarray, funcs, doms):
   new_img = np.zeros(img.shape)
   for i in range(img.shape[0]):
    for j in range(img.shape[1]):
      for k in range(img.shape[2]):
      # Acceder y procesar el elemento en la posición (i, j, k)
        new_img[i, j, k] = transform(img[i, j, k], funcs, doms, img)

   return new_img

def white_stripe(matrix):
    bins, counts, patches = plt.hist(matrix[matrix>50].flatten(),200)
    bins_r = list(reversed(bins))
    counts_r = list(reversed(counts))

    tol= 100
    for i in range(len(counts )- 3):
      if bins_r[i] < bins_r[i+1] and bins_r[i+1] > bins_r[i+2]:
        if (bins_r[i+1] -bins_r[i]) > tol and (bins_r[i+1] -bins_r[i+2]) > tol:
          #print(bins_r[i],bins_r[i+1],bins_r[i+2], counts_r[i+1])
          ws = counts_r[i+1]
          break
    
   
    new_img = matrix / ws
    return new_img

def denoising_filter(img:np.ndarray, vicinity_len=1, fn=np.mean):
  # all values in vecinity

   current_vicinity = []
   new_img = np.zeros(img.shape)
   for i in range(img.shape[0]):

      for j in range(img.shape[1]):
        for k in range(img.shape[2]):

          if img[i,j,k] > 0 :

            for x in range(i-vicinity_len, i+vicinity_len+1):
              for y in range(j-vicinity_len, j+vicinity_len+1):
                # for z in range(k-vicinity_len, k+vicinity_len+1):
                  if x >= 0 and y >= 0  and x < img.shape[0] and y < img.shape[1] :#and z < img.shape[2]
                    current_vicinity.append(img[x,y,k])


            new_img[i, j, k] = fn(current_vicinity)
          else:
            new_img[i, j, k] = img[i,j,k]

          current_vicinity = []
   return new_img

