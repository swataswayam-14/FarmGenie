import './rightBar.css';

export default function RightBar() {
    return (
        <div className="rightBar">
            <h2 className="heading">New Schemes</h2>

            <div className="box">
                <h3>Pradhan Mantri Kisan Maandhan Yojana</h3>
                <p>This scheme offers a monthly pension of INR 3000 to small and marginal farmers aged 60 and above. It aims to provide financial security to senior farmers. The scheme is available to farmers aged 18-40 with land up to 2 hectares.</p>
            </div>

            <div className="box">
                <h3>PM-Kisan Scheme</h3>
                <p>Under the Pradhan Mantri Kisan Samman Nidhi Yojana, eligible farmers receive up to INR 6000 per year as income support. This initiative is targeted at farmers with less than two hectares of land, aiming to boost their income and support agricultural activities.</p>
            </div>

            <div className="box">
                <h3>Pradhan Mantri Fasal Bima Yojana</h3>
                <p>This insurance scheme provides financial protection against crop losses. Farmers pay a small premium and are covered for various crop risks, including drought and floods. It supports farmers engaged in Rabi, Kharif, and horticultural crops.</p>
            </div>

            <div className="box">
                <h3>Pradhan Mantri Krishi Sinchai Yojana (PMKSY)</h3>
                <p>Launched with the goal of "Har Khet Ko Pani," this scheme focuses on enhancing irrigation facilities. It provides support for creating new irrigation infrastructure and improving existing ones to ensure water availability for crops.</p>
            </div>

            <div className="box">
                <h3>Gramin Bhandaran Yojana</h3>
                <p>The scheme aims to improve storage facilities for agricultural produce. It provides financial assistance for building and upgrading storage infrastructure, which helps reduce post-harvest losses and ensures better price realization for farmers.</p>
            </div>

            {/* Additional Cards */}
            <div className="box">
                <h3>Rural Infrastructure Development Fund (RIDF)</h3>
                <p>This scheme focuses on improving rural infrastructure, including roads, bridges, and market facilities. It provides financial assistance to state governments for developing infrastructure that supports agricultural and rural development.</p>
            </div>

            <div className="box">
                <h3>National Agriculture Market (eNAM)</h3>
                <p>The eNAM platform aims to create a unified national market for agricultural commodities. It provides farmers with better price realization through online trading and reduces market inefficiencies by integrating various state markets.</p>
            </div>

            <div className="box">
                <h3>Paramparagat Krishi Vikas Yojana (PKVY)</h3>
                <p>This scheme promotes organic farming by providing financial support to farmers for adopting organic farming practices. It aims to enhance soil health and produce high-quality crops through sustainable practices.</p>
            </div>

            <div className="box">
                <h3>Soil Health Management Scheme</h3>
                <p>The Soil Health Management Scheme focuses on improving soil health through various measures, including soil testing, nutrient management, and organic farming practices. It aims to boost soil fertility and agricultural productivity.</p>
            </div>

            <div className="box">
                <h3>Integrated Scheme for Agricultural Cooperation (ISAC)</h3>
                <p>ISAC provides financial assistance to agricultural cooperatives for improving their infrastructure and operations. The scheme supports cooperatives in enhancing their capabilities to serve farmers more effectively.</p>
            </div>

            <div className="box">
                <h3>National Mission for Sustainable Agriculture (NMSA)</h3>
                <p>The NMSA aims to promote sustainable agricultural practices and ensure long-term food security. It provides support for adopting climate-resilient practices, improving soil health, and enhancing agricultural productivity.</p>
            </div>
        </div>
    );
}
