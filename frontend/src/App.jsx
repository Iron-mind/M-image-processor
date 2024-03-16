import { useState } from 'react'
import './App.css'
import ImageLoader from './components/FileLoader'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 className="text-black text-lg">Upload an image Nifti</h1>
          <ImageLoader />
        <br />
      </div>
     
      
    </>
  )
}

export default App
