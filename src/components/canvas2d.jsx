// CanvasRenderingContext2D reference:
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#drawing_rectangles

import Vector2 from "../vector2";

export function Transform({ context }, { reset, translate, rotate, scale, matrix, children }, hooks) {
	context.save();
	if (reset) context.resetTransform();
	if (translate) context.translate(translate.x, translate.y);
	if (rotate) context.rotate(rotate);
	if (scale) context.scale(scale.x, scale.y);
	if (matrix) context.transform(...matrix);
	hooks.afterChildren(() => context.restore());
	return children;
}

/**
 * See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
 */
export function FillStyle({ context }, { style, children }, hooks) {
	context.save();
	context.fillStyle = style;
	hooks.afterChildren(() => context.restore());
	return children;
}

/**
 * For operation, see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 */
export function Alpha({ context }, { value, operation, children }, hooks) {
	context.save();
	context.globalAlpha = value;
	if (operation) context.globalCompositeOperation = operation;
	hooks.afterChildren(() => context.restore());
	return children;
}

export function Rect(
	{ context },
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
) {
	context.save();
	if (style) context.fillStyle = style;
	if (alpha) context.globalAlpha = alpha;
	context.fillRect(x, y, width, height);
	context.restore();
}

export function Border(
	{ context },
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
	hooks,
) {
	context.save();
	if (shadowColor) context.shadowColor = shadowColor;
	if (shadowBlur) context.shadowBlur = shadowBlur;
	if (lineJoin) context.lineJoin = lineJoin;
	if (lineWidth) context.lineWidth = lineWidth;
	if (style) context.strokeStyle = style;
	if (shadowOffsetX) context.shadowOffsetX = shadowOffsetX;
	if (shadowOffsetY) context.shadowOffsetY = shadowOffsetY;
	if (alpha) context.globalAlpha = alpha;
	context.strokeRect(x, y, width, height);
	hooks.afterChildren(() => context.restore());
	return children;
}

// TOOD Get text from children if `text` prop is empty.
export function Text({ context }, { text, x = 0, y = 0, maxWidth, font, textAlign, textBaseline, direction, outline = false, alpha }) {
	context.save();
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
	context.restore();
}

// TODO Draw line components
// TODO Gradient and pattern components
// TODO Paths/path drawing components

// For smoothQuality, see: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
// Also mind that quality does not work on firefox :(
export function Image({ context }, props) {
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
				<Image {...{ ...props, mirrorX: false, mirrorY: false }} />
			</Transform>
		);
	}
	context.save();
	if (smooth) context.imageSmoothingEnabled = smooth;
	if (smoothQuality) context.imageSmoothingQuality = smoothQuality;
	context.drawImage(image, x, y, width, height);
	context.restore();
}

// TODO Pixel manipulation components

export function Filter({ context }, { value, children }, hooks) {
	context.save();
	context.filter = value;
	hooks.afterChildren(() => context.restore());
	return children;
}
