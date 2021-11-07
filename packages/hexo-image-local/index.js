/*global hexo*/

hexo.extend.filter.register("after_generate", require("./lib/optimizeImage"));
