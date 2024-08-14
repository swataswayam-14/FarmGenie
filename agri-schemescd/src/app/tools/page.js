import './tools.css';

export default function Tools() {
    return (
        <div className="tools-container">
            <h2 className="tools-title">Useful Tools for Farmers</h2>
            <div className="tool-items">
                <div className="tool-item">
                    <div className="tool-image" ></div>
                    <div className="tool-info soil">
                        <h3>Soil Testing</h3>
                        <p>Get accurate soil analysis to optimize crop production.</p>
                        <a href="/soil-testing" className="tool-link">Learn More</a>
                    </div>
                </div>

                <div className="tool-item">
                    <div className="tool-image" style={{ backgroundImage: "url('/images/tool2.jpg')" }}></div>
                    <div className="tool-info">
                        <h3>Weather Forecast</h3>
                        <p>Stay ahead with precise weather forecasts for your farm.</p>
                        <a href="/weather-forecast" className="tool-link">Check Now</a>
                    </div>
                </div>

                <div className="tool-item">
                    <div className="tool-image" style={{ backgroundImage: "url('/images/tool3.jpg')" }}></div>
                    <div className="tool-info">
                        <h3>Crop Planner</h3>
                        <p>Plan your crop cycle effectively to maximize yield.</p>
                        <a href="/crop-planner" className="tool-link">Get Started</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
