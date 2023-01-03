import type { FrameController } from '~/index';

type JsxElementPropsBase = Record<string, unknown>;
type JsxComponentReturn = JsxElement[]|JsxElement|null;
type PropsWithChildren<Props extends JsxElementPropsBase> = { children: JsxElement|JsxElement[] } & Props;

export type EngineXFunctionComponent<Props extends JsxElementPropsBase> = (
	props: PropsWithChildren<Props>,
	controller: FrameController,
) => JsxComponentReturn;

export interface EngineXClassComponent<Props extends JsxElementPropsBase> {
	update: (...params: Parameters<EngineXFunctionComponent<Props>>) => ReturnType<EngineXFunctionComponent<Props>>;
}

export type EngineXComponent<Props extends JsxElementPropsBase> =
	EngineXFunctionComponent<Props>
	| EngineXClassComponent<Props>;

export interface JsxElement<Props extends JsxElementPropsBase = JsxElementPropsBase> {
	type: EngineXComponent<Props>;
	props: Props;
}

export const h: {
	<Props extends JsxElementPropsBase>(
		type: EngineXComponent<Props>,
		props: PropsWithChildren<Props>,
	): JsxElement<Props>;
	fragment: EngineXFunctionComponent<{ children: JsxElement[] }>;
} = (type, props) => ({ type, props });

h.fragment = function Fragment({ children }) {
	return children;
};

export { h as jsx, h as jsxs };
export const Fragment = h.fragment;
