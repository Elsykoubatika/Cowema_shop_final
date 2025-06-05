
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type: 'breadcrumb' | 'organization' | 'website' | 'product' | 'faq';
  data: any;
}

export const BreadcrumbStructuredData: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  );
};

export const OrganizationStructuredData: React.FC = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cowema",
    "url": "https://cowema.com",
    "logo": "https://lovable.dev/opengraph-image-p98pqg.png",
    "description": "La marketplace africaine pour des achats en ligne sécurisés",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CG",
      "addressRegion": "Brazzaville",
      "addressLocality": "Brazzaville"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+242-XX-XXX-XXXX",
      "contactType": "customer service",
      "availableLanguage": "French"
    },
    "sameAs": [
      "https://facebook.com/cowema",
      "https://instagram.com/cowema",
      "https://twitter.com/cowema"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
};

export const WebsiteStructuredData: React.FC = () => {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cowema",
    "url": "https://cowema.com",
    "description": "La marketplace africaine pour des achats en ligne sécurisés",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cowema.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
    </Helmet>
  );
};

export const FAQStructuredData: React.FC<{ faqs: Array<{ question: string; answer: string }> }> = ({ faqs }) => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
};

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
