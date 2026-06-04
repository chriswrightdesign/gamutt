import React from 'react';
import './PreviewCategory.css';

interface PreviewCategoryProps {
    children: React.ReactNode;
    title: string;
}
const PreviewCategory = ({children, title}: PreviewCategoryProps) => {
    return (
        <div className="gmt-category">
            <h2 className="gmt-category__heading">{title}</h2>
            <div className="l-gmt-example-grid">
                {children}
            </div>
        </div>
    )
}

export {PreviewCategory};