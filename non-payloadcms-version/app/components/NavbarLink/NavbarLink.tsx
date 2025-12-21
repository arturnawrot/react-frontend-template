import styles from '../../../.react-router/types/non-payloadcms-version/app/components/NavbarLink/NavbarLink.module.scss';

export function NavbarLink({ href = "#", children, className = "", isExternal = false }) {
    const externalProps = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a
        href={href}
        className={`text-white hover:text-opacity-80 transition ${className}`}
        {...externalProps}
      >
        {children}
      </a>
    );
}

export function MainNavbarLink({ href, children }) {
    return (
        <NavbarLink href={href} className={styles.mainNavbarLink}>
            {children}
        </NavbarLink>
    );
}

export function UpperNavbarLink({ href, children }) {
    return (
        <NavbarLink href={href} className={styles.upperNavbarLink}>
            {children}
        </NavbarLink>
    );
}

export function CollapsingMenuMobileLink({ href, children }) {
    return (
        <NavbarLink href={href} className={`${styles.mainNavbarLink} text-left w-full hover:text-opacity-80 transition px-8`}>
            {children}
        </NavbarLink>
    );
}

export const MAIN_LINKS = [
    { label: "Buy", href: "/buy" },
    { label: "Lease", href: "/lease" },
    { label: "Sell", href: "/sell" },
    { label: "Our Agents", href: "/agents" },
    { label: "Our Advantages", href: "/advantages" },
    { label: "Our Services", href: "/services" },
    { label: "Insights & Research", href: "/insights" },
];

export const UPPER_LINKS = [
    { label: "Schedule", href: "/schedule" },
    { label: "Contact Us", href: "/contact" },
    { label: "Login", href: "/login" },
];

export const ALL_LINKS = [...MAIN_LINKS, ...UPPER_LINKS];