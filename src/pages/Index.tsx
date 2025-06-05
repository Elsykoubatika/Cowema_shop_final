
import React from 'react';
import { useIndexPageHooks } from '../components/index/IndexPageHooks';
import IndexPageLayout from '../components/index/IndexPageLayout';
import IndexPageContent from '../components/index/IndexPageContent';

const Index = () => {
  const pageHooks = useIndexPageHooks();

  // Extract city from user location or other source if available
  // For now, we'll pass undefined and let the banner component handle it
  const city = undefined; // This could be enhanced to get actual city data

  return (
    <IndexPageLayout city={city}>
      <IndexPageContent pageData={pageHooks} />
    </IndexPageLayout>
  );
};

export default Index;
