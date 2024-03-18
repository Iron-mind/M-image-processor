
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