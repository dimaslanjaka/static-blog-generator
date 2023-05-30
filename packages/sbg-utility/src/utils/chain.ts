import ansiColors from "ansi-colors";
import stream from "stream";
import Logger from "./logger";

/**
 * Chainable function runner
 * @param schedule array of function objects
 */
export async function chain(
	schedule: {
		/**
		 * function to call inside chains
		 */
		callback: (...args: any[]) => any;
		opt?: {
			/**
			 * run before callback called
			 */
			before?: (...args: any[]) => any;
			/**
			 * run after callback called
			 */
			after?: (...args: any[]) => any;
		};
	}[]
) {
	// NodeJS.ReadWriteStream | Promise<any>

	const run = function (instance: (typeof schedule)[number]) {
		return new Promise(function (resolve) {
			const logname =
				ansiColors.blueBright("chain") + "." + ansiColors.yellowBright("run");
			if (instance.opt?.before) {
				instance.opt.before();
			}
			const obj = instance.callback.call && instance.callback.call(null);

			if (isReadableStream(obj) && obj instanceof stream.Stream) {
				// Logger.log('readable stream');
				return obj.once("end", async function () {
					if (instance.opt?.after) {
						await instance.opt.after();
						return resolve(this);
					} else {
						return resolve(this);
					}
				});
			} else if (obj instanceof stream.Writable) {
				Logger.log("writable stream");
			} else if (isPromise(obj)) {
				//Logger.log('promises');
				return obj.then(async function () {
					if (instance.opt?.after) {
						await instance.opt.after();
						return resolve(this);
					} else {
						return resolve(this);
					}
				});
			} else {
				if (typeof instance.callback !== "function") {
					Logger.log(logname, "cannot determine method instances");
				}
			}

			resolve.bind(this)(chain.bind(this));
		});
	};

	while (schedule.length > 0) {
		const instance = schedule.shift();
		if (typeof instance !== "undefined") await run(instance);
	}
}

/**
 * check object is Promises
 * @param p
 * @returns
 */
function isPromise(p: { constructor: any }) {
	return (
		(p &&
			String(Object.prototype.toString.call(p)).toLowerCase() ===
				"[object promise]") ||
		// check ES6 Promises
		(p &&
			typeof p.constructor === "function" &&
			Function.prototype.toString
				.call(p.constructor)
				.replace(/\(.*\)/, "()") ===
				Function.prototype.toString
					.call(/*native object*/ Function)
					.replace("Function", "Promise") // replacing Identifier
					.replace(/\(.*\)/, "()")) || // removing possible FormalParameterList
		// my own experiment
		(p &&
			String(Function.prototype.toString.call(p.constructor)).startsWith(
				"function Promise("
			))
	);
}

/**
 * check object is readable stream
 * @param obj
 * @returns
 */
function isReadableStream(obj: { _read: string; _readableState: string }) {
	return (
		obj instanceof stream.Stream &&
		typeof (obj._read === "function") &&
		typeof (obj._readableState === "object")
	);
}
