import { useState } from 'react'

import './App.css'
import ImageViewer from './components/ImageViewer'
import ImageLoader from './components/FileLoader'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 className="text-black text-lg">Upload an image Nifti</h1>
        <ImageLoader />
        <ImageViewer />
        <br />
      </div>
      <p className="read-the-docs">
        Developed by Juan David Tovar (iron-mind)
      </p>
        <a href="github.com/iron-mind" className='text-[#0075FF] '>Github</a>
    </>
  )
}

export default App
