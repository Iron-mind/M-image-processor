import React, { useRef, useEffect, useState } from 'react';

const AnnotationCanvas = ({ addPoint, view, color }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [sizes, setSizes] = useState({w: 720, h: 480});
  let imageNames = localStorage.getItem("image");
  useEffect(() => {
    function fetchData() {
        let v = view === "cenital" ? "x" : "y";
        fetch(`http://localhost:8000/image/${imageNames}/sizes?view=${v}`)
          .then((response) => response.json())
          .then((data) => {
             
              setSizes({w: data.w, h: data.h});
          })
          .catch((error) => console.error(error));
      }
      
      fetchData();
    }, [view]);
  useEffect(() => {
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Establecer color inicial
    ctx.strokeStyle = color || 'red';
    ctx.lineWidth = 8;

    const handleMouseDown = (event) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setPrevPos({ x, y });
    };

    const handleMouseMove = (event) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      drawLine(ctx, prevPos.x, prevPos.y, x, y);
      addPoint([x, y]);
      addPoint([prevPos.x, prevPos.y]);
      setPrevPos({ x, y });
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    const handleMouseOut = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isDrawing, prevPos]);

  const drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  const clearCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        addPoint(false);
	};
  return (
		<div
			width={sizes.w * 3}
			height={sizes.h * 3}
			className="absolute top-0 left-0"
		>
			<canvas
				ref={canvasRef}
				width={sizes.w * 3}
				height={sizes.h * 3}
				className="border-[#0075FF] border-2 cursor-crosshair"
			/>
			<button  onClick={clearCanvas} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Clean
			</button>
		</div>
	);
};

export default AnnotationCanvas;
