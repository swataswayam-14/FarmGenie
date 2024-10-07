"use client";
import './about.css';  // Importing CSS for About section

export default function About() {
    return (
        <div className="about-section-container">
            <h1 className="about-section-h1">About Our Website</h1>
            
            <h2 className="about-section-h2">What We Do</h2>
            <ul className="about-section-ul">
                <li className="about-section-li">
                    <strong>Helping Farmers Grow:</strong> 
                    We aim to be a bridge between the government and farmers by providing essential information on various schemes. Whether it's access to affordable seeds, fertilizers, or support for modern equipment, these schemes can significantly boost agricultural productivity. Our platform ensures that farmers can make informed decisions, understand which subsidies are most applicable, and take steps towards growing their farming business. 
                </li>
                <li className="about-section-li">
                    <strong>Easy to Use:</strong> 
                    We've designed our website with simplicity in mind. Farmers can easily find what they need, whether it’s grants for new farming equipment or learning about sustainable farming practices. Every section is user-friendly, guiding you step-by-step in finding the support you need. This allows you to focus on what’s important — growing crops and improving your yields.
                </li>
                <li className="about-section-li">
                    <strong>Get the Latest Updates:</strong> 
                    With policies changing frequently, we ensure that our website is regularly updated with the latest government policies. This allows farmers to stay ahead by learning about new financial aids, loans, or training sessions to enhance farming methods.
                </li>
                <li className="about-section-li">
                    <strong>Guides and Tips:</strong> 
                    We offer more than just scheme listings. Our platform provides practical guides to help farmers utilize these programs to their full potential. From step-by-step instructions for applying for grants to tips on improving soil health, we ensure that you are equipped with the right knowledge to thrive.
                </li>
            </ul>

            <h2 className="about-section-h2">How Our Website Works</h2>
            <p className="about-section-p">
                Our website is designed specifically for farmers, providing access to various government schemes that can improve farming practices, offer financial aid, and open up new opportunities. All this vital information is presented in a way that’s easy to understand, ensuring that even those with limited tech knowledge can benefit.
            </p>
            <p className="about-section-p">
                The navigation is straightforward, and the content is written in simple terms so that anyone can find and apply for the help they need. From getting information on new seeds to applying for loans, we have everything you need to support your farming journey.
            </p>

            <h2 className="about-section-h2">Why Farmers Should Use Our Website</h2>
            <p className="about-section-p">
                The vast number of schemes available can be overwhelming for many farmers, and it’s often hard to find the right one for your needs. Our website makes things easier by collecting all of the relevant schemes in one place. You can find exactly what you're looking for, understand the eligibility requirements, and start the application process without unnecessary hassle.
            </p>
            <p className="about-section-p">
                Whether it's information on subsidies, equipment financing, or training in modern agricultural techniques, we’ve made sure that every tool you need is within easy reach. Get the most out of government schemes, save time, and maximize your farming potential with the resources we provide.
            </p>
        </div>
    );
}
