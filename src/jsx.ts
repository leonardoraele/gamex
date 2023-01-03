type JsxElementPropsBase = Record<string, unknown> & { children: unknown[] };
type JsxComponentReturn = JsxElement[]|JsxElement|null;

export type EngineXFunctionComponent<Props extends JsxElementPropsBase> = (props: Props) => JsxComponentReturn;

// export interface EngineXClassComponent<Props extends JsxElementPropsBase> {
// 	render(props: Props): JsxComponentReturn;
// }

export type EngineXComponent<Props extends JsxElementPropsBase> =
	EngineXFunctionComponent<Props>
	// | EngineXClassComponent<Props>;

export interface JsxElement<Props extends JsxElementPropsBase = JsxElementPropsBase> {
	type: EngineXComponent<Props>;
	props: Props;
}

export const h: {
	<Props extends JsxElementPropsBase>(
		type: EngineXComponent<Props>,
		// TODO Can also be null if there are no props other than children; or undefined if there are no props nor
		// children
		attrs: Exclude<Props, 'children'>,
		// attrs: {} extends Exclude<Props, 'children'> ? null|undefined : Exclude<Props, 'children'>,
		...children: Props['children']
	): JsxElement<Props>;
	fragment: EngineXFunctionComponent<{ children: JsxElement[] }>;
} = (type, attrs, ...children) => ({ type, props: { ...attrs, children } });

h.fragment = function Fragment({ children }) {
	return children;
};
