export function addScrollingClass(i: any, x: any): void;
export function removeScrollingClass(i: any, x: any): void;
export function setScrollingClassInstantly(i: any, x: any): void;
export default cls;
declare namespace cls {
    const main: string;
    const rtl: string;
    namespace element {
        function thumb(x: any): string;
        function rail(x: any): string;
        const consuming: string;
    }
    namespace state {
        const focus: string;
        const clicking: string;
        function active(x: any): string;
        function scrolling(x: any): string;
    }
}
//# sourceMappingURL=class-names.d.ts.map