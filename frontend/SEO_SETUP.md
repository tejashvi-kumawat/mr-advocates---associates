# SEO Setup Guide for M.R. Advocates and Associates

## Domain Configuration
- Primary Domain: `https://www.mradvocates.in`
- Alternate Domain: `https://mradvocates.in`

## Files Created
1. **index.html** - SEO optimized with:
   - Meta tags (title, description, keywords)
   - Open Graph tags (Facebook)
   - Twitter Card tags
   - Structured Data (JSON-LD) for:
     - LegalService
     - Organization
     - LocalBusiness
     - WebSite
   - Canonical URLs
   - Geo tags for Jaipur, Rajasthan

2. **robots.txt** - Search engine crawler instructions
3. **sitemap.xml** - Site structure for search engines

## Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://www.mradvocates.in`
3. Verify ownership using one of these methods:
   - **HTML tag method**: Add the verification code to `index.html` in the meta tag section
   - **HTML file method**: Upload the verification file to `/public/` directory
   - **DNS method**: Add TXT record to your domain DNS

4. After verification, submit your sitemap:
   - Go to Sitemaps section
   - Submit: `https://www.mradvocates.in/sitemap.xml`

## Bing Webmaster Tools Setup

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site: `https://www.mradvocates.in`
3. Verify ownership:
   - **Meta tag method**: Add verification code to `index.html`
   - **XML file method**: Upload verification file to `/public/` directory
   - **DNS method**: Add CNAME record to your domain DNS

4. Submit sitemap: `https://www.mradvocates.in/sitemap.xml`

## Important Notes

### Update These in index.html:
1. **Phone Number**: Replace `+91-XXXXXXXXXX` with actual phone number
2. **Email**: Replace `info@mradvocates.in` with actual email (if different)
3. **Address**: Update street address if available
4. **Opening Hours**: Update if different from current hours
5. **Google Verification**: Add Google Search Console verification code
6. **Bing Verification**: Add Bing Webmaster verification code

### Dynamic Sitemap
The current `sitemap.xml` is static. Consider:
- Generating dynamic sitemap from your backend
- Including dynamic pages (practice areas, team members, case studies, news articles)
- Updating `lastmod` dates when content changes

### Additional SEO Recommendations

1. **Page Speed**: Optimize images and use lazy loading
2. **Mobile Friendly**: Already responsive, ensure all pages work well on mobile
3. **SSL Certificate**: Ensure HTTPS is properly configured
4. **Content**: Regularly update blog/news section with legal content
5. **Local SEO**: 
   - Add business to Google My Business
   - Add to local directories
   - Encourage client reviews
6. **Backlinks**: Build quality backlinks from legal directories and local business listings

### Monitoring
- Monitor Google Search Console for indexing issues
- Check Bing Webmaster Tools regularly
- Track keyword rankings
- Monitor page speed with Google PageSpeed Insights
- Use Google Analytics for traffic analysis

## Next Steps
1. Add verification codes to index.html
2. Submit sitemap to both Google and Bing
3. Set up Google Analytics
4. Configure Google My Business listing
5. Start building quality backlinks

