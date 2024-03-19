

import numpy as np


def isodata(img):
    tau_t = 100
    delta = 100
    tol = 0.001
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
    rang = np.max(matriz)
    tol = 0.1

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


def region_growing(matriz, seed_points, tol):
    # Creamos una matriz de ceros del mismo tamaño que la matriz original
    region = [[0] * len(matriz[0]) for _ in range(len(matriz))]

    # Función para verificar si un punto está dentro de los límites de la matriz
    def dentro_limites(x, y):
        return 0 <= x < len(matriz) and 0 <= y < len(matriz[0])

    # Función para calcular el promedio de los puntos seleccionados
    def calcular_promedio(selected_points):

        total = sum(selected_points)
        if total== 0:
          return 0
        return total / len(selected_points)

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