import React from 'react';
import styles from '../../../.react-router/types/non-payloadcms-version/app/components/NavbarLink/NavbarLink.module.scss';

interface NavbarLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  isExternal?: boolean;
}

export function NavbarLink({ href = "#", children, className = "", isExternal = false }: NavbarLinkProps) {
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

interface MainNavbarLinkProps {
  href: string;
  children: React.ReactNode;
}

export function MainNavbarLink({ href, children }: MainNavbarLinkProps) {
    return (
        <NavbarLink href={href} className={styles.mainNavbarLink}>
            {children}
        </NavbarLink>
    );
}

interface UpperNavbarLinkProps {
  href: string;
  children: React.ReactNode;
}

export function UpperNavbarLink({ href, children }: UpperNavbarLinkProps) {
    return (
        <NavbarLink href={href} className={styles.upperNavbarLink}>
            {children}
        </NavbarLink>
    );
}

interface CollapsingMenuMobileLinkProps {
  href: string;
  children: React.ReactNode;
}

export function CollapsingMenuMobileLink({ href, children }: CollapsingMenuMobileLinkProps) {
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