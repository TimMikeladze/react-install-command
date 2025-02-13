import html2canvas from "html2canvas";
import { type ReactNode, useRef, useState } from "react";

export const ComponentScreenshot = ({ children }: { children: ReactNode }) => {
	const componentRef = useRef<HTMLDivElement>(null);
	const [isCapturing, setIsCapturing] = useState(false);

	const captureScreenshot = async () => {
		if (!componentRef.current || isCapturing) {
			return;
		}

		try {
			setIsCapturing(true);
			const element = componentRef.current;

			const canvas = await html2canvas(element, {
				backgroundColor: null,
				scale: 2, // Higher quality
				logging: false,
				useCORS: true,
				width: element.scrollWidth, // Ensure full width is captured
				height: element.scrollHeight,
				windowWidth: element.scrollWidth, // Match window width to element width
				x: 0, // Start from the left edge
			});

			canvas.toBlob((blob: Blob | null) => {
				if (!blob) {
					return;
				}
				const downloadUrl = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = downloadUrl;
				link.download = "install-command-screenshot.png";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(downloadUrl);
				setIsCapturing(false);
			}, "image/png");
		} catch (error) {
			console.error("Error capturing screenshot:", error);
			setIsCapturing(false);
		}
	};

	return (
		<div className="relative">
			<div ref={componentRef} className="w-full pr-12">
				{" "}
				{/* Added right padding to prevent button overlap */}
				{children}
			</div>
			<button
				type="button"
				onClick={captureScreenshot}
				disabled={isCapturing}
				className="absolute top-2 right-2 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors hover:bg-blue-600 disabled:opacity-50"
				title="Capture Screenshot"
			>
				<div className={`h-6 w-6 ${isCapturing ? "animate-pulse" : ""}`}>
					📷
				</div>
			</button>
		</div>
	);
};
