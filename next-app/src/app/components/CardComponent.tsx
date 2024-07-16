import React from 'react';

interface SubjectProps {
  title: string;
  subtitle: string;
  desciption: string;
}

const CardComponent: React.FC<SubjectProps> = ({ title, subtitle, desciption }) => {
  return (
    <div className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <h4 className="text-xl text-gray-600 mb-4">{subtitle}</h4>
      <p className="text-md text-gray-600 mb-4">{desciption}</p>
    </div>
  );
};


export default CardComponent;