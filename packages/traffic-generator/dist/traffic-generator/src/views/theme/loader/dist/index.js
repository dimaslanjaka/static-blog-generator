/* eslint-disable no-empty */
/* eslint-disable no-undef */
(function () {
    var ldloader;
    ldloader = function (opt) {
        var self = this;
        opt == null && (opt = {});
        this.opt = import$({
            activeClass: "running",
            baseZ: 4000,
            autoZ: false,
            className: "",
            atomic: true
        }, opt);
        this._toggler =
            typeof opt.toggler === "function" ? opt.toggler : function () { };
        if (opt.zmgr) {
            this.zmgr(opt.zmgr);
        }
        ["root", "container"].map(function (n) {
            var list;
            if (opt[n]) {
                list = Array.isArray(opt[n])
                    ? opt[n]
                    : opt[n] instanceof NodeList
                        ? Array.from(opt[n])
                        : [opt[n]];
                return (self[n] = list.map(function (it) {
                    var ret;
                    ret = typeof it === "string" ? document.querySelector(it) : it;
                    if (!ret) {
                        console.warn("[ldloader] warning: no node found for " + it);
                    }
                    return ret;
                }));
            }
        });
        if (!this.container) {
            this.container = this.root
                ? this.root.map(function (it) {
                    return it.parentNode;
                })
                : [document.body];
        }
        if (!this.root) {
            this.root = this.container.map(function (it) {
                var node;
                node = document.createElement("div");
                it.appendChild(node);
                return node;
            });
        }
        this.root.map(function (it) {
            it.classList.add.apply(it.classList, (self.opt.className || "").split(" ").filter(function (it) {
                return it;
            }));
            it.classList.remove(opt.activeClass);
            if (opt.inactiveClass) {
                return it.classList.add(opt.inactiveClass);
            }
        });
        this.running = false;
        this.count = 0;
        return this;
    };
    ldloader.prototype = import$(Object.create(Object.prototype), {
        zmgr: function (it) {
            if (it != null) {
                return (this._zmgr = it);
            }
            else {
                return this._zmgr;
            }
        },
        isOn: function () {
            return this.running;
        },
        on: function (delay) {
            delay == null && (delay = 0);
            return this.toggle(true, delay);
        },
        off: function (delay, force) {
            delay == null && (delay = 0);
            force == null && (force = false);
            return this.toggle(false, delay, force);
        },
        cancel: function (v) {
            clearTimeout(this.handle);
            if (v != null) {
                return this.toggle(v);
            }
        },
        flash: function (dur, delay) {
            var self = this;
            dur == null && (dur = 1000);
            delay == null && (delay = 0);
            return this.toggle(true, delay).then(function () {
                return self.toggle(false, dur + delay);
            });
        },
        render: function () {
            var runid, _, ret, self = this;
            if (!(this.running && this.opt.ctrl && this.opt.ctrl.step)) {
                return (this.render.runid = -1);
            }
            this.render.runid = runid = Math.random();
            this.render.start = 0;
            if (this.opt.ctrl.init) {
                this.root.map(function (it) {
                    return self.opt.ctrl.init.call(it);
                });
            }
            _ = function (t) {
                if (!self.render.start) {
                    self.render.start = t;
                }
                self.root.map(function (it) {
                    return self.opt.ctrl.step.call(it, t - self.render.start);
                });
                if (self.render.runid === runid) {
                    return requestAnimationFrame(function (it) {
                        return _(it);
                    });
                }
                else if (self.opt.ctrl.done) {
                    return self.root.map(function (it) {
                        return self.opt.ctrl.done.call(it, t - self.render.start);
                    });
                }
            };
            return (ret = requestAnimationFrame(function (it) {
                return _(it);
            }));
        },
        toggle: function (v, delay, force) {
            var d, ret, self = this;
            delay == null && (delay = 0);
            force == null && (force = false);
            d = !(v != null)
                ? this.root[0].classList.contains(this.opt.activeClass)
                    ? -1
                    : 1
                : v
                    ? 1
                    : -1;
            if (this.handle) {
                this.cancel();
            }
            if (delay) {
                return new Promise(function (res, rej) {
                    return (self.handle = setTimeout(function () {
                        return self.toggle(v).then(function () {
                            return res();
                        });
                    }, delay));
                });
            }
            ret = new Promise(function (res, rej) {
                var ref$, running, zmgr;
                self.count = (ref$ = self.count + d) > 0 ? ref$ : 0;
                if (!force &&
                    !self.opt.atomic &&
                    (self.count >= 2 || (self.count === 1 && d < 0))) {
                    return res();
                }
                self.root.map(function (it) {
                    it.classList.toggle(self.opt.activeClass, d > 0);
                    if (self.opt.inactiveClass) {
                        return it.classList.toggle(self.opt.inactiveClass, d < 0);
                    }
                });
                self.running = running = self.root[0].classList.contains(self.opt.activeClass);
                if (self.opt.ctrl) {
                    self.render();
                }
                if (!self.opt.autoZ) {
                    return res();
                }
                zmgr = self._zmgr || ldloader._zmgr;
                if (running) {
                    self.z = zmgr.add(self.opt.baseZ);
                    self.root.map(function (it) {
                        return (it.style.zIndex = self.z);
                    });
                }
                else {
                    zmgr.remove(self.z);
                    self.root.map(function (it) {
                        return (it.style.zIndex = "");
                    });
                }
                return res();
            });
            return ret.then(function () {
                return self._toggler(d > 0 ? true : false);
            });
        }
    });
    import$(ldloader, {
        _zmgr: {
            add: function (v) {
                var z, ref$;
                (this.s || (this.s = [])).push((z = Math.max(v || 0, ((ref$ = this.s)[ref$.length - 1] || 0) + 1)));
                return z;
            },
            remove: function (v) {
                var i;
                if ((i = (this.s || (this.s = [])).indexOf(v)) < 0) {
                }
                else {
                    return this.s.splice(i, 1);
                }
            }
        },
        zmgr: function (it) {
            if (it != null) {
                return (this._zmgr = it);
            }
            else {
                return this._zmgr;
            }
        }
    });
    if (typeof module != "undefined" && module !== null) {
        module.exports = ldloader;
    }
    else {
        window.ldloader = ldloader;
    }
    function import$(obj, src) {
        var own = {}.hasOwnProperty;
        for (var key in src)
            if (own.call(src, key))
                obj[key] = src[key];
        return obj;
    }
}.call(this));
//# sourceMappingURL=index.js.map