"use client";
import './leftBar.css';
import Link from 'next/link'; // Import Link from next/link
import Scheme1 from '../scheme/scheme1';

export default function LeftBar() {
    return (
        <div className="leftBar">
            <Link href="./scheme/scheme1" className="scheme">Pradhan Mantri Fasal Bima Yojana</Link>
            <Link href="/scheme2" className="scheme">Kisan Credit Card Scheme</Link>
            <Link href="/scheme3" className="scheme">National Mission for Sustainable Agriculture</Link>
            <Link href="/scheme4" className="scheme">Soil Health Management Scheme</Link>
            <Link href="/scheme5" className="scheme">Rural Infrastructure Development Fund</Link>
            <Link href="/scheme6" className="scheme">Integrated Scheme for Agricultural Cooperation</Link>
            <Link href="/scheme7" className="scheme">Paramparagat Krishi Vikas Yojana</Link>
            <Link href="/scheme8" className="scheme">Horticulture Mission for North East and Himalayan States</Link>
            <Link href="/scheme9" className="scheme">Mid-Day Meal Scheme for Schools</Link>
            <Link href="/scheme10" className="scheme">National Dairy Plan</Link>
            <Link href="/scheme11" className="scheme">National Agricultural Market (eNAM)</Link>

        </div>
    );
}

