import path from 'node:path';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default {
	server: {
		port: 8080,
	},
	resolve: {
		alias: {
			'~': path.resolve(fileURLToPath(path.dirname(import.meta.url)), 'src'),
		},
	},
};
