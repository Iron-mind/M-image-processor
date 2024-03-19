import React from 'react'
import ReactDOM from 'react-dom/client'
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.jsx'
import './index.css'
import ImageViewer from './components/ImageViewer.jsx';
import Drawer from './components/Drawer.jsx';
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
    element: <Drawer />,
  },
  {
    path: "/*",
    element: <h1>Not found</h1>,
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />

		<div class="sticky bottom-1 left-0 right-0 flex justify-center items-center">
			<p className="read-the-docs block">
				Developed by Juan David Tovar (iron-mind)
			</p>

			<a href="https://github.com/iron-mind" class="text-[#0075FF]">
				- Github
			</a>
		</div>
	</React.StrictMode>
);
