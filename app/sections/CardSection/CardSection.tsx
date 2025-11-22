import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "./CardSection.module.scss";

export default function CardSection() {
    return (
        <>
            <div>
                <div className="max-w-[1380px] mx-auto px-4"> {/* No background here */}
                    <div className="bg-white rounded-4xl border border-gray-200 shadow-xl shadow-black/20 py-20 px-15"> {/* Background only here */}
                        <div class="text-center">
                            <h2 class="display2">
                                Relationships Built for the Long Game
                            </h2>
                            <p class="description my-10">
                                In every transaction and relationship we hold true to our guiding principles.
                            </p>
                        </div>


                        <div class="grid md:grid-cols-3 gap-12">
                            <div>
                                <FontAwesomeIcon icon="fa-regular fa-handshake" className={`${styles.cardColumnIcon}`} />
                                <h3 className={`${styles.cardColumnTitle} mt-5`}>Partnership</h3>
                                <p className={`${styles.cardColumnDescription} mt-5`}>We build lasting relationships, offering fiduciary-level care and strategic guidance beyond the deal.</p>
                            </div>

                            <div>
                                <FontAwesomeIcon icon="fa-regular fa-handshake" className={`${styles.cardColumnIcon}`} />
                                <h3 className={`${styles.cardColumnTitle} mt-5`}>Performance</h3>
                                <p className={`${styles.cardColumnDescription} mt-5`}>Our data-driven insights and disciplined approach deliver high-value, measurable results we’re proud to stand behind.</p>
                            </div>

                            <div>
                                <FontAwesomeIcon icon="fa-regular fa-handshake" className={`${styles.cardColumnIcon}`} />
                                <h3 className={`${styles.cardColumnTitle} mt-5`}>Perspective</h3>
                                <p className={`${styles.cardColumnDescription} mt-5`}>We take a holistic approach, ensuring real estate decisions align with broader wealth strategies and your highest priority values.</p>
                            </div>
                        </div>

                        <div class="text-center mt-15">
                            <a class="sale-button">What Makes Us Different</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}