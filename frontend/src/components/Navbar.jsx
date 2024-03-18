import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
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
		);
};

export default Navbar;