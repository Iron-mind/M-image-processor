import { useState } from 'react'
import './App.css'
import ImageLoader from './components/FileLoader'

function App() {


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
