import React from 'react';
import {classMap} from '../../utils/classMap';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import './SyntaxHighlighter.css';

interface SyntaxHighlighterProps {
    codeString?: string;
    language?: 'css' | 'html' | 'js';
    maxHeight?: string;
}

const SyntaxHighlighter = ({codeString = '', language = 'css', maxHeight = '300px'}: SyntaxHighlighterProps) => {
    const lang = language === undefined || language === 'js' ? 'jsx' : language;

    const prismHTML = {
        __html: Prism.highlight(codeString, Prism.languages[lang], language),
    };

    return (
        <div className="gmt-syntax-highlighter">
            <pre
                className={classMap({
                    'gmt-syntax-highlighter__inner': true,
                    [`language-${language}`]: Boolean(language),
                })}
                style={{maxHeight: `${maxHeight}`}}>
                <code
                    className={classMap({
                        'gmt-syntax-highlighter__code': true,
                        [`language-${language}`]: true,
                    })}
                    dangerouslySetInnerHTML={prismHTML}
                />
            </pre>
        </div>
    );
};

export {SyntaxHighlighter};
