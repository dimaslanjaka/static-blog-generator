import { DefaultTheme } from 'typedoc';
import { Renderer } from 'typedoc/dist/lib/output/renderer';
import { OverrideThemeContext } from './OverrideThemeContext';
export declare class OverrideTheme extends DefaultTheme {
    private _contextCache?;
    constructor(renderer: Renderer);
    /**
     * Переопределяет стандартный контекст.
     */
    getRenderContext(): OverrideThemeContext;
}
