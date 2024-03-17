import React from 'react'
import ReactDOM from 'react-dom/client'
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
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
		<nav className="bg-gray-800 fixed top-0 left-0 right-0">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						
						<div className="hidden sm:block">
							<div className="ml-10 flex items-baseline space-x-4">
								<Link
									to="/"
									className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
								>
									Load
								</Link>
								<Link
									to="/view"
									className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
								>
									viewer
								</Link>
								<Link
									to="/processor"
									className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
								>
									Processor
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
		<div class="relative bottom-3 left-0 right-0 flex justify-center items-center">
			<p className="read-the-docs block">
				Developed by Juan David Tovar (iron-mind)
			</p>

			<a href="https://github.com/iron-mind" class="text-[#0075FF]">
				- Github
			</a>
		</div>
	</React.StrictMode>
);
