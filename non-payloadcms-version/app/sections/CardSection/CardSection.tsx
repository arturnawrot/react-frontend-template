import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "../../../.react-router/types/non-payloadcms-version/app/sections/CardSection/CardSection.module.scss";

export interface CardItem {
    title: string;
    icon: string;
    description: string;
}

interface CardSectionProps {
    cards: CardItem[];
    title?: string;
    description?: string;
    buttonText?: string;
}

export default function CardSection({ 
    cards, 
    title = "Relationships Built for the Long Game",
    description = "In every transaction and relationship we hold true to our guiding principles.",
    buttonText = "What Makes Us Different"
}: CardSectionProps) {
    return (
        <>
            <div>
                <div className="max-w-[1380px] mx-auto px-4"> {/* No background here */}
                    <div className="bg-white rounded-4xl border border-gray-200 shadow-xl shadow-black/20 py-20 px-15"> {/* Background only here */}
                        <div className="text-center">
                            <h2 className="display2">
                                {title}
                            </h2>
                            <p className="description my-10">
                                {description}
                            </p>
                        </div>


                        <div className="flex flex-wrap justify-center gap-12">
                            {cards.map((card, index) => (
                                <div key={index} className="text-center w-full md:w-[30%] md:max-w-[400px]">
                                    <FontAwesomeIcon icon={card.icon} className={`${styles.cardColumnIcon}`} />
                                    <h3 className={`${styles.cardColumnTitle} mt-5`}>{card.title}</h3>
                                    <p className={`${styles.cardColumnDescription} mt-5`}>{card.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-15">
                            <a className="sale-button">{buttonText}</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}