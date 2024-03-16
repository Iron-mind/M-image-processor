import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.jsx'
import './index.css'
import ImageViewer from './components/ImageViewer.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/view/",
    element: <ImageViewer />
    ,
  },
  {
    path: "/processor/",
    element: <h1>Processor</h1>,
  },
  {
    path: "/*",
    element: <h1>Not found</h1>,
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
		<div class="fixed bottom-3 left-0 right-0 flex justify-center items-center">
    <p className="read-the-docs block">
        Developed by Juan David Tovar (iron-mind) 
      </p>
      
			<a href="https://github.com/iron-mind" class="text-[#0075FF]">
				- Github
			</a>
		</div>
	</React.StrictMode>
);
