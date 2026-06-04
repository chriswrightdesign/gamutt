import React from 'react';
import { Header } from '../components/Header';
import { PreviewCategory, PreviewCategoryItem } from '../components/PreviewCategory';
import {DecoratedExample} from '../PreviewApp.types';

interface LandingPageProps {
    categoryNames: string[];
    categoryDictionary: {
        [key: string]: DecoratedExample[];
    };
    /** Brand mark forwarded to the header; defaults to the gamutt logo. */
    logo?: React.ReactNode;
}

const LandingPage = ({ categoryNames = [], categoryDictionary = {}, logo }: LandingPageProps) => {
    return (
        <div>
            <Header Logo={logo} />
            <h1 className="gmt-visuallyhidden">Component previews</h1>
            {categoryNames.map((categoryName) => {
                return (
                    <PreviewCategory title={categoryDictionary[categoryName][0].originalCategory} key={categoryName}>
                        {categoryDictionary[categoryName].map(({ name, color, originalName }, index) => {
                            return (
                                <PreviewCategoryItem categoryName={categoryName} color={color} key={name} index={index} originalName={originalName} name={name} />
                            );
                        })}
                    </PreviewCategory>
                )
            })}
        </div>
    );
}


export { LandingPage };
