export interface CTAButton {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

export interface CTAFooterProps {
    heading?: string;
    subheading?: string;
    buttons?: CTAButton[];
}

const defaultHeading = "Ready to make your next move?";
const defaultButtons: CTAButton[] = [
    { label: "Schedule a Consultation", variant: 'primary' },
    { label: "Get Matched with a Agent", variant: 'secondary' },
    { label: "Search Listings", variant: 'secondary' }
];

export default function CTAFooter(props: CTAFooterProps = {}) {
    const { 
        heading = defaultHeading, 
        subheading, 
        buttons = defaultButtons 
    } = props;
    
    const renderButton = (button: CTAButton, index: number) => {
        const isPrimary = button.variant === 'primary' || (button.variant === undefined && index === 0);
        const baseClasses = "px-8 py-3 rounded-full font-medium border border-[#1b2e28] transition outline-none";
        const primaryClasses = "bg-[#1b2e28] text-white hover:bg-opacity-90";
        const secondaryClasses = "bg-transparent text-[#1b2e28] hover:bg-[#1b2e28] hover:text-white";
        const className = `${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses}`;

        if (button.href) {
            return (
                <a 
                    key={index} 
                    href={button.href}
                    className={className}
                >
                    {button.label}
                </a>
            );
        }

        return (
            <button 
                key={index}
                className={className}
                onClick={button.onClick}
            >
                {button.label}
            </button>
        );
    };

    return ( 
        <>
            <div className="w-full font-sans antialiased">
                <section className="bg-[#dce567] py-24 px-4 flex flex-col items-center justify-center text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1b2e28] mb-10 tracking-tight">
                        {heading}
                    </h2>
                    
                    {subheading && (
                        <p className="text-xl md:text-2xl font-serif text-[#1b2e28] mb-10">
                            {subheading}
                        </p>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {buttons.map((button, index) => renderButton(button, index))}
                    </div>
                </section>
            </div>
        </>
    );
}