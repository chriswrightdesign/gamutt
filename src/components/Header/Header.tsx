import React from 'react';
import {Link} from '../Link';
import {GamuttLogo} from '../GamuttLogo';
import './Header.css';

interface HeaderProps {
    Logo?: React.ReactNode;
}
const Header = ({Logo}: HeaderProps) => {

    return (
        <header className="gmt-header">
            <div>
                <Link to="/" className="gmt-header__logo" aria-label="Home">
                    {Logo ? <React.Fragment>
                        {Logo}
                    </React.Fragment> : <GamuttLogo />}
                </Link>
            </div>
        </header>
    )
}

export {Header};