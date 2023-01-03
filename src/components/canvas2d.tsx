// CanvasRenderingContext2D reference:
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#drawing_rectangles

import Vector2 from '../vector2';
import { EngineXFunctionComponent } from '/src/jsx/jsx-runtime';

export const Transform: EngineXFunctionComponent<{
	reset?: boolean;
	translate?: Vector2;
	rotate?: number;
	scale?: Vector2;
	matrix?: [number, number, number, number, number, number];
}> = ({ reset, translate, rotate, scale, matrix, children }, { context }) => {
	if (reset) context.resetTransform();
	if (translate) context.translate(translate.x, translate.y);
	if (rotate) context.rotate(rotate);
	if (scale) context.scale(scale.x, scale.y);
	if (matrix) context.transform(...matrix);
	return children;
}

/**
 * See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
 */
export function FillStyle({ style, children }, { context }) {
	context.fillStyle = style;
	return children;
}

/**
 * For operation, see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 */
export function Alpha({ value, operation, children }, { context }) {
	context.globalAlpha = value;
	if (operation) context.globalCompositeOperation = operation;
	return children;
}

export function Rect(
	{
		begin,
		end, // Mandatory unless size or width and height are provided
		size, // Mandatory unless end or width and height are provided
		x = begin?.x ?? 0,
		y = begin?.y ?? 0,
		width = size?.x ?? end.x - begin.x, // Mandatory unless size or end is provided
		height = size?.y ?? end.y - begin.y, // Mandatory unless size or end is provided

		style,
		alpha,
	},
	{ context },
) {
	if (style) context.fillStyle = style;
	if (alpha) context.globalAlpha = alpha;
	context.fillRect(x, y, width, height);
}

export function Border(
	{
		begin,
		end, // Mandatory unless size or width and height are provided
		size, // Mandatory unless end or width and height are provided
		x = begin?.x ?? 0,
		y = begin?.y ?? 0,
		width = size?.x ?? end.x - begin.x, // Mandatory unless size or end is provided
		height = size?.y ?? end.y - begin.y, // Mandatory unless size or end is provided

		style,
		shadowColor,
		shadowBlur,
		shadowOffsetX,
		shadowOffsetY,
		lineJoin,
		lineWidth,
		children,
		alpha,
	},
	{ context },
) {
	if (shadowColor) context.shadowColor = shadowColor;
	if (shadowBlur) context.shadowBlur = shadowBlur;
	if (lineJoin) context.lineJoin = lineJoin;
	if (lineWidth) context.lineWidth = lineWidth;
	if (style) context.strokeStyle = style;
	if (shadowOffsetX) context.shadowOffsetX = shadowOffsetX;
	if (shadowOffsetY) context.shadowOffsetY = shadowOffsetY;
	if (alpha) context.globalAlpha = alpha;
	context.strokeRect(x, y, width, height);
	return children;
}

// TOOD Get text from children if `text` prop is empty.
export function Text({
		text,
		x = 0,
		y = 0,
		maxWidth,
		font,
		textAlign,
		textBaseline,
		direction,
		outline = false,
		alpha,
	},
	{ context },
) {
	if (font) context.font = font;
	if (textAlign) context.textAlign = textAlign;
	if (textBaseline) context.textBaseline = textBaseline;
	if (direction) context.direction = direction;
	if (alpha) context.globalAlpha = alpha;
	if (outline) {
		context.strokeText(text, x, y, maxWidth);
	} else {
		context.fillText(text, x, y, maxWidth);
	}
}

// TODO Draw line components
// TODO Gradient and pattern components
// TODO Paths/path drawing components

// For smoothQuality, see: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
// Also mind that quality does not work on firefox :(
export function Picture(props, { context }) {
	const {
		image,
		x = 0,
		y = 0,
		width = image.width,
		height = image.height,
		smoothQuality,
		smooth = !!smoothQuality,
		mirrorX,
		mirrorY,
	} = props;
	if (mirrorX || mirrorY) {
		const translate = new Vector2(mirrorX ? x + width : x, mirrorY ? y + height : y);
		const scale = new Vector2((!mirrorX) * 2 - 1, (!mirrorY) * 2 - 1);
		return (
			<Transform translate={translate} scale={scale}>
				<Picture {...{ ...props, mirrorX: false, mirrorY: false }} />
			</Transform>
		);
	}
	if (smooth) context.imageSmoothingEnabled = smooth;
	if (smoothQuality) context.imageSmoothingQuality = smoothQuality;
	context.drawImage(image, x, y, width, height);
}

// TODO Pixel manipulation components

export function Filter({ value, children }, { context }) {
	context.filter = value;
	return children;
}
