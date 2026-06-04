import React from "react";
import {DemoPage, LandingPage} from "./pages";
import {convertToKebabCase} from "./utils/utils";
import {useHashPath} from "./utils/useHashPath";
import {PageFrame} from "./components/PageFrame";
import {ExampleComponent, DecoratedExample, ExampleTarget} from "./PreviewApp.types";
import "./PreviewApp.css";
import "./dark-theme.css";
/* import css into this file so we can use demo page separately */
import "./components/Controls/Controls.css";
import "./components/CodeAccordion/CodeAccordion.css";
import "./components/PageLayout/PageLayout.css";
import "./components/PageFrame/PageFrame.css";
import "./components/ComponentStage/ComponentStage.css";


interface PreviewAppProps {
    examples: ExampleComponent[];
    /** Brand mark shown in the landing-page header; defaults to the gamutt logo. */
    logo?: React.ReactNode;
}

const categorizeExamples = (examples: ExampleComponent[]): Record<string, DecoratedExample[]> => {

    /**
     * This bit of code will grab all of the 'category' keys and assemble components by
     * that category. If there's no category they just get lumped into 'Default'
     */

    return examples.reduce<Record<string, DecoratedExample[]>>((exampleObject, example) => {
        const {name: originalName, category} = example;

        const originalCategory = category || "Default";

        const kebabCaseGroupCategory = convertToKebabCase(originalCategory);

        const categoryExists = Boolean(exampleObject[kebabCaseGroupCategory]);

        const exampleValue = categoryExists
            ? [...exampleObject[kebabCaseGroupCategory], {...example, originalName, originalCategory}]
            : [{...example, originalName, originalCategory}];

        return {
            ...exampleObject,
            [kebabCaseGroupCategory]: exampleValue,
        };
    }, {});
};

/** Resolves an example to a concrete render target, defaulting to React via the legacy `component` shorthand. */
const resolveExampleTarget = (example: ExampleComponent): ExampleTarget => {
    if (example.target) {
        return example.target;
    }

    if (example.component) {
        return {type: "react", component: example.component};
    }

    console.error("[gamutt] example has neither `target` nor `component`:", example.name);
    return {type: "react", component: () => null};
};

const PreviewApp = ({examples, logo}: PreviewAppProps): React.JSX.Element => {

    const categoryDictionary = categorizeExamples(examples);

    const categoryNames = Object.keys(categoryDictionary);

    const path = useHashPath();

    const activeExample = examples.find(
        ({name, category = "default"}) => `/${convertToKebabCase(category)}/${convertToKebabCase(name)}` === path
    );

    const renderPage = (): React.JSX.Element => {
        if (activeExample) {
            return (
                <DemoPage
                    key={path}
                    cssCodeExample={activeExample.cssCodeExample}
                    jsCodeExample={activeExample.jsCodeExample}
                    htmlCodeExample={activeExample.htmlCodeExample}
                    description={activeExample.description}
                    controlSetup={activeExample.controlSetup}
                    target={resolveExampleTarget(activeExample)}
                />
            );
        }

        // Unknown paths fall back to the landing page rather than rendering nothing.
        return (
            <LandingPage categoryDictionary={categoryDictionary} categoryNames={categoryNames} logo={logo} />
        );
    };

    return (
        <PageFrame>
            {renderPage()}
        </PageFrame>
    );
};

export {PreviewApp};
