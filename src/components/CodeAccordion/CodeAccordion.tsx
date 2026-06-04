import React, {useState} from "react";
import {classMap} from "../../utils/classMap";
import {ChevronIcon} from "./ChevronIcon";
import {SyntaxHighlighter} from "../SyntaxHighlighter";

interface CodeAccordionProps {
    cssCode?: string;
    jsCode?: string;
    htmlCode?: string;
}

const CodeAccordion = ({cssCode, jsCode, htmlCode}: CodeAccordionProps) => {
    const [isAccordionOpen, setAccordionOpen] = useState(false);
    // Default to the first language that actually has a snippet (web-component examples are HTML-only).
    const defaultCodeType = jsCode ? "js" : cssCode ? "css" : "html";
    const [codeType, setCodeType] = useState(defaultCodeType);

    return (
        <div className="gmt-code-display">
            {isAccordionOpen ?
                <div className="gmt-code-display__snippet">
                    {codeType === "css" ? <SyntaxHighlighter codeString={cssCode} language="css" /> : null}
                    {codeType === "js" ? <SyntaxHighlighter codeString={jsCode} language="js" /> : null}
                    {codeType === "html" ? <SyntaxHighlighter codeString={htmlCode} language="html" /> : null}
                </div> 
                : null}
            
            <div className="gmt-code-display__controls">
                
                <button className={classMap({
                    "gmt-code-display__source-button": true,
                    "is-active": isAccordionOpen,
                })} type="button" onClick={() => {
                    setAccordionOpen(!isAccordionOpen);
                }}>Source code <ChevronIcon /></button>

                <div className={classMap({
                    "gmt-code-display__code-type-controls": true,
                    "is-active": isAccordionOpen,
                })}>
                    
                    {jsCode ? <div className="gmt-code-display__code-type-control">
                        <button onClick={() => {
                            setCodeType("js");
                        }} className={classMap({
                            "gmt-code-display__code-type-button": true,
                            "gmt-code-display__code-type-button--js": true,
                            "is-active": codeType === "js"
                        })}>JS</button>
                    </div> : null}
                    {cssCode ?
                        <div className="gmt-code-display__code-type-control">
                            <button onClick={() => {
                                setCodeType("css");
                            }} className={classMap({
                                "gmt-code-display__code-type-button": true,
                                "gmt-code-display__code-type-button--css": true,
                                "is-active": codeType === "css",
                            })}>CSS</button>
                        </div> : null}
                    {htmlCode ? 
                        <div className="gmt-code-display__code-type-control">
                            <button onClick={() => {
                                setCodeType("html");
                            }} className={classMap({
                                "gmt-code-display__code-type-button": true,
                                "gmt-code-display__code-type-button--html": true,
                                "is-active": codeType === "html"
                            })}>HTML</button></div> : null}
                </div>
            </div>
            
            
        </div>
    );
};

export {CodeAccordion};