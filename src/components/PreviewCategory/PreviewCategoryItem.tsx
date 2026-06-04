import React from 'react';
import {Link} from '../Link';
import {convertToKebabCase, generateRandomHSL} from '../../utils/utils';

interface PreviewCategoryItemProps {
    name: string;
    categoryName: string;
    color?: string;
    index: number;
    originalName: string;
}
const PreviewCategoryItem = ({name, originalName, categoryName, color, index}: PreviewCategoryItemProps) => {
    return (
        <Link
            className="gmt-category__item"
            style={{ '--category-item-color': color === undefined ? generateRandomHSL((index * 5)) : color } as React.CSSProperties}
            to={`/${convertToKebabCase(categoryName)}/${convertToKebabCase(name)}`}
        >
            <span className="gmt-category__item-differentiator" />
            <span className="gmt-category__item-text">
                {originalName}
            </span>
        </Link>
    )
}

export {PreviewCategoryItem};