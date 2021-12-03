import proxyGrabber from "../../packages/proxy-grabber";

const grabber = new proxyGrabber();
const proxies = grabber.get();
console.log(proxies);
