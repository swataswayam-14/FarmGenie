import './faqs.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArticleIcon from '@mui/icons-material/Article';

const FAQs = () => {
    return (
        <section className="faqs">
            <div className="faqs-content">
                <h1>FREQUENTLY ASKED QUESTIONS</h1>
                
                <div className="faqs-box">
                    <p className="question">What are the best crops to grow in my region?</p>
                    <p className="answer">The best crops to grow depend on your region's climate, soil type, and water availability. In general, you should choose crops that are well-suited to your local conditions. For example, in warmer climates, you might consider growing corn, tomatoes, or peppers, while cooler regions might be better suited for crops like potatoes, carrots, and leafy greens.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/tKbHqxI7VFA?feature=shared" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article1" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">How can I improve soil fertility naturally?</p>
                    <p className="answer">You can improve soil fertility by using organic methods such as composting, green manures, and crop rotation. Adding compost and well-rotted manure to your soil improves its structure, provides essential nutrients, and encourages beneficial microorganisms. Crop rotation helps to prevent soil depletion and reduces the risk of pests and diseases.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/AgrE4RItm1U?feature=shared" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article2" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">What financial assistance is available for small farmers?</p>
                    <p className="answer">There are various government schemes and subsidies available to small farmers. These include subsidies for seeds, fertilizers, and machinery, as well as low-interest loans and grants for starting or expanding farm operations. Check with your local agricultural office for specific programs available in your area.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/financialaid" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article3" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">How do I get started with organic farming?</p>
                    <p className="answer">To start organic farming, you need to understand organic practices, which avoid synthetic chemicals and GMOs. Begin by improving soil health with compost and organic matter, select organic seeds, and implement natural pest control methods. Certification may be required depending on your market, so check the requirements in your region.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/organicfarming" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article4" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">What are the benefits of crop diversification?</p>
                    <p className="answer">Crop diversification involves growing a variety of crops, which can reduce risk, improve soil health, and increase farm income. Diversifying helps to prevent pests and diseases from spreading and can also provide a more stable income by reducing reliance on a single crop.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/cropdiversification" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article5" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">What is precision farming and how can it benefit me?</p>
                    <p className="answer">Precision farming uses technology to optimize field-level management regarding crop farming. It involves using GPS, IoT, and data analytics to monitor and manage soil and crop health. This method can increase efficiency, reduce waste, and improve crop yields.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/precisionfarming" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article6" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">What steps can I take to conserve water on my farm?</p>
                    <p className="answer">Water conservation is crucial, especially in regions with limited rainfall. Techniques such as drip irrigation, rainwater harvesting, mulching, and selecting drought-resistant crops can help conserve water. These methods reduce water usage and improve the efficiency of water delivery to crops.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/waterconservation" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article7" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">How can I protect my crops from pests without using chemicals?</p>
                    <p className="answer">You can use integrated pest management (IPM) techniques, such as introducing natural predators, using traps, and planting pest-resistant varieties. Regular crop rotation and maintaining crop diversity can also help manage pests without relying on chemicals.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/pestmanagement" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article8" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">What is the process for obtaining agricultural insurance?</p>
                    <p className="answer">Agricultural insurance provides coverage against crop loss due to natural disasters, pests, and diseases. The process involves choosing a suitable insurance plan, registering with the insurer, and paying the premium. In case of crop damage, you can file a claim and receive compensation according to the policy terms.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/agriinsurance" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article9" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

                <div className="faqs-box">
                    <p className="question">How can I access government schemes and subsidies for farmers?</p>
                    <p className="answer">You can access government schemes and subsidies through your local agricultural office or online portals. These schemes cover various aspects such as seeds, fertilizers, equipment, and financial aid. Make sure to stay updated on eligibility criteria and application deadlines to benefit from these programs.</p>
                    <div className="faqs-icons">
                        <a href="https://youtu.be/govschemes" className="youtube-link" target="_blank" rel="noopener noreferrer">
                            <YouTubeIcon /> &nbsp;
                        </a>
                        <a href="https://example.com/article10" className="article-link" target="_blank" rel="noopener noreferrer">
                            <ArticleIcon /> &nbsp;
                        </a>
                    </div>
                </div>

            </div>
            
        </section>
    );
};

export default FAQs;












