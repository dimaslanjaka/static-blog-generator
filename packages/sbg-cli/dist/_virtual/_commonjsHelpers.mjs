// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export { getDefaultExportFromCjs };
