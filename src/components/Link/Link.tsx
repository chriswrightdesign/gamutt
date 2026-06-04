import React, {forwardRef} from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
}

/**
 * Hash navigation link. Renders an anchor to `#{to}` so a click natively updates location.hash
 * and fires `hashchange` — the signal useHashPath listens for. Replaces react-router's Link.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(({to, children, ...rest}, ref) => {
    return (
        <a {...rest} ref={ref} href={`#${to}`}>
            {children}
        </a>
    );
});

Link.displayName = "Link";

export {Link};
