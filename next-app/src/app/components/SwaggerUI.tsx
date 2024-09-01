"use client"
import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerComponent: React.FC = () => {
  const [spec, setSpec] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpec() {
      try {
        const response = await fetch('/api/openapi');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        setSpec(data);
      } catch (error) {
        console.error('Failed to fetch OpenAPI spec:', error);
      }
    }

    fetchSpec();
  }, []);

  return spec ? <SwaggerUI spec={spec} /> : <div>Loading...</div>;
};

export default SwaggerComponent;
