import { Helmet } from 'react-helmet-async';
import { buildSiteUrl } from '@/lib/site';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  type?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SEOHead = ({
  title,
  description,
  canonical,
  type = 'website',
  jsonLd,
  noindex,
}: SEOHeadProps) => {
  const fullUrl = buildSiteUrl(canonical);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="NichePulse AI" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {jsonLd &&
        (Array.isArray(jsonLd)
          ? jsonLd.map((ld, i) => (
              <script key={i} type="application/ld+json">
                {JSON.stringify(ld)}
              </script>
            ))
          : (
              <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
              </script>
            ))}
    </Helmet>
  );
};

export default SEOHead;
