declare module 'tinyurl' {
    export function shorten(url: string): Promise<string>;
}