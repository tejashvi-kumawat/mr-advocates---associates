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
      title = 'Best Advocates in Jaipur | Best Lawyers in India | M.R. Advocates & Associates',
      description = 'Best advocate firm in Jaipur, Rajasthan. Top lawyers in India for civil, criminal, corporate, family, property, and revenue cases. Expert legal services with 25+ years experience.',
      keywords = 'best advocate in jaipur, best advocates in india, best advocates in rajasthan, advocate firm, lawyer firm, best lawyers, best lawyers in jaipur, best lawyers in india, best lawyers in rajasthan, civil case expert, revenue case expert, criminal case expert, property case expert, corporate case expert, family case expert, top advocate firm jaipur, leading lawyer firm rajasthan, expert advocates jaipur, best law firm india',
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

