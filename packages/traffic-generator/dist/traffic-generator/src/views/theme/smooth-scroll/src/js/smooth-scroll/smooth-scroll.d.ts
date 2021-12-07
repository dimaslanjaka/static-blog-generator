declare function _exports(selector: any, options: any): {
    /**
     * Cancel a scroll-in-progress
     */
    cancelScroll(noEvent: any): void;
    /**
     * Start/stop the scrolling animation
     * @param {Node|Number} anchor  The element or position to scroll to
     * @param {Element}     toggle  The element that toggled the scroll event
     * @param {Object}      options
     */
    animateScroll(anchor: Node | number, toggle: Element, options: any): void;
    /**
     * Destroy the current initialization.
     */
    destroy(): void;
};
export = _exports;
//# sourceMappingURL=smooth-scroll.d.ts.map