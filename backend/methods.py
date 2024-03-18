
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