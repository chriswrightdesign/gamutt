declare module "*.css";

declare module "prismjs" {
    const Prism: {
        highlight: (text: string, grammar: object, language?: string) => string;
        languages: Record<string, object>;
    };
    export default Prism;
}

declare module "prismjs/components/prism-jsx";
