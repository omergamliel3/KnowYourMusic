import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/core";
import useWindowDimensions from "./useWindowDimensions";
import "./style.scss";

const BackgroundSVG = () => {
	const pathRef = useRef(null);
	let { height, width } = useWindowDimensions(),
		ratio = width / height,
		svgHeight = 800 / ratio,
		svgCurveHeight = svgHeight * (svgHeight < 800 ? 0.75 : 0.8),
		svgCurveMax = svgHeight * 0.875;

	useEffect(() => {
		const curve = pathRef.current;
		let last_known_scroll_position = 0;
		const defaultCurveValue = svgCurveMax;
		const curveRate = 3;
		let ticking = false;
		let curveValue;

		const scrollEvent = scrollPos => {
			if (scrollPos >= 0 && scrollPos < defaultCurveValue) {
				curveValue =
					defaultCurveValue -
					parseFloat(scrollPos / curveRate) / Math.min(ratio + 0.2, 1);
				curve.setAttribute(
					"d",
					`M 800 ${svgCurveHeight} Q 400 ${curveValue} 0 ${svgCurveHeight} L 0 0 L 800 0 L 800 ${svgCurveHeight} Z`
				);
			}
		};
		function scrollListener(e) {
			last_known_scroll_position = window.scrollY;
			if (!ticking) {
				window.requestAnimationFrame(() => {
					scrollEvent(last_known_scroll_position);
					ticking = false;
				});
			}
			ticking = true;
		}
		window.addEventListener("scroll", scrollListener);
		return () => window.removeEventListener("scroll", scrollListener);
	}, [svgHeight, svgCurveHeight, svgCurveMax]);

	return (
		<Box
			className="svg-container"
			pos="absolute"
			top="0"
			left="0"
			right="0"
			margin="0"
			padding="0"
			zIndex="-1"
		>
			<svg
				viewBox={`0 0 800 ${svgHeight}`}
				className="svg"
				gradientTransform="rotate(62)"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#8EC5FC" />
						<stop offset="100%" stopColor="#E0C3FC" />
					</linearGradient>
				</defs>
				<path
					ref={pathRef}
					id="curve"
					fill="url(#gradient)"
					d={`M 800 ${svgCurveHeight} Q 400 ${svgCurveMax} 0 ${svgCurveHeight} L 0 0 L 800 0 L 800 ${svgCurveHeight} Z`}
					style={{
						transition: "all 0.15s ease",
					}}
				/>
			</svg>
		</Box>
	);
};

export default BackgroundSVG;
