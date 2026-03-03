import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  type?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SEOHead = ({ title, description, canonical, type = 'website', jsonLd, noindex }: SEOHeadProps) => {
  const fullUrl = `https://niches.lovable.app${canonical}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {jsonLd && (
        Array.isArray(jsonLd) 
          ? jsonLd.map((ld, i) => (
              <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
            ))
          : <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
