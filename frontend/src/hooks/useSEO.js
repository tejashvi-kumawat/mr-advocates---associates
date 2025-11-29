import { useEffect } from 'react'

/**
 * SEO Hook for managing page meta tags
 * @param {Object} seoData - SEO configuration object
 * @param {string} seoData.title - Page title (55-65 characters)
 * @param {string} seoData.description - Meta description (140-160 characters)
 * @param {string} seoData.keywords - Comma-separated keywords
 * @param {string} seoData.canonical - Canonical URL
 * @param {string} seoData.ogImage - Open Graph image URL
 */
export function useSEO(seoData) {
  useEffect(() => {
    const {
      title = 'M.R. Advocates and Associates | Best Lawyers in Jaipur, Rajasthan',
      description = 'Premier law firm in Jaipur, Rajasthan providing expert legal services in civil law, criminal law, corporate law, family law, and more.',
      keywords = 'lawyers in Jaipur, advocates in Rajasthan, legal services Jaipur, best law firm Jaipur',
      canonical = 'https://www.mradvocates.in',
      ogImage = 'https://www.mradvocates.in/favicon.svg'
    } = seoData

    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update description
    updateMetaTag('description', description)

    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords)
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonical)

    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', ogImage, 'property')
    updateMetaTag('og:url', canonical, 'property')

    // Update Twitter Card tags
    updateMetaTag('twitter:title', title, 'name')
    updateMetaTag('twitter:description', description, 'name')
    updateMetaTag('twitter:image', ogImage, 'name')

    // Cleanup function (optional, but good practice)
    return () => {
      // You can add cleanup logic here if needed
    }
  }, [seoData])
}

