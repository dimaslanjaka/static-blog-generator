/// <reference types="node" />
import EventEmitter from 'events';
interface createConfigEvents {
    add: (obj: Record<string, any>) => void;
    delete: (changedCount: number) => void;
    update: () => void;
}
export declare interface createConfig<T extends Record<string, any>> {
    on<U extends keyof createConfigEvents>(event: U, listener: createConfigEvents[U]): this;
    emit<U extends keyof createConfigEvents>(event: U, ...args: Parameters<createConfigEvents[U]>): boolean;
    get<U extends Record<string, any>>(): T & U;
}
/**
 * Create/Update config wrapper
 * @param name
 * @param value
 * @returns
 */
export declare class createConfig<T extends Record<string, any>> extends EventEmitter {
    cname: string;
    constructor(name: string, value: Record<string, any>);
    update(value: Record<string, any>): void;
}
export {};
