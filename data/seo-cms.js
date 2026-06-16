/* SEO & CMS Mastery — dedicated learning track.
   119 concepts across 7 subcategories: SEO Foundations, Technical SEO,
   Website Architecture SEO, Backend & Infrastructure, CMS Concepts,
   CMS-Powered SEO Implementation, and Architecture-Firm SEO.
   Professional + 5-year-old explanations, website + architecture-firm examples,
   related links, review questions, and a few inline SVG wireframes (reused from
   ARCH_WEB). Exposes window.SEO_CMS and merges SRS cards into AI_MASTERY_DATA. */
(() => {
  'use strict';
  if (window.SEO_CMS) return;

  const CATEGORY = 'SEO & CMS';
  const GROUPS = [
    'SEO Foundations',
    'Technical SEO',
    'Website Architecture SEO',
    'Backend & Infrastructure',
    'CMS Concepts',
    'CMS-Powered SEO Implementation',
    'Architecture-Firm SEO'
  ];

  // HHL 80/20 priority set. Only these concepts are currently surfaced in the
  // SEO & CMS curriculum and merged into the review deck. Every other concept
  // stays in TERMS below (nothing is deleted) but is not surfaced or merged,
  // so it does not appear in the curriculum, review queues, or progress.
  const FEATURED = new Set([
    // SEO foundations
    'seo-search-intent', 'seo-crawling', 'seo-indexing', 'seo-ranking',
    'seo-meta-title', 'seo-meta-description', 'seo-url-structure', 'seo-internal-linking',
    'seo-robots-txt', 'seo-canonical-url', 'seo-slugs',
    // technical SEO essentials (image SEO, sitemap, structured data, social, vitals, redirects)
    'seo-image-optimization', 'seo-xml-sitemap', 'seo-structured-data', 'seo-open-graph',
    'seo-core-web-vitals', 'seo-lcp', 'seo-cls', 'seo-redirects',
    // alt text (image SEO implementation)
    'cms-seo-image-alt',
    // architecture website SEO
    'seo-portfolio-seo', 'seo-local-seo', 'seo-project-page', 'seo-service-page-strategy',
    // CMS fundamentals
    'cms-cms', 'cms-headless-cms', 'cms-content-type', 'cms-entry', 'cms-field',
    'cms-content-relationships', 'cms-media-library', 'cms-dynamic-pages',
    'cms-reusable-components', 'cms-seo-fields', 'cms-draft-publish', 'cms-preview-mode',
    'cms-global-settings', 'cms-driven-routing',
    // modern website infrastructure
    'backend-content-model', 'backend-api', 'backend-database', 'backend-authentication',
    'backend-environment-variables', 'backend-deployment-pipeline'
  ]);

  // Curriculum display order for the focused set (learning-path progression):
  // foundations -> technical -> architecture-site SEO -> CMS -> infrastructure.
  const FEATURED_GROUP_ORDER = [
    'SEO Foundations',
    'Technical SEO',
    'Website Architecture SEO',
    'Architecture-Firm SEO',
    'CMS Concepts',
    'CMS-Powered SEO Implementation',
    'Backend & Infrastructure'
  ];

  /* Wireframe specs reuse ARCH_WEB primitives (200x120 canvas):
     b=box, f=faint box, i=image, a=accent box, l=text line, t=label, c=circle, w=line, ar=arrow */
  const TERMS = [
    /* ---------- SEO Foundations ---------- */
    {
      id: 'seo-search-intent', level: 'Beginner', group: 'SEO Foundations', title: 'Search intent',
      pro: 'Search intent is the underlying goal behind a query - informational, navigational, commercial, or transactional. Search engines rank the pages that best satisfy that goal, so matching intent matters more than matching keywords. Misreading intent (answering an informational query with a hard sales page) is a common reason otherwise good content fails to rank.',
      eli5: 'It is what a person really wants when they type something into Google, not just the words they used.',
      why: 'If a page does not match why people searched, it will not rank no matter how many keywords it contains.',
      example: 'Someone searching how much does an extension cost wants a guide, so a pricing-explainer page outranks a generic services page.',
      arch: 'modern lake house architect is commercial-investigation intent, so a curated project gallery satisfies it better than a blog post.',
      question: 'What are the four main types of search intent, and why does matching intent beat matching keywords?',
      practice: 'Classify three queries a client might use to find an architecture studio by their intent type.',
      related: ['seo-serp', 'seo-ranking', 'seo-landing-pages']
    },
    {
      id: 'seo-serp', level: 'Beginner', group: 'SEO Foundations', title: 'SERP',
      pro: 'The SERP (Search Engine Results Page) is what a search engine returns for a query: organic results, ads, and rich features like featured snippets, image packs, map packs, and People also ask. Each feature is a different opportunity, and the layout decides how much attention organic links actually receive.',
      eli5: 'It is the page of results you see after you search for something.',
      why: 'Knowing which SERP features appear for your target queries tells you what to optimize for - a snippet, an image, or a map listing.',
      example: 'For kitchen extension ideas the SERP leads with an image pack, so optimized photos can win the click before any text link.',
      arch: 'Local queries like architect near me show a map pack, so a Google Business Profile matters as much as the website.',
      question: 'What elements make up a SERP, and why do its features change what you optimize?',
      practice: 'Search one target query and list every SERP feature shown above the first organic result.',
      related: ['seo-search-intent', 'seo-ranking', 'seo-meta-title'],
      v: [['b', 6, 8, 150, 16], ['t', 12, 18, 'architect [city]'], ['a', 162, 8, 32, 16, 'GO'], ['a', 6, 32, 150, 14, ''], ['t', 12, 42, 'studio.com - Architects'], ['l', 6, 52, 120, 3], ['b', 6, 62, 150, 12], ['l', 12, 69, 100, 3], ['b', 6, 80, 150, 12], ['l', 12, 87, 90, 3], ['t', 6, 108, 'SERP RESULTS']]
    },
    {
      id: 'seo-crawling', level: 'Beginner', group: 'SEO Foundations', title: 'Crawling',
      pro: 'Crawling is how search engines discover pages: automated bots (crawlers or spiders) follow links and read sitemaps to fetch URLs. A page that cannot be reached by a link or listed in a sitemap may never be crawled, and crawl budget limits how much of a large site gets visited.',
      eli5: 'It is when a robot from Google walks around the internet following links to find pages.',
      why: 'If crawlers cannot find or reach a page, it can never appear in search - discovery comes before everything else.',
      example: 'A project page only linked from a JavaScript filter that bots cannot click may stay undiscovered until it is added to the sitemap.',
      arch: 'Portfolio sites that hide projects behind heavy interactions risk leaving award-winning work uncrawled and invisible.',
      question: 'How do search engines discover pages, and what stops a page from being crawled?',
      practice: 'List two reasons a page on a site might never get crawled.',
      related: ['seo-indexing', 'seo-sitemap', 'seo-robots-txt']
    },
    {
      id: 'seo-indexing', level: 'Beginner', group: 'SEO Foundations', title: 'Indexing',
      pro: 'Indexing is when a crawled page is analyzed and stored in the search engine database so it can be returned for queries. Crawling does not guarantee indexing - thin, duplicate, or noindex-tagged pages are crawled but excluded. Only indexed pages can rank.',
      eli5: 'It is when Google decides a page is worth remembering and puts it in its giant library.',
      why: 'A page must be indexed before it can rank, so checking index status is the first diagnostic when a page gets no traffic.',
      example: 'A new case study is crawled within a day but only appears in results once Google indexes it, often after a sitemap ping.',
      arch: 'Confirm each new project page is indexed in Search Console before sharing it with press, or the links may show nothing.',
      question: 'What is the difference between crawling and indexing, and why can a crawled page still be missing from search?',
      practice: 'Name two reasons a crawled page might not get indexed.',
      related: ['seo-crawling', 'seo-ranking', 'seo-thin-content']
    },
    {
      id: 'seo-ranking', level: 'Beginner', group: 'SEO Foundations', title: 'Ranking',
      pro: 'Ranking is the ordered position a page receives for a query, decided by hundreds of signals: relevance to intent, content quality, links, page experience, and freshness. Ranking is per-query and dynamic - the same page ranks differently for different searches and changes over time.',
      eli5: 'It is the order Google puts pages in, deciding who shows up first.',
      why: 'Most clicks go to the top few results, so moving from page two into the top three can multiply traffic.',
      example: 'Improving internal links and page speed lifts a services page from position 9 to 3, roughly tripling its clicks.',
      arch: 'Ranking for cultural building architect [city] puts a studio in front of public clients exactly when they are choosing a firm.',
      question: 'What kinds of signals decide ranking, and why is ranking specific to each query?',
      practice: 'List three signals you could improve to raise a page ranking.',
      related: ['seo-search-intent', 'seo-internal-linking', 'seo-core-web-vitals']
    },
    {
      id: 'seo-sitemap', level: 'Beginner', group: 'SEO Foundations', title: 'Sitemap',
      pro: 'A sitemap is a file that lists a site important URLs to help search engines discover and prioritize them, most commonly an XML sitemap referenced in robots.txt. It does not force indexing but speeds discovery, especially for new or deep pages that few internal links point to.',
      eli5: 'It is a map that tells Google all the pages on your website so it does not miss any.',
      why: 'On large or frequently updated sites, a sitemap ensures new pages are found quickly instead of waiting for crawlers to stumble on them.',
      example: 'Publishing a new project automatically adds its URL to /sitemap.xml, prompting faster indexing.',
      arch: 'A studio adding a dozen projects a year keeps them all discoverable through an auto-generated sitemap.',
      question: 'What does a sitemap do, and what does it not guarantee?',
      practice: 'Explain why a brand-new deep page benefits from being in the sitemap.',
      related: ['seo-xml-sitemap', 'seo-crawling', 'cms-seo-sitemap-generation']
    },
    {
      id: 'seo-robots-txt', level: 'Beginner', group: 'SEO Foundations', title: 'Robots.txt',
      pro: 'Robots.txt is a plain-text file at the site root that tells crawlers which paths they may or may not request. It controls crawling, not indexing - a disallowed page can still be indexed if linked elsewhere, and blocking resources like CSS or JS can hurt how pages are rendered and ranked.',
      eli5: 'It is a sign at the front door telling robots which rooms they can and cannot go into.',
      why: 'A wrong rule can accidentally block an entire site from search, so robots.txt is both powerful and dangerous.',
      example: 'Disallowing /admin keeps the CMS login out of crawls while leaving public pages open.',
      arch: 'A staging subdomain is disallowed so unfinished projects do not leak into search before launch.',
      question: 'What does robots.txt control, and why does blocking a page not reliably remove it from search?',
      practice: 'Write a robots rule that blocks an admin path but allows everything else.',
      related: ['seo-crawling', 'seo-canonical-url', 'cms-seo-robots-handling']
    },
    {
      id: 'seo-canonical-url', level: 'Beginner', group: 'SEO Foundations', title: 'Canonical URL',
      pro: 'A canonical URL is the single preferred address for a piece of content, declared with a rel=canonical link so search engines consolidate duplicates (with and without trailing slash, query parameters, print versions) onto one ranking URL. Without it, duplicate variants split signals and compete with each other.',
      eli5: 'It is telling Google this is the real address for this page so copies do not confuse it.',
      why: 'It prevents duplicate-content dilution and makes sure links and authority point at one URL, not five near-identical ones.',
      example: 'Filtered grid URLs like /projects?type=housing all canonicalize to /projects so ranking signals stay consolidated.',
      arch: 'A project reachable from multiple typology filters canonicalizes to one clean /projects/fjord-museum URL.',
      question: 'What problem does a canonical URL solve, and what happens to duplicate variants without one?',
      practice: 'Identify two URL variants of one page that should share a canonical.',
      related: ['seo-duplicate-content', 'seo-url-structure', 'cms-seo-canonical-generation'],
      v: [['b', 6, 18, 84, 14], ['t', 10, 27, '/projects?type=x'], ['b', 6, 38, 84, 14], ['t', 10, 47, '/projects/print'], ['ar', 92, 25, 116, 50], ['ar', 92, 45, 116, 54], ['a', 118, 44, 74, 18, '/projects'], ['t', 116, 78, 'ONE CANONICAL URL']]
    },
    {
      id: 'seo-meta-title', level: 'Beginner', group: 'SEO Foundations', title: 'Meta title',
      pro: 'The meta title (title tag) is the clickable headline shown in search results and browser tabs. It is a primary relevance signal and the biggest single influence on click-through rate. Effective titles are unique per page, front-load the key term, stay near 60 characters, and read like a promise rather than keyword stuffing.',
      eli5: 'It is the big blue clickable name of a page in the search results.',
      why: 'It shapes both ranking and whether people click, so a weak title wastes a strong ranking.',
      example: 'Kitchen Extension Costs in 2026 - Studio North beats a generic Home - Studio North.',
      arch: 'Each project uses Project Name - Type, City - Studio so search results and shared tabs read clearly.',
      question: 'Why is the meta title important for both ranking and click-through, and what makes a strong one?',
      practice: 'Write a 60-character title for a studio contact page.',
      related: ['seo-meta-description', 'seo-serp', 'cms-seo-fields-to-meta']
    },
    {
      id: 'seo-meta-description', level: 'Beginner', group: 'SEO Foundations', title: 'Meta description',
      pro: 'The meta description is the short summary search engines may show beneath the title. It is not a direct ranking factor but strongly affects click-through. Search engines often rewrite it from page content, so it should be a unique, compelling summary near 150 characters that matches intent and includes the key term.',
      eli5: 'It is the little paragraph under the blue link that tells you what the page is about.',
      why: 'A persuasive description can win the click even when you rank just below a competitor.',
      example: 'See costs, timelines, and real extensions we designed across the region. Get a fixed quote. invites a click.',
      arch: 'A project description names the building type, location, and one standout fact to draw juries and clients.',
      question: 'Does the meta description affect ranking, and why is it still worth writing carefully?',
      practice: 'Write a 150-character description for a studio services page.',
      related: ['seo-meta-title', 'seo-serp', 'cms-seo-fields-to-meta']
    },
    {
      id: 'seo-heading-hierarchy', level: 'Beginner', group: 'SEO Foundations', title: 'Heading hierarchy',
      pro: 'Heading hierarchy is the ordered structure of H1-H6 tags that conveys a page outline to readers, assistive technology, and search engines. Each page should have one H1 describing its topic, with H2 and H3 nesting logically. Skipping levels or using headings just for styling breaks the semantic outline.',
      eli5: 'It is using big titles and smaller subtitles in the right order, like chapters and sections in a book.',
      why: 'Clear headings improve accessibility, help search engines understand structure, and can earn featured snippets.',
      example: 'A guide uses one H1, then H2s per question with H3 details, so it reads as a clean outline.',
      arch: 'A case study uses an H1 project name and H2s for brief, process, and outcome - structure both jurors and crawlers follow.',
      question: 'Why should a page have one H1 and a logical heading order, and who relies on it?',
      practice: 'Outline the heading structure for a project case-study page.',
      related: ['seo-thin-content', 'seo-accessibility-seo', 'seo-internal-linking']
    },
    {
      id: 'seo-internal-linking', level: 'Beginner', group: 'SEO Foundations', title: 'Internal linking',
      pro: 'Internal linking is connecting your own pages with descriptive links. It spreads ranking authority (link equity), helps crawlers discover pages, and guides users to related content. Strategic links from strong pages to important targets, using meaningful anchor text, are one of the most controllable ranking levers.',
      eli5: 'It is putting links on your own pages that lead to other pages on your same website.',
      why: 'It tells search engines which pages matter most and keeps visitors moving deeper instead of leaving.',
      example: 'A popular guide links to the services page with anchor our extension design service, passing authority and intent.',
      arch: 'Each project links to related projects and the relevant service page, building topical clusters and longer visits.',
      question: 'What three jobs does internal linking do, and why is it a powerful, controllable lever?',
      practice: 'Pick a strong page and choose two important pages it should link to.',
      related: ['seo-anchor-text', 'seo-topic-clusters', 'seo-ranking']
    },
    {
      id: 'seo-url-structure', level: 'Beginner', group: 'SEO Foundations', title: 'URL structure',
      pro: 'URL structure is how addresses are organized: readable words, logical folders, lowercase, hyphens, and no unnecessary parameters. Clean, shallow, descriptive URLs are easier for users to trust and share, and their words add mild relevance. Stable structure avoids the redirects and broken links that come with reorganizing.',
      eli5: 'It is keeping web addresses short, tidy, and easy to read.',
      why: 'Readable URLs improve trust and click-through and signal page topic, while messy ones are fragile and forgettable.',
      example: '/services/extensions beats /page?id=42&cat=7 for clarity and shareability.',
      arch: '/projects/[type]/[slug] gives every building a predictable, quotable address for press and awards.',
      question: 'What makes a URL structure good for users and search engines, and why does stability matter?',
      practice: 'Rewrite a messy parameter URL into a clean, readable path.',
      related: ['seo-slugs', 'seo-canonical-url', 'seo-information-architecture']
    },
    {
      id: 'seo-slugs', level: 'Beginner', group: 'SEO Foundations', title: 'Slugs',
      pro: 'A slug is the readable, hyphenated end segment of a URL that identifies a specific page (/projects/fjord-museum). Good slugs are short, descriptive, lowercase, and permanent. Once published they should stay fixed or be redirected, because changing a slug breaks every existing link and the page rankings.',
      eli5: 'It is the readable label at the end of a web address, like a folder name.',
      why: 'Slugs make URLs memorable and add relevance, but changing them silently breaks links and loses ranking.',
      example: 'A CMS turns Fjord Museum into fjord-museum and locks it before publishing.',
      arch: 'Press and award sites cite /projects/fjord-museum for years, so the slug must never quietly change.',
      question: 'What makes a good slug, and what must happen if one ever changes?',
      practice: 'Write slugs for three project titles, including one with accented characters.',
      related: ['seo-url-structure', 'cms-slug-field', 'cms-seo-dynamic-slugs']
    },
    {
      id: 'seo-anchor-text', level: 'Beginner', group: 'SEO Foundations', title: 'Anchor text',
      pro: 'Anchor text is the visible, clickable words of a link. It tells users and search engines what the destination is about, so descriptive anchors (kitchen extension guide) pass more topical relevance than generic ones (click here). Over-optimized exact-match anchors on external links can look manipulative, while internal anchors have more freedom.',
      eli5: 'It is the actual words you click on that take you to another page.',
      why: 'Descriptive anchor text strengthens relevance and accessibility, while vague anchors waste the signal.',
      example: 'Linking with our adaptive-reuse projects tells crawlers the target topic better than see more.',
      arch: 'Internal links to project pages use the building name and type as anchors, reinforcing topical relevance.',
      question: 'Why does descriptive anchor text matter, and when can anchor text become a risk?',
      practice: 'Rewrite three click here links into descriptive anchors.',
      related: ['seo-internal-linking', 'seo-accessibility-seo', 'seo-heading-hierarchy']
    },
    {
      id: 'seo-duplicate-content', level: 'Intermediate', group: 'SEO Foundations', title: 'Duplicate content',
      pro: 'Duplicate content is the same or near-identical content available at multiple URLs, within a site or across sites. It splits ranking signals, wastes crawl budget, and forces search engines to choose one version. It is usually fixed with canonical tags, redirects, consistent internal linking, or by consolidating pages - not by chasing penalty myths.',
      eli5: 'It is having the same page in two places, which confuses Google about which one to show.',
      why: 'Duplicates compete with each other and dilute authority, so consolidation usually lifts the surviving page.',
      example: 'HTTP and HTTPS versions of a page both indexed are duplicates, fixed by redirecting to one.',
      arch: 'A project shown under two typologies should canonicalize to one URL, not exist twice.',
      question: 'What problems does duplicate content cause, and what are the standard fixes?',
      practice: 'List two common sources of accidental duplicate content.',
      related: ['seo-canonical-url', 'seo-301-redirect', 'seo-thin-content']
    },
    {
      id: 'seo-thin-content', level: 'Intermediate', group: 'SEO Foundations', title: 'Thin content',
      pro: 'Thin content is a page with little unique value - sparse text, boilerplate, doorway pages, or auto-generated filler. Search engines may ignore or deindex it, and it can drag down a site overall quality assessment. The fix is to add genuine substance, consolidate overlapping pages, or noindex pages that exist only for navigation.',
      eli5: 'It is a page that does not really say much, so Google does not find it useful.',
      why: 'Thin pages rarely rank and can lower trust in the whole site, especially when many of them exist.',
      example: 'A service page with two sentences is expanded with process, deliverables, examples, and FAQs.',
      arch: 'Image-only project pages add a short brief, materials, and outcome so crawlers have text to rank.',
      question: 'What makes content thin, and what are the three main remedies?',
      practice: 'Take a two-sentence page and list four sections that would give it real substance.',
      related: ['seo-heading-hierarchy', 'seo-indexing', 'seo-minimal-crawlable']
    },

    /* ---------- Technical SEO ---------- */
    {
      id: 'seo-core-web-vitals', level: 'Intermediate', group: 'Technical SEO', title: 'Core Web Vitals',
      pro: 'Core Web Vitals are Google user-experience metrics measuring loading (LCP), interactivity (INP), and visual stability (CLS). They are real ranking signals under page experience and are measured on real users (field data). Passing all three correlates with lower bounce and is a baseline expectation for competitive pages.',
      eli5: 'They are Google health checkpoints for how fast and smooth a page feels.',
      why: 'Poor vitals hurt rankings and conversions, and they are measurable and fixable, unlike vague speed.',
      example: 'Compressing the hero image and reserving space for it fixes a failing LCP and CLS on the home page.',
      arch: 'Heavy architectural photography is the usual culprit, so optimizing it is the main vitals fix for studio sites.',
      question: 'Which three experiences do Core Web Vitals measure, and why does field data matter?',
      practice: 'Name the metric for loading, interactivity, and stability.',
      related: ['seo-lcp', 'seo-inp', 'seo-cls'],
      v: [['b', 18, 18, 40, 82], ['a', 18, 52, 40, 48, ''], ['t', 26, 110, 'LCP'], ['b', 80, 18, 40, 82], ['a', 80, 38, 40, 62, ''], ['t', 88, 110, 'INP'], ['b', 142, 18, 40, 82], ['a', 142, 70, 40, 30, ''], ['t', 150, 110, 'CLS']]
    },
    {
      id: 'seo-lcp', level: 'Intermediate', group: 'Technical SEO', title: 'Largest Contentful Paint',
      pro: 'Largest Contentful Paint measures how long until the largest visible element (often a hero image or heading) renders, marking when the page feels loaded. Good is under 2.5 seconds. It is improved by optimizing and preloading the hero image, fast servers and CDNs, and removing render-blocking resources.',
      eli5: 'It is how long until the biggest thing on the screen actually shows up.',
      why: 'LCP is the clearest proxy for did the page load fast, and slow LCP drives people away before they see anything.',
      example: 'Serving the hero as a preloaded AVIF from a CDN cuts LCP from 4 seconds to 1.8 seconds.',
      arch: 'On photo-led homes the hero image is the LCP element, so its format and delivery decide the score.',
      question: 'What does LCP measure, and what is the main lever to improve it on an image-led page?',
      practice: 'Identify the likely LCP element on a portfolio home page.',
      related: ['seo-core-web-vitals', 'seo-preload', 'seo-image-optimization']
    },
    {
      id: 'seo-inp', level: 'Intermediate', group: 'Technical SEO', title: 'Interaction to Next Paint',
      pro: 'Interaction to Next Paint measures responsiveness: the delay between a user interaction (tap or click) and the next visual update, across the whole visit. Good is under 200 milliseconds. It is hurt by long JavaScript tasks blocking the main thread and improved by reducing and splitting JS and deferring non-critical work.',
      eli5: 'It is how quickly the page reacts when you tap or click something.',
      why: 'Sluggish interactions feel broken, and INP replaced the older First Input Delay to capture the whole experience.',
      example: 'Breaking up a heavy filter script removes the lag when users tap project-type chips.',
      arch: 'Interactive project filters and galleries are common INP offenders on portfolio sites.',
      question: 'What does INP measure, and what is the usual cause of a poor score?',
      practice: 'Name one interaction on a portfolio site that could cause a high INP.',
      related: ['seo-core-web-vitals', 'seo-render-blocking', 'seo-javascript-seo']
    },
    {
      id: 'seo-cls', level: 'Intermediate', group: 'Technical SEO', title: 'Cumulative Layout Shift',
      pro: 'Cumulative Layout Shift measures unexpected movement of visible elements as the page loads - text jumping when an image or font arrives. Good is under 0.1. It is fixed by setting explicit width and height (or aspect-ratio) on media, reserving space for ads and embeds, and preloading fonts.',
      eli5: 'It is when the page jumps around while loading and you tap the wrong thing.',
      why: 'Layout shift frustrates users and causes misclicks, and it is one of the easiest vitals to fix.',
      example: 'Adding width and height to every gallery image removes the jump as photos load, taking CLS to near zero.',
      arch: 'Image-dense grids shift badly without reserved dimensions, so setting aspect ratios keeps them stable.',
      question: 'What causes layout shift, and what is the standard fix for images?',
      practice: 'Explain why missing image dimensions cause CLS.',
      related: ['seo-core-web-vitals', 'seo-image-optimization', 'seo-responsive-images']
    },
    {
      id: 'seo-page-speed', level: 'Intermediate', group: 'Technical SEO', title: 'Page speed',
      pro: 'Page speed is the perception and reality of how quickly a page loads and becomes usable, summarized by lab tools (Lighthouse) and field metrics (Core Web Vitals). It depends on payload size, server response, render-blocking resources, and caching. Speed affects rankings, bounce, and conversion.',
      eli5: 'It is simply how fast a web page loads.',
      why: 'Faster pages rank better and lose fewer visitors, and every extra second measurably raises bounce.',
      example: 'Image optimization, caching, and a CDN take a 6-second home page down to under 2 seconds.',
      arch: 'A megabyte-heavy portfolio on gallery Wi-Fi must be lean to keep clients from leaving.',
      question: 'What factors determine page speed, and why does it affect business outcomes?',
      practice: 'List three changes that typically improve page speed the most.',
      related: ['seo-core-web-vitals', 'backend-caching', 'backend-cdn']
    },
    {
      id: 'seo-lazy-loading', level: 'Intermediate', group: 'Technical SEO', title: 'Lazy loading',
      pro: 'Lazy loading defers loading off-screen resources (images, iframes) until they are about to enter the viewport, cutting initial payload and speeding first render. Below-the-fold images should be lazy, but the LCP and hero image must load eagerly. The native loading=lazy attribute handles most cases.',
      eli5: 'It means pictures load only when you scroll near them, not all at once.',
      why: 'It dramatically reduces initial load on image-heavy pages without hurting the visible content.',
      example: 'A 40-image project grid loads the first row eagerly and the rest as the user scrolls.',
      arch: 'Long photo galleries stay fast because only visible images download up front.',
      question: 'What does lazy loading defer, and which image must never be lazy-loaded?',
      practice: 'Decide which images on a gallery page should and should not be lazy.',
      related: ['seo-image-optimization', 'seo-lcp', 'seo-page-speed']
    },
    {
      id: 'seo-image-optimization', level: 'Intermediate', group: 'Technical SEO', title: 'Image optimization',
      pro: 'Image optimization delivers the smallest acceptable file per context: modern formats (AVIF and WebP), correct dimensions, compression, responsive srcset, lazy loading, and CDN delivery. On image-led sites it is the single biggest performance lever and directly improves LCP and overall speed.',
      eli5: 'It means shrinking pictures cleverly so they still look great but load fast.',
      why: 'Photography is the heaviest asset on most sites, so optimizing it fixes most speed and vitals problems.',
      example: 'Each photo is generated in AVIF at six widths, and the grid loads 400px versions while the lightbox loads 2000px.',
      arch: 'An 8MB TIFF export becomes a 180KB AVIF, keeping award-grade photos crisp at a tenth of the bytes.',
      question: 'Which techniques make up image optimization, and why is it the top lever for portfolios?',
      practice: 'Plan srcset widths for a thumbnail versus a full-bleed hero.',
      related: ['seo-responsive-images', 'seo-lcp', 'cms-asset-optimization']
    },
    {
      id: 'seo-responsive-images', level: 'Intermediate', group: 'Technical SEO', title: 'Responsive images',
      pro: 'Responsive images serve different image files based on the device using srcset (width candidates) and sizes (layout hints), so phones get small files and large screens get sharp ones. They prevent shipping desktop-sized images to phones and are essential for performance on varied devices.',
      eli5: 'It means phones get small pictures and big screens get big ones, automatically.',
      why: 'Without them, mobile users download oversized images, wrecking speed and data use.',
      example: 'srcset offers 400, 800, and 1600px versions, so a phone picks 400px and a 4K display picks 1600px.',
      arch: 'Gallery thumbnails ship tiny on phones while the lightbox loads high-resolution detail shots.',
      question: 'How do srcset and sizes deliver the right image, and what problem do they prevent?',
      practice: 'Write the candidate widths you would offer for a responsive hero image.',
      related: ['seo-image-optimization', 'seo-cls', 'seo-page-speed']
    },
    {
      id: 'seo-preload', level: 'Intermediate', group: 'Technical SEO', title: 'Preload',
      pro: 'Preload is a resource hint (link rel=preload) telling the browser to fetch a critical resource early - typically the LCP image, a key font, or critical CSS - before it would normally discover it. Used sparingly on truly critical assets it speeds first render, but overused it competes for bandwidth and slows things down.',
      eli5: 'It tells the browser to grab this important thing first so the page shows sooner.',
      why: 'Preloading the hero image or main font is a direct LCP and perceived-speed win.',
      example: 'Preloading the hero AVIF shaves a second off LCP by starting its download immediately.',
      arch: 'The home page preloads its signature building photo so the brand impression lands instantly.',
      question: 'What is preload used for, and why should it be limited to critical resources?',
      practice: 'Name two resources worth preloading on a photo-led home page.',
      related: ['seo-prefetch', 'seo-lcp', 'seo-render-blocking']
    },
    {
      id: 'seo-prefetch', level: 'Intermediate', group: 'Technical SEO', title: 'Prefetch',
      pro: 'Prefetch is a low-priority hint to fetch resources for a likely next navigation during idle time, so the next page feels instant. Unlike preload (current page, high priority), prefetch is speculative and for future pages. Frameworks often prefetch links in the viewport automatically.',
      eli5: 'It quietly downloads the next page in the background so it opens instantly.',
      why: 'It makes multi-page journeys feel seamless, like browsing a fast app.',
      example: 'Hovering a project card prefetches the case-study page so the click loads with no wait.',
      arch: 'Prefetching visible project links makes scrolling into a project feel instantaneous.',
      question: 'How does prefetch differ from preload, and what experience does it improve?',
      practice: 'Describe when prefetching a link is worthwhile versus wasteful.',
      related: ['seo-preload', 'seo-page-speed', 'backend-cdn']
    },
    {
      id: 'seo-render-blocking', level: 'Intermediate', group: 'Technical SEO', title: 'Render-blocking resources',
      pro: 'Render-blocking resources are CSS and synchronous JavaScript the browser must download and process before it can display content, delaying first paint and LCP. They are reduced by inlining critical CSS, deferring or async-loading scripts, code-splitting, and removing unused code.',
      eli5: 'They are files the page must finish reading before it can show anything.',
      why: 'Eliminating render-blocking assets is one of the most reliable ways to speed up first paint.',
      example: 'Deferring a non-critical analytics script lets the hero render a second sooner.',
      arch: 'A portfolio defers gallery and animation scripts so the first photo paints immediately.',
      question: 'What are render-blocking resources, and what techniques reduce their impact?',
      practice: 'Name two ways to stop a script from blocking render.',
      related: ['seo-lcp', 'seo-page-speed', 'seo-javascript-seo']
    },
    {
      id: 'seo-javascript-seo', level: 'Advanced', group: 'Technical SEO', title: 'JavaScript SEO',
      pro: 'JavaScript SEO is making JS-dependent sites fully crawlable and indexable. Search engines render JS but with delay and limits, so content that only appears after client-side fetching can be missed. Server-side rendering, static generation, real anchor links, and avoiding render-dependent content are the core practices.',
      eli5: 'It is making sure Google can still read pages that are built with JavaScript.',
      why: 'Modern sites are JS-heavy, so if key content or links only exist after JS runs they may never get indexed.',
      example: 'A project list rendered only via a client fetch is moved to server rendering so crawlers see it in the HTML.',
      arch: 'Fancy JS-driven portfolios must ensure project content is in the served HTML, not just painted later.',
      question: 'Why can JavaScript-rendered content fail to index, and what practices prevent it?',
      practice: 'Explain why a real anchor link beats a JS onclick for SEO.',
      related: ['seo-ssr', 'seo-ssg', 'seo-crawling']
    },
    {
      id: 'seo-ssr', level: 'Advanced', group: 'Technical SEO', title: 'Server-side rendering',
      pro: 'Server-side rendering generates a page full HTML on the server for each request, so users and crawlers receive complete content immediately, then JavaScript hydrates it for interactivity. SSR improves SEO and first paint for dynamic, frequently changing content at the cost of server work per request.',
      eli5: 'The page is built on the server and arrives ready to read, then becomes interactive.',
      why: 'It guarantees crawlers and users get content without waiting for client JS, which helps indexing and speed.',
      example: 'A frequently updated project index is server-rendered so new projects appear in the HTML instantly.',
      arch: 'A studio publishing often uses SSR so fresh work is immediately crawlable without a rebuild.',
      question: 'What does SSR send to the browser, and when is it preferable to static generation?',
      practice: 'Name one type of page where SSR beats static generation.',
      related: ['seo-ssg', 'seo-hydration', 'seo-javascript-seo']
    },
    {
      id: 'seo-ssg', level: 'Advanced', group: 'Technical SEO', title: 'Static site generation',
      pro: 'Static site generation pre-builds every page into HTML at build time, served as static files via a CDN. It gives the fastest possible delivery, great SEO, and minimal server cost, but content changes require a rebuild and redeploy. It is ideal for content that changes occasionally, like portfolios.',
      eli5: 'All the pages are made ahead of time so they load super fast.',
      why: 'Static pages are the fastest and most reliable to crawl and serve - perfect for mostly-stable sites.',
      example: 'A portfolio is statically generated, and each deploy outputs ready HTML served from the edge worldwide.',
      arch: 'A studio site rebuilds when a project is added, then serves instant static pages between updates.',
      question: 'What is the tradeoff of static generation, and what kind of site suits it best?',
      practice: 'Decide whether a monthly-updated portfolio fits SSG and why.',
      related: ['seo-ssr', 'backend-cdn', 'backend-build-step']
    },
    {
      id: 'seo-hydration', level: 'Advanced', group: 'Technical SEO', title: 'Hydration',
      pro: 'Hydration is the process where client-side JavaScript attaches behavior to server-rendered or static HTML, turning a static page into an interactive app. Heavy hydration can delay interactivity (hurting INP), so techniques like partial or progressive hydration and islands reduce the JS needed to make a page interactive.',
      eli5: 'It is when a ready-made page wakes up and becomes clickable.',
      why: 'Too much hydration JavaScript delays responsiveness and hurts INP, so minimizing it improves UX.',
      example: 'Only the gallery and menu hydrate as islands, leaving the rest as fast static HTML.',
      arch: 'A mostly-static portfolio hydrates just the lightbox and nav, keeping interactions snappy.',
      question: 'What does hydration do, and how does it relate to interactivity metrics?',
      practice: 'Explain why fewer hydrated components can improve INP.',
      related: ['seo-ssr', 'seo-inp', 'seo-javascript-seo']
    },
    {
      id: 'seo-structured-data', level: 'Intermediate', group: 'Technical SEO', title: 'Structured data',
      pro: 'Structured data is machine-readable markup (usually JSON-LD) that labels page content - organization, breadcrumbs, articles, products, FAQs - so search engines understand it and can show rich results. It does not guarantee rich snippets but makes them possible and clarifies entities.',
      eli5: 'It is hidden labels that tell Google exactly what each part of the page means.',
      why: 'It can earn rich results (stars, breadcrumbs, FAQs) that boost visibility and click-through.',
      example: 'FAQ structured data on a services page makes expandable questions appear directly in search results.',
      arch: 'Organization and breadcrumb markup helps a studio show a clean, branded result with a navigable path.',
      question: 'What does structured data enable, and why does it not guarantee rich results?',
      practice: 'Name two structured-data types useful for an architecture firm site.',
      related: ['seo-schema-org', 'seo-breadcrumbs', 'cms-seo-structured-data']
    },
    {
      id: 'seo-schema-org', level: 'Intermediate', group: 'Technical SEO', title: 'Schema.org',
      pro: 'Schema.org is the shared vocabulary of types and properties (Organization, LocalBusiness, CreativeWork, Article, BreadcrumbList) used to write structured data. Search engines agreed on it, so using the right type and required properties is what makes structured data understood and eligible for rich results.',
      eli5: 'It is the shared dictionary of labels that search engines all agree on.',
      why: 'Using the correct Schema.org type and properties is the difference between valid, useful markup and ignored markup.',
      example: 'Marking a studio as LocalBusiness with address and geo supports local rich results.',
      arch: 'Projects marked as CreativeWork and the firm as LocalBusiness map a portfolio into terms search engines understand.',
      question: 'What is Schema.org, and why does choosing the right type matter?',
      practice: 'Match three site elements to appropriate Schema.org types.',
      related: ['seo-structured-data', 'seo-local-seo', 'seo-awards-publications']
    },
    {
      id: 'seo-open-graph', level: 'Intermediate', group: 'Technical SEO', title: 'Open Graph',
      pro: 'Open Graph tags (og:title, og:description, og:image, og:url) control how a page looks when shared on social platforms and chat apps - the preview title, text, and image. Without them, shares show whatever the platform guesses. A dedicated, correctly-sized OG image makes shared links look professional.',
      eli5: 'It is the label that decides the picture and title shown when you paste a link in a chat.',
      why: 'When a client shares a project, the OG image is the first impression, so templated or missing tags waste it.',
      example: 'A project page sets og:image to its dusk photo so it previews beautifully in a board chat.',
      arch: 'Each project supplies its own OG image and title, so shared links sell the work, not a generic logo.',
      question: 'What do Open Graph tags control, and why does a per-page OG image matter?',
      practice: 'List the four core Open Graph tags every page should set.',
      related: ['seo-meta-title', 'seo-structured-data', 'cms-seo-fields-to-meta']
    },
    {
      id: 'seo-xml-sitemap', level: 'Intermediate', group: 'Technical SEO', title: 'XML sitemap',
      pro: 'An XML sitemap is a structured file listing a site indexable URLs with optional metadata (last modified, priority), submitted to search engines and referenced in robots.txt. It accelerates discovery of new and deep pages and is usually generated automatically from the CMS so it stays current.',
      eli5: 'It is a tidy list of all your pages written for search engines to read.',
      why: 'It ensures new and deep pages get found quickly without relying on crawlers finding every link.',
      example: 'Each publish updates /sitemap.xml with the new URL and a lastmod date, prompting fast indexing.',
      arch: 'An auto-generated sitemap keeps every newly added project discoverable the day it goes live.',
      question: 'What does an XML sitemap include, and why is automatic generation important?',
      practice: 'Explain why lastmod dates help search engines.',
      related: ['seo-sitemap', 'seo-crawling', 'cms-seo-sitemap-generation']
    },
    {
      id: 'seo-redirects', level: 'Intermediate', group: 'Technical SEO', title: 'Redirects',
      pro: 'A redirect sends a browser and crawler from one URL to another. Redirects preserve link equity and user experience when content moves, URLs change, or duplicates are consolidated. Choosing the right type (301 permanent versus 302 temporary) and avoiding long redirect chains is essential to keep rankings.',
      eli5: 'It is an automatic forward from an old address to a new one.',
      why: 'Without redirects, moved or renamed pages return 404s, losing visitors and accumulated ranking.',
      example: 'Renaming /work to /projects adds a redirect so old links and rankings carry over.',
      arch: 'A site redesign maps every legacy project URL to its new path to protect years of press links.',
      question: 'Why are redirects needed when content moves, and what risks come from chains?',
      practice: 'Describe what should happen to an old URL after a page is renamed.',
      related: ['seo-301-redirect', 'seo-404-page', 'cms-seo-redirect-management']
    },
    {
      id: 'seo-301-redirect', level: 'Intermediate', group: 'Technical SEO', title: '301 redirect',
      pro: 'A 301 redirect signals a permanent move, telling search engines to transfer the old URL ranking signals to the new one and update the index. It is the correct tool for renamed pages, domain changes, and HTTP-to-HTTPS moves. A 302 (temporary) does not pass equity the same way, so using the wrong code loses rankings.',
      eli5: 'It is a permanent forward that tells Google the page moved here for good.',
      why: 'Using a 301 rather than a 302 is what preserves rankings when URLs change permanently.',
      example: 'Migrating to HTTPS, every http URL 301-redirects to its https version.',
      arch: 'When a project slug must change, a 301 from the old slug keeps award and press links alive.',
      question: 'When do you use a 301, and how does it differ from a 302 for SEO?',
      practice: 'Decide which redirect code fits a permanent domain change.',
      related: ['seo-redirects', 'seo-canonical-url', 'cms-seo-redirect-management'],
      v: [['b', 6, 46, 70, 22], ['t', 14, 59, '/old-url'], ['ar', 80, 57, 116, 57], ['a', 118, 46, 74, 22, '/new-url'], ['t', 58, 30, '301 PERMANENT'], ['t', 40, 86, 'ranking signals follow']]
    },
    {
      id: 'seo-404-page', level: 'Beginner', group: 'Technical SEO', title: '404 page',
      pro: 'A 404 page is shown when a URL does not exist. It must return the HTTP 404 status (not 200) so search engines drop dead URLs. A helpful 404 keeps users on-site with navigation, search, and links back to key pages instead of a dead end. Soft 404s (missing pages returning 200) confuse indexing.',
      eli5: 'It is the page not found screen you see when an address is wrong.',
      why: 'A correct 404 status keeps the index clean, and a useful 404 recovers visitors who would otherwise leave.',
      example: 'A custom 404 offers a link to projects and the home page instead of a blank error.',
      arch: 'A branded 404 with links to the project grid keeps a mistyped or expired link from losing a client.',
      question: 'Why must a 404 return the right status code, and what makes a 404 page helpful?',
      practice: 'List three elements a good 404 page should include.',
      related: ['seo-redirects', 'seo-301-redirect', 'seo-navigation-structure']
    },
    {
      id: 'seo-international-seo', level: 'Advanced', group: 'Technical SEO', title: 'International SEO',
      pro: 'International SEO targets multiple countries or languages: choosing a URL structure (subdirectories, subdomains, or country domains), signaling language and region with hreflang, localizing content, and avoiding duplicate-content issues between similar-language versions. It ensures the right version ranks for the right audience.',
      eli5: 'It is making your site rank correctly for people in different countries and languages.',
      why: 'Without proper signals, search engines may show the wrong language version or treat translations as duplicates.',
      example: 'A site offers /en and /sv versions with hreflang so each ranks in its market.',
      arch: 'A studio working across the Nordics serves localized project pages so each country sees the right language.',
      question: 'What decisions does international SEO involve, and what problem does it prevent?',
      practice: 'Choose a URL structure for a bilingual studio site and justify it.',
      related: ['seo-hreflang', 'seo-url-structure', 'cms-localization']
    },
    {
      id: 'seo-hreflang', level: 'Advanced', group: 'Technical SEO', title: 'hreflang',
      pro: 'Hreflang is markup that tells search engines the language and region of alternate page versions, so they serve the right one and avoid treating translations as duplicates. Each version must reference all the others (including itself) consistently, and mismatched or incomplete hreflang is a common, hard-to-debug error.',
      eli5: 'It is a tag that says this page is the Swedish version and that one is English.',
      why: 'It routes users to their language version and stops near-duplicate translations from competing.',
      example: 'The English page declares hreflang to the Swedish page and vice versa, with a self-reference.',
      arch: 'Bilingual project pages use hreflang so a Swedish client gets the Swedish page in search.',
      question: 'What does hreflang prevent, and why must the references be reciprocal?',
      practice: 'Explain what breaks if a page omits its hreflang self-reference.',
      related: ['seo-international-seo', 'seo-canonical-url', 'cms-localization']
    },
    {
      id: 'seo-accessibility-seo', level: 'Advanced', group: 'Technical SEO', title: 'Accessibility and SEO',
      pro: 'Accessibility and SEO overlap heavily: semantic HTML, descriptive alt text, logical headings, real links, captions, and good contrast help both assistive technology and search engines understand a page. Accessible sites are easier to crawl and often rank better, and accessibility is increasingly a legal requirement.',
      eli5: 'Building a site everyone can use also helps Google understand it.',
      why: 'The same structure that serves screen readers (alt text, headings, semantics) feeds search engines - one effort, two wins.',
      example: 'Adding alt text to every photo helps blind users and lets images rank in image search.',
      arch: 'Public-sector clients require accessibility, and alt text also makes an image-heavy portfolio visible to crawlers.',
      question: 'Why do accessibility and SEO reinforce each other, and name three shared practices?',
      practice: 'Write alt text for a photo of a timber stair detail.',
      related: ['seo-heading-hierarchy', 'seo-image-heavy-seo', 'cms-seo-image-alt']
    },

    /* ---------- Website Architecture SEO ---------- */
    {
      id: 'seo-information-architecture', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Information architecture',
      pro: 'Information architecture is how a site content is organized, labeled, and connected - the structure of sections, hierarchy, and navigation. Good IA matches how users and search engines expect to find things, keeps important pages shallow (few clicks deep), and groups related content so authority and relevance flow logically.',
      eli5: 'It is how a website is organized so people can find things easily.',
      why: 'Clear IA helps crawlers understand importance, keeps key pages reachable, and reduces bounce.',
      example: 'Projects, Studio, Services, Journal, Contact - five clear sections, each important page within two clicks.',
      arch: 'Grouping work by typology with a flat path keeps every project close to the home page and easy to crawl.',
      question: 'What does information architecture organize, and why does keeping pages shallow help SEO?',
      practice: 'Sketch the top-level sections for a studio site.',
      related: ['seo-navigation-structure', 'seo-url-structure', 'seo-topic-clusters'],
      v: [['a', 78, 10, 44, 16, 'HOME'], ['ar', 100, 28, 42, 52], ['ar', 100, 28, 100, 52], ['ar', 100, 28, 160, 52], ['b', 18, 54, 48, 16], ['t', 24, 64, 'PROJECTS'], ['b', 78, 54, 44, 16], ['t', 86, 64, 'STUDIO'], ['b', 138, 54, 52, 16], ['t', 144, 64, 'SERVICES'], ['b', 18, 84, 48, 14], ['t', 24, 93, '/[slug]']]
    },
    {
      id: 'seo-navigation-structure', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Navigation structure',
      pro: 'Navigation structure is the system of menus and links that lets users and crawlers move through a site. The main nav signals which pages matter, real anchor links ensure crawlability, and consistent global navigation distributes link equity. Burying pages or using non-link interactions hides them from search.',
      eli5: 'It is the set of menus that take you around the website.',
      why: 'Pages in the main navigation get crawled and weighted as important, while hidden pages get neither.',
      example: 'Promoting Services into the top nav both helps users and signals its importance to search engines.',
      arch: 'Keeping Projects, Studio, and Contact in a clear top nav guarantees they are crawled and prioritized.',
      question: 'How does navigation structure affect both users and crawlers?',
      practice: 'Decide the five items that belong in a studio primary nav.',
      related: ['seo-information-architecture', 'seo-internal-linking', 'seo-breadcrumbs']
    },
    {
      id: 'seo-breadcrumbs', level: 'Beginner', group: 'Website Architecture SEO', title: 'Breadcrumbs',
      pro: 'Breadcrumbs are a secondary navigation trail showing a page position in the hierarchy (Home > Projects > Cultural > Fjord Museum), each level clickable. They orient deep-entry visitors, reduce bounce, and, with breadcrumb structured data, earn a navigable path shown in the search result.',
      eli5: 'They are the little trail of links showing the path back to the home page.',
      why: 'They help users arriving from search go deeper and can appear as a tidy path in the result itself.',
      example: 'A project page breadcrumb links Cultural to the filtered grid of cultural work.',
      arch: 'Projects are common deep-entry points from image search, so breadcrumbs let those visitors explore related work.',
      question: 'What two problems do breadcrumbs solve for search visitors?',
      practice: 'Write the breadcrumb trail for a project three levels deep.',
      related: ['seo-navigation-structure', 'seo-structured-data', 'seo-information-architecture']
    },
    {
      id: 'seo-topic-clusters', level: 'Advanced', group: 'Website Architecture SEO', title: 'Topic clusters',
      pro: 'Topic clusters organize content around a central pillar page covering a broad topic, linked to multiple cluster pages covering subtopics in depth, all interlinked. This structure signals topical authority to search engines and helps a site rank for a whole subject area rather than isolated keywords.',
      eli5: 'It is grouping related pages around one main page so Google sees you as an expert on the topic.',
      why: 'Clusters build topical authority and spread relevance, lifting the whole group rankings.',
      example: 'A pillar on home extensions links to clusters on costs, planning, and materials, all linking back.',
      arch: 'A pillar on adaptive reuse links to individual reuse projects, signaling deep expertise in that typology.',
      question: 'How do topic clusters build authority, and what role does the pillar play?',
      practice: 'Design a pillar and three cluster pages for a studio specialty.',
      related: ['seo-pillar-pages', 'seo-internal-linking', 'seo-landing-pages']
    },
    {
      id: 'seo-pillar-pages', level: 'Advanced', group: 'Website Architecture SEO', title: 'Pillar pages',
      pro: 'A pillar page is a comprehensive, broad overview of a major topic that links out to detailed cluster pages and back. It targets a high-level term, serves as the cluster hub, and accumulates authority from its supporting pages. Pillars are usually long, well-structured, and central to internal linking.',
      eli5: 'It is the big main page about a topic that connects to all the smaller related pages.',
      why: 'Pillars concentrate authority and rank for competitive broad terms while feeding traffic to specifics.',
      example: 'An extensions pillar covers the basics and links to dedicated cost, design, and planning pages.',
      arch: 'A cultural buildings pillar introduces the studio approach and links to each cultural project.',
      question: 'What is a pillar page role in a topic cluster, and why does it gain authority?',
      practice: 'Outline the sections of a pillar page for a studio specialty.',
      related: ['seo-topic-clusters', 'seo-landing-pages', 'seo-internal-linking']
    },
    {
      id: 'seo-landing-pages', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Landing pages',
      pro: 'A landing page is a focused page built to rank for a specific intent and convert visitors toward one action. Effective landing pages match query intent, lead with a clear value statement, provide proof, and end with a single call to action. They underpin service and location targeting.',
      eli5: 'It is a page made to catch people searching for one specific thing and get them to act.',
      why: 'Targeted landing pages capture specific intent far better than generic pages and drive conversions.',
      example: 'A loft conversions in Bristol page targets that exact query with relevant examples and a quote CTA.',
      arch: 'A residential architects in [city] landing page matches local-commercial intent and routes to contact.',
      question: 'What makes a landing page effective, and why does it beat a generic page for specific intent?',
      practice: 'Define the goal and single CTA for a service landing page.',
      related: ['seo-search-intent', 'seo-service-page-strategy', 'seo-service-area-pages']
    },
    {
      id: 'seo-project-pages', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Project pages',
      pro: 'Project pages are the detailed pages for individual works - the core content type of a portfolio site. For SEO they need unique titles and descriptions, real text (brief, process, materials, outcome), optimized images with alt text, structured data, and internal links to related projects and services.',
      eli5: 'They are the pages that show one project in detail.',
      why: 'Project pages are a firm main ranking and conversion asset, but only if they contain crawlable text, not just images.',
      example: 'A project page pairs a photo gallery with a written brief, location, and credits so it can rank.',
      arch: 'Each building gets a page with story and metadata, turning a visual portfolio into searchable content.',
      question: 'What does a project page need beyond images to perform in search?',
      practice: 'List the text sections a crawlable project page should include.',
      related: ['seo-case-studies', 'seo-portfolio-seo', 'seo-project-location-metadata']
    },
    {
      id: 'seo-case-studies', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Case studies',
      pro: 'Case studies are long-form, narrative project pages that document brief, constraints, process, and measurable outcomes. Their depth and unique content make them strong ranking assets and trust builders, often targeting specific problem-based queries and earning links from press and partners.',
      eli5: 'It is the full story of one project: the problem, what was done, and how it turned out.',
      why: 'Their substance ranks well and converts, and their specificity attracts links and qualified visitors.',
      example: 'A flood-resilient museum case study targets flood-resilient public building and earns press links.',
      arch: 'A case study proving a tricky planning win attracts clients facing the same constraint.',
      question: 'Why are case studies strong SEO and trust assets compared with a gallery?',
      practice: 'Outline a five-part case-study structure for a renovation.',
      related: ['seo-project-pages', 'seo-topic-clusters', 'seo-portfolio-seo']
    },
    {
      id: 'seo-portfolio-seo', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Portfolio SEO',
      pro: 'Portfolio SEO is the practice of making an image-led body of work discoverable: crawlable project pages with real text, optimized images and alt text, logical structure and internal linking, structured data, and filters that produce stable, indexable URLs rather than JS-only states.',
      eli5: 'It is making a gallery of work show up in search, not just look pretty.',
      why: 'Beautiful portfolios often rank poorly because they are all images, and portfolio SEO fixes the invisibility.',
      example: 'Adding text, alt attributes, and crawlable filter URLs takes a silent portfolio into search results.',
      arch: 'A studio stunning but text-free site gets project descriptions and metadata so juries can find it.',
      question: 'Why do portfolios often underperform in search, and what does portfolio SEO add?',
      practice: 'List three changes that make an image-only portfolio crawlable.',
      related: ['seo-image-heavy-seo', 'seo-beautiful-invisible', 'seo-project-pages']
    },
    {
      id: 'seo-local-seo', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Local SEO',
      pro: 'Local SEO improves visibility for location-based searches and the map pack. It relies on a complete Google Business Profile, consistent name, address, and phone (NAP) across the web, local landing pages, LocalBusiness structured data, and reviews. It is decisive for service businesses chosen by region.',
      eli5: 'It is how a business shows up when people search for something near me.',
      why: 'Many clients search locally, so ranking in the map pack and local results wins nearby commissions.',
      example: 'A complete Business Profile plus a city landing page lifts a studio into the local map results.',
      arch: 'Most architecture clients hire regionally, so local SEO often matters more than national rankings.',
      question: 'What are the main levers of local SEO, and why does it matter for regional firms?',
      practice: 'List three local-SEO signals an architecture firm should get right.',
      related: ['seo-service-area-pages', 'seo-local-search-visibility', 'seo-schema-org']
    },
    {
      id: 'seo-service-area-pages', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Service-area pages',
      pro: 'Service-area pages target specific locations a business serves, each ranking for [service] in [place] queries with genuinely localized content - local projects, context, and contact. Done well they capture regional intent, but done as thin templated duplicates they fail and look spammy.',
      eli5: 'They are pages for each town or area you work in.',
      why: 'They capture location-specific searches a single generic page cannot, but only with unique local content.',
      example: 'Separate, distinct pages for Bristol and Bath each show local projects and context.',
      arch: 'A regional studio creates a page per served city, each featuring real projects there.',
      question: 'What makes service-area pages work, and what makes them fail?',
      practice: 'Explain why templated near-identical location pages backfire.',
      related: ['seo-local-seo', 'seo-location-project-pages', 'seo-landing-pages']
    },
    {
      id: 'seo-project-location-metadata', level: 'Intermediate', group: 'Website Architecture SEO', title: 'Project location metadata',
      pro: 'Project location metadata is the structured location information attached to a project - city, region, coordinates - used in content, structured data (Place and geo), and internal linking. It connects projects to local searches and lets a site group and surface work by place.',
      eli5: 'It is tagging each project with where it is, so it can show up in local searches.',
      why: 'Location data ties visual work to geographic intent, helping projects rank for place-based queries.',
      example: 'Tagging a project with its city lets it appear under that city page and in local results.',
      arch: 'Geo-tagging projects powers a work in [region] view that captures local client searches.',
      question: 'How does project location metadata help, and where is it used?',
      practice: 'List the location fields you would add to a project content type.',
      related: ['seo-location-project-pages', 'seo-local-seo', 'backend-content-model']
    },

    /* ---------- Backend & Infrastructure ---------- */
    {
      id: 'backend-backend', level: 'Beginner', group: 'Backend & Infrastructure', title: 'Backend',
      pro: 'The backend is the server-side part of a web application: databases, application logic, APIs, and infrastructure the user does not see directly. It stores and processes data, enforces rules and security, and serves content to the frontend. For SEO it affects what HTML is delivered, how fast, and at what URLs.',
      eli5: 'It is the behind-the-scenes part of a website that does the thinking and storing.',
      why: 'The backend decides how pages are generated and delivered, which underpins speed, rendering, and crawlability.',
      example: 'The backend pulls projects from a database and renders the HTML the browser and crawler receive.',
      arch: 'A studio CMS backend stores projects and outputs the pages that search engines index.',
      question: 'What does the backend do, and why does it affect SEO outcomes?',
      practice: 'Name two backend responsibilities that influence SEO.',
      related: ['backend-frontend', 'backend-server', 'backend-database']
    },
    {
      id: 'backend-frontend', level: 'Beginner', group: 'Backend & Infrastructure', title: 'Frontend',
      pro: 'The frontend is everything that runs in the browser: HTML, CSS, and JavaScript that render the interface a user sees and interacts with. It determines layout, performance perception, and whether content is present in the HTML or built by client JS - a key SEO concern.',
      eli5: 'It is the part of the website you actually see and click on.',
      why: 'Frontend choices (especially how much depends on JavaScript) directly affect speed metrics and crawlability.',
      example: 'A frontend that renders project text server-side ensures crawlers see it without running scripts.',
      arch: 'A portfolio frontend must show photos beautifully while keeping content in crawlable HTML.',
      question: 'What is the frontend responsible for, and how can it help or hurt SEO?',
      practice: 'Explain why frontend rendering choices matter for crawlers.',
      related: ['backend-backend', 'seo-javascript-seo', 'seo-page-speed']
    },
    {
      id: 'backend-api', level: 'Beginner', group: 'Backend & Infrastructure', title: 'API',
      pro: 'An API (Application Programming Interface) is a defined way for software systems to request and exchange data. A web frontend or build process calls APIs to fetch content (like CMS data) and present it as pages. APIs decouple where content lives from how it is displayed.',
      eli5: 'It is a way for two programs to talk and pass information to each other.',
      why: 'APIs are how modern sites pull content (for example from a headless CMS) to build pages, which shapes rendering and SEO.',
      example: 'At build time the site calls the CMS API to fetch all projects and generate their pages.',
      arch: 'A studio site requests project data from its CMS API, then renders crawlable project pages.',
      question: 'What does an API do, and why is it central to CMS-driven sites?',
      practice: 'Describe one API call a portfolio site makes to build its pages.',
      related: ['backend-rest-api', 'backend-graphql', 'cms-headless-cms'],
      v: [['b', 10, 40, 56, 40], ['t', 18, 62, 'BROWSER'], ['ar', 70, 52, 128, 52], ['t', 82, 46, 'request'], ['ar', 128, 68, 70, 68], ['t', 86, 82, 'JSON'], ['b', 132, 40, 56, 40], ['t', 150, 62, 'API']]
    },
    {
      id: 'backend-rest-api', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'REST API',
      pro: 'A REST API exposes data as resources at URLs (for example /api/projects/123) accessed with HTTP methods (GET, POST, PUT, DELETE). It is the most common web API style: predictable, cacheable, and stateless. Clients fetch the endpoints they need, sometimes over- or under-fetching data.',
      eli5: 'It is a common set of rules for asking a server for things using web addresses.',
      why: 'Most CMSs and services expose REST APIs, so understanding them is fundamental to integrating content.',
      example: 'GET /api/projects returns the project list the site renders into a grid.',
      arch: 'The portfolio fetches GET /api/projects from the CMS to build the work index.',
      question: 'How does a REST API structure data and actions, and what is a known limitation?',
      practice: 'Write the REST endpoint and method to fetch one project.',
      related: ['backend-api', 'backend-graphql', 'backend-api-routes']
    },
    {
      id: 'backend-graphql', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'GraphQL',
      pro: 'GraphQL is an API query language where the client requests exactly the fields it needs from a single endpoint, avoiding over- and under-fetching. It returns predictable, shaped responses and is common in headless CMSs. It adds flexibility at the cost of more complex caching than REST.',
      eli5: 'It lets a program ask for exactly the data it wants, no more and no less.',
      why: 'It efficiently fetches just the fields a page needs, useful for content-rich, performance-sensitive sites.',
      example: 'One query asks for each project title, slug, and hero image - nothing extra.',
      arch: 'A portfolio queries only the fields the grid needs, keeping payloads small and fast.',
      question: 'What problem does GraphQL solve versus REST, and what does it trade away?',
      practice: 'List the fields a project grid query actually needs.',
      related: ['backend-rest-api', 'backend-api', 'cms-headless-cms']
    },
    {
      id: 'backend-database', level: 'Beginner', group: 'Backend & Infrastructure', title: 'Database',
      pro: 'A database stores structured information so it can be queried, updated, and retrieved reliably. Web applications store content, users, and settings in databases. The data model (tables or collections and relationships) shapes what content exists and how efficiently pages can be built.',
      eli5: 'It is an organized place where a website keeps all its information.',
      why: 'Content lives in the database, so how it is structured affects what pages can exist and how fast they build.',
      example: 'Projects, categories, and images are stored in a database the site reads to render pages.',
      arch: 'A studio projects, with their fields and relationships, live in a database the CMS manages.',
      question: 'What does a database provide, and why does its structure affect the site?',
      practice: 'Name three things a portfolio site stores in a database.',
      related: ['backend-sql', 'backend-postgresql', 'backend-content-model'],
      v: [['f', 30, 18, 80, 16], ['b', 30, 26, 80, 64], ['f', 30, 82, 80, 14], ['t', 50, 56, 'DATABASE'], ['ar', 114, 56, 150, 56], ['b', 150, 42, 40, 28], ['t', 158, 59, 'SITE']]
    },
    {
      id: 'backend-sql', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'SQL',
      pro: 'SQL (Structured Query Language) is the standard language for querying and manipulating relational databases: selecting, filtering, joining, and aggregating data across tables. It powers most content retrieval behind the scenes, and efficient, indexed queries keep page generation fast.',
      eli5: 'It is the language used to ask a database questions and get answers.',
      why: 'SQL retrieves the content pages need, so slow or unindexed queries slow down the whole site.',
      example: 'A query selecting cultural projects ordered by year newest-first builds the cultural grid.',
      arch: 'A query joins projects to their images to render a case study in one request.',
      question: 'What is SQL used for, and how can it affect site performance?',
      practice: 'Describe in words a query that lists projects newest-first.',
      related: ['backend-database', 'backend-postgresql', 'backend-caching']
    },
    {
      id: 'backend-postgresql', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'PostgreSQL',
      pro: 'PostgreSQL is a powerful open-source relational database known for reliability, standards compliance, and rich features (JSON support, full-text search, and geospatial via PostGIS). It is a common choice for production web backends and can power site search and location features directly.',
      eli5: 'It is a popular, dependable type of database many websites use.',
      why: 'It is a robust default for production data, and features like full-text and geo search can support on-site search and local features.',
      example: 'A site stores projects in PostgreSQL and uses its full-text search for an on-site search box.',
      arch: 'PostGIS lets a studio query projects by distance for a work near you map.',
      question: 'Why is PostgreSQL a common production choice, and name one advanced feature it offers?',
      practice: 'Name one PostgreSQL feature useful for a location-aware portfolio.',
      related: ['backend-database', 'backend-sql', 'seo-local-seo']
    },
    {
      id: 'backend-content-model', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Content model',
      pro: 'A content model defines the structure of content: the types (Project, Person, Service), their fields (title, slug, images, SEO fields), and relationships. It is the foundation of a CMS - a good model makes content consistent, reusable, and ready to map cleanly onto pages and metadata.',
      eli5: 'It is the blueprint for what information each thing on the site has.',
      why: 'The content model determines what data exists for pages and SEO, so a weak model limits everything downstream.',
      example: 'A Project type with title, slug, gallery, type, year, and SEO fields powers all project pages.',
      arch: 'Designing the Project model well lets the studio publish consistent, SEO-ready projects forever.',
      question: 'What does a content model define, and why is it the foundational design decision?',
      practice: 'List eight fields for a Project content type.',
      related: ['cms-content-type', 'cms-field', 'backend-database']
    },
    {
      id: 'backend-authentication', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Authentication',
      pro: 'Authentication verifies who a user is - typically via login credentials, tokens, or single sign-on. On a content site it protects the CMS admin and preview environments. Authenticated areas should be kept out of search via robots rules and noindex so private content is never indexed.',
      eli5: 'It is checking that you are who you say you are, like showing an ID to log in.',
      why: 'It secures the CMS and previews, and misconfiguration can either lock out editors or leak private pages to search.',
      example: 'Editors log into the CMS with credentials before they can publish projects.',
      arch: 'Only authenticated staff can edit the studio projects and see unpublished work.',
      question: 'What does authentication establish, and why keep authenticated areas out of search?',
      practice: 'Explain why a CMS login page should not be indexed.',
      related: ['backend-authorization', 'cms-roles-permissions', 'seo-robots-txt']
    },
    {
      id: 'backend-authorization', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Authorization',
      pro: 'Authorization determines what an authenticated user is allowed to do - which content they can view, edit, or publish. It enforces roles and permissions (editor versus admin) so people only act within their remit. It is distinct from authentication (who you are) and is central to safe editorial workflows.',
      eli5: 'It is deciding what you are allowed to do once you have logged in.',
      why: 'It prevents accidental or unauthorized changes and underpins multi-person editorial safety.',
      example: 'An editor can draft projects but only an admin can change global SEO settings.',
      arch: 'Junior staff edit project copy while only a partner can alter site-wide metadata.',
      question: 'How does authorization differ from authentication, and what does it protect?',
      practice: 'Define two roles and what each may and may not do in a CMS.',
      related: ['backend-authentication', 'cms-roles-permissions', 'cms-editorial-workflow']
    },
    {
      id: 'backend-server', level: 'Beginner', group: 'Backend & Infrastructure', title: 'Server',
      pro: 'A server is a computer that receives requests and returns responses - web pages, data, or files. Its location, speed, and response time (time to first byte) affect how quickly content reaches users and crawlers. Modern sites often use edge servers and CDNs to put responses physically close to each visitor.',
      eli5: 'It is a computer that sends web pages to people when they ask for them.',
      why: 'Server response time is the first part of page speed, so a slow server delays everything that follows.',
      example: 'Moving to a faster host cuts time to first byte, improving LCP and overall speed.',
      arch: 'Serving a studio pages from edge servers keeps photography fast for visitors worldwide.',
      question: 'What does a server do, and how does it influence page speed?',
      practice: 'Explain why time to first byte matters for LCP.',
      related: ['backend-cdn', 'backend-edge-functions', 'seo-page-speed']
    },
    {
      id: 'backend-cdn', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'CDN',
      pro: 'A CDN (Content Delivery Network) is a global network of edge servers that cache and serve static assets (images, CSS, JS, static pages) from a location near each visitor. It dramatically reduces latency and offloads the origin server, which is critical for image-heavy, globally viewed sites.',
      eli5: 'It is copies of your website kept around the world so it loads fast everywhere.',
      why: 'A CDN is one of the biggest speed wins, especially for heavy images and distant visitors.',
      example: 'Project photos are served from the nearest edge node, loading fast for a juror overseas.',
      arch: 'A studio heavy portfolio images load quickly for international clients via the CDN.',
      question: 'What does a CDN do, and why is it vital for image-heavy global sites?',
      practice: 'Name the asset types a CDN typically caches.',
      related: ['backend-caching', 'backend-edge-functions', 'seo-image-optimization']
    },
    {
      id: 'backend-caching', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Caching',
      pro: 'Caching stores copies of computed or fetched data so repeat requests are served fast without redoing work - at the browser, CDN, server, or database layer. Correct caching (with sensible cache headers and invalidation) is a major speed lever, while stale caches can serve outdated content if not invalidated on publish.',
      eli5: 'It is keeping a ready-made copy so you do not have to build the same thing again.',
      why: 'Caching slashes load times and server cost, but it needs invalidation so updates appear when content changes.',
      example: 'Cached project pages serve instantly, and publishing a change invalidates and rebuilds the affected page.',
      arch: 'A studio static pages are cached at the edge, so visits are near-instant between updates.',
      question: 'What does caching speed up, and what risk comes from missing invalidation?',
      practice: 'Explain what should happen to a cached page when its content is updated.',
      related: ['backend-cdn', 'seo-page-speed', 'backend-webhooks']
    },
    {
      id: 'backend-edge-functions', level: 'Advanced', group: 'Backend & Infrastructure', title: 'Edge functions',
      pro: 'Edge functions run small pieces of server logic at CDN edge locations close to users, enabling fast dynamic behavior - redirects, personalization, A/B tests, auth checks - without a round trip to a central server. They keep latency low while adding logic to otherwise static delivery.',
      eli5: 'It is little bits of server code that run close to the visitor for speed.',
      why: 'They allow dynamic features (like redirects or localization) without sacrificing edge speed.',
      example: 'An edge function performs geolocation-based language redirects in milliseconds.',
      arch: 'An edge function 301-redirects old project URLs globally without a slow central server.',
      question: 'What do edge functions enable, and why are they fast?',
      practice: 'Name one SEO task well suited to an edge function.',
      related: ['backend-cdn', 'backend-serverless-functions', 'seo-redirects']
    },
    {
      id: 'backend-webhooks', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Webhooks',
      pro: 'A webhook is an automated HTTP callback: one system notifies another when an event happens (for example content published), triggering an action. They connect a CMS to a build and deploy pipeline so publishing content automatically rebuilds and deploys the affected pages.',
      eli5: 'It is an automatic message one app sends another when something happens.',
      why: 'Webhooks are how a CMS publish triggers a rebuild, keeping static sites fresh without manual deploys.',
      example: 'Publishing a project fires a webhook that rebuilds the site and updates the sitemap.',
      arch: 'When the office manager publishes a new project, a webhook redeploys the portfolio automatically.',
      question: 'What is a webhook, and how does it link a CMS to deployment?',
      practice: 'Describe the webhook flow from publish to live page.',
      related: ['backend-deployment-pipeline', 'backend-build-step', 'cms-draft-publish']
    },
    {
      id: 'backend-build-step', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Build step',
      pro: 'The build step transforms source code and content into optimized, deployable output: compiling, bundling and minifying assets, generating static pages, optimizing images, and producing sitemaps. For static and hybrid sites, the build is where content is fetched and pages (and SEO files) are generated.',
      eli5: 'It is the step that turns the code and content into the finished website files.',
      why: 'The build is where pages, optimized assets, sitemaps, and metadata are produced - it shapes performance and SEO output.',
      example: 'The build fetches CMS projects, generates each project page, and writes sitemap.xml.',
      arch: 'A studio build regenerates all project pages and the sitemap whenever content changes.',
      question: 'What happens during a build step, and which SEO artifacts does it produce?',
      practice: 'List three outputs a build step generates for SEO.',
      related: ['backend-deployment-pipeline', 'seo-ssg', 'cms-seo-sitemap-generation']
    },
    {
      id: 'backend-deployment-pipeline', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Deployment pipeline',
      pro: 'A deployment pipeline automates moving code and content from source to live: build, test, and release, ideally on every change, with preview environments and rollback. It makes publishing reliable and fast, so a content update becomes a safe, repeatable, automated event rather than a manual risk.',
      eli5: 'It is the automatic assembly line that puts new versions of the site online.',
      why: 'Automated, reversible deploys let teams publish often and safely, with previews for approval.',
      example: 'Push to main triggers build, checks, and deploy, and the site is live in 90 seconds with rollback available.',
      arch: 'A studio publishes a project the morning an embargo lifts as one click, not a developer favor.',
      question: 'What stages make up a deployment pipeline, and what do previews and rollback provide?',
      practice: 'Describe your rollback plan if a deploy breaks the project grid.',
      related: ['backend-build-step', 'backend-webhooks', 'backend-environment-variables']
    },
    {
      id: 'backend-environment-variables', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'Environment variables',
      pro: 'Environment variables are configuration values stored outside the code - API keys, database URLs, environment flags - injected at build or runtime. They keep secrets out of source control and let the same code run differently in development, preview, and production (for example pointing at draft versus published content).',
      eli5: 'They are secret settings kept outside the code, like passwords on a separate note.',
      why: 'They protect secrets and let one codebase behave correctly across environments, including SEO-relevant flags like noindex on staging.',
      example: 'A site URL variable sets canonical URLs correctly per environment.',
      arch: 'Staging uses an env flag to noindex everything so unfinished projects never reach search.',
      question: 'What do environment variables store, and why keep them out of the code?',
      practice: 'Name one SEO setting worth controlling with an environment variable.',
      related: ['backend-deployment-pipeline', 'cms-preview-mode', 'seo-canonical-url']
    },
    {
      id: 'backend-api-routes', level: 'Intermediate', group: 'Backend & Infrastructure', title: 'API routes',
      pro: 'API routes are server-side endpoints hosted within the web application itself (for example /api/contact) that handle requests like form submissions, search, or webhooks. They let a frontend perform server actions securely without a separate backend service, and they must be excluded from indexing.',
      eli5: 'They are little server doors in the website that handle jobs like sending a form.',
      why: 'They power dynamic features (contact forms, search) on otherwise static sites without a separate server.',
      example: 'A /api/contact route validates and emails an inquiry from the contact form.',
      arch: 'A studio contact form posts to an API route that sends the inquiry to the office inbox.',
      question: 'What are API routes used for, and why should they not be indexed?',
      practice: 'Name two features an API route could power on a portfolio.',
      related: ['backend-serverless-functions', 'backend-rest-api', 'seo-robots-txt']
    },
    {
      id: 'backend-serverless-functions', level: 'Advanced', group: 'Backend & Infrastructure', title: 'Serverless functions',
      pro: 'Serverless functions are small, single-purpose backend functions that run on demand without managing servers, scaling automatically and billing per execution. They handle dynamic tasks (form processing, on-demand revalidation, integrations) for mostly-static sites, keeping infrastructure simple and cheap.',
      eli5: 'It is server code that runs only when needed, with no server to look after.',
      why: 'They add backend capability to static sites without running and scaling servers, ideal for occasional dynamic needs.',
      example: 'A serverless function handles contact submissions and triggers a notification.',
      arch: 'A studio site uses a serverless function to process inquiries without maintaining any server.',
      question: 'What are serverless functions good for, and what is their main operational benefit?',
      practice: 'Name a portfolio task suited to a serverless function.',
      related: ['backend-edge-functions', 'backend-api-routes', 'backend-deployment-pipeline']
    },

    /* ---------- CMS Concepts ---------- */
    {
      id: 'cms-cms', level: 'Beginner', group: 'CMS Concepts', title: 'CMS',
      pro: 'A CMS (Content Management System) lets non-developers create, edit, and manage content through an admin interface, separating content from presentation. The site renders that content through templates. A good CMS makes publishing fast and safe and is the engine behind most content-driven SEO.',
      eli5: 'It is a control room where you type in new content and the website updates itself.',
      why: 'It lets a team publish and update pages (and their SEO) without touching code, keeping the site fresh.',
      example: 'An editor adds a project in the CMS and the grid and case-study pages render automatically.',
      arch: 'A studio publishes a new project a month via the CMS instead of waiting for a developer.',
      question: 'What does a CMS separate, and who does it empower?',
      practice: 'List two tasks a CMS lets a non-developer do.',
      related: ['cms-headless-cms', 'cms-traditional-cms', 'backend-content-model']
    },
    {
      id: 'cms-headless-cms', level: 'Intermediate', group: 'CMS Concepts', title: 'Headless CMS',
      pro: 'A headless CMS manages content but has no built-in frontend; it exposes content via APIs (REST or GraphQL) for any frontend to consume. This decoupling gives developers full control of presentation and performance (for example static generation) while editors get a clean content interface. Examples include Sanity, Contentful, and Strapi.',
      eli5: 'It is a content control room with no website attached, so your site fetches the content and shows it.',
      why: 'It lets you build a fast, custom, SEO-optimized frontend while keeping easy content editing.',
      example: 'The site statically builds project pages from a headless CMS API at deploy time.',
      arch: 'A studio uses a headless CMS for content and a custom static frontend for award-grade speed and design.',
      question: 'What does a headless CMS provide and omit, and why pair it with a custom frontend?',
      practice: 'Explain one SEO advantage of a headless CMS plus static generation.',
      related: ['cms-traditional-cms', 'backend-api', 'seo-ssg'],
      v: [['b', 8, 40, 50, 40], ['t', 16, 62, 'CMS'], ['ar', 60, 60, 86, 60], ['b', 88, 40, 30, 40], ['t', 94, 62, 'API'], ['ar', 120, 60, 146, 60], ['i', 150, 40, 44, 40], ['t', 150, 92, 'FRONTEND']]
    },
    {
      id: 'cms-traditional-cms', level: 'Intermediate', group: 'CMS Concepts', title: 'Traditional CMS',
      pro: 'A traditional (coupled or monolithic) CMS manages content and renders the frontend together - WordPress is the archetype. It is fast to launch with themes and plugins and friendly to editors, but it couples design to the CMS and can carry performance and security overhead unless carefully managed.',
      eli5: 'It is an all-in-one system that both stores content and builds the website.',
      why: 'It is the most common, approachable option, but its coupling can limit performance and flexibility versus headless.',
      example: 'A WordPress site uses a theme and SEO plugin to manage and render pages together.',
      arch: 'A small studio launches quickly on WordPress with a portfolio theme and an SEO plugin.',
      question: 'How does a traditional CMS differ from headless, and what are its tradeoffs?',
      practice: 'List one advantage and one drawback of a traditional CMS.',
      related: ['cms-headless-cms', 'cms-cms', 'seo-page-speed']
    },
    {
      id: 'cms-content-type', level: 'Intermediate', group: 'CMS Concepts', title: 'Content type',
      pro: 'A content type (or model) defines a category of content and its fields - for example a Project type with title, slug, images, and SEO fields. Content types make entries consistent and let templates render them uniformly. They are the schema editors fill in and developers map to pages.',
      eli5: 'It is a template that says what fields a certain kind of content has.',
      why: 'Well-defined content types keep content structured and consistent, which is essential for reliable templates and SEO.',
      example: 'A Project content type ensures every project has the same fields the page template expects.',
      arch: 'Defining Project, Person, and Service types keeps the studio content tidy and renderable.',
      question: 'What does a content type define, and why does consistency matter?',
      practice: 'Define the fields of a Person content type for a studio.',
      related: ['backend-content-model', 'cms-field', 'cms-collection']
    },
    {
      id: 'cms-collection', level: 'Intermediate', group: 'CMS Concepts', title: 'Collection',
      pro: 'A collection is a group of entries of the same content type - all Projects, all Posts. Collections power list and index pages, filtering, and pagination, and they map naturally to dynamic routes (one detail page per entry). They are how a CMS organizes many items of one kind.',
      eli5: 'It is a folder holding all the items of one kind, like all the projects.',
      why: 'Collections drive index pages and dynamic routing, so their size and structure shape navigation and crawlability.',
      example: 'The Projects collection renders the grid and generates a page for each project.',
      arch: 'The studio Projects collection produces both the work index and every individual project page.',
      question: 'What is a collection, and how does it relate to index pages and routing?',
      practice: 'Name two collections a studio site would have.',
      related: ['cms-entry', 'cms-content-type', 'cms-dynamic-pages']
    },
    {
      id: 'cms-entry', level: 'Beginner', group: 'CMS Concepts', title: 'Entry',
      pro: 'An entry (or item or record) is a single piece of content of a given type - one project, one team member. Each entry holds the field values that a template renders into a page. Entries are what editors create, edit, draft, and publish.',
      eli5: 'It is one single item, like one project in the list of projects.',
      why: 'Entries are the unit editors work with, and each typically becomes one page, so their fields drive that page content and SEO.',
      example: 'The Fjord Museum entry holds the title, images, and SEO fields for its page.',
      arch: 'Each building the studio adds is one entry that becomes one project page.',
      question: 'What is an entry, and what does it usually become on the site?',
      practice: 'Describe what one entry of a Project type contains.',
      related: ['cms-collection', 'cms-field', 'cms-content-type']
    },
    {
      id: 'cms-field', level: 'Beginner', group: 'CMS Concepts', title: 'Field',
      pro: 'A field is a single piece of data within an entry - a text field, image, date, reference, or boolean. Fields define what information an entry holds and how editors input it. Choosing the right field types (and validations) keeps content clean and maps directly to page elements and metadata.',
      eli5: 'It is one box you fill in, like the title or the date.',
      why: 'Fields are the building blocks of content, so the right fields ensure pages and SEO tags have the data they need.',
      example: 'A hero image field and a meta description field feed the page banner and its search snippet.',
      arch: 'A project year and location fields populate both the page and its local SEO.',
      question: 'What is a field, and why does choosing field types carefully matter?',
      practice: 'List five fields and their types for a Project entry.',
      related: ['cms-rich-text-field', 'cms-seo-fields', 'cms-content-type']
    },
    {
      id: 'cms-rich-text-field', level: 'Intermediate', group: 'CMS Concepts', title: 'Rich text field',
      pro: 'A rich text field stores formatted content - headings, lists, links, embeds - usually as structured data (portable text or a document tree) rather than raw HTML. Structured rich text lets the frontend render semantic, consistent markup (proper headings and links) that is good for accessibility and SEO.',
      eli5: 'It is a writing box where you can make headings, bold text, and links.',
      why: 'Structured rich text produces clean semantic HTML, supporting heading hierarchy and crawlable links rather than messy markup.',
      example: 'A case-study body uses a rich text field rendered into proper H2s and real links.',
      arch: 'A project narrative is authored in rich text and rendered with correct headings for SEO.',
      question: 'Why is structured rich text better than raw HTML for SEO and accessibility?',
      practice: 'Name two formatting features a rich text field should support.',
      related: ['seo-heading-hierarchy', 'cms-field', 'cms-reusable-components']
    },
    {
      id: 'cms-media-library', level: 'Beginner', group: 'CMS Concepts', title: 'Media library',
      pro: 'A media library is the CMS central store for images, video, and files, where assets are uploaded, organized, reused, and given metadata like alt text. Centralizing media enables consistent optimization, reuse across entries, and managed alt text - all important for performance and image SEO.',
      eli5: 'It is the website photo and file cupboard.',
      why: 'A central library makes image optimization and alt text manageable at scale, which matters hugely for image-led sites.',
      example: 'All project photos live in the media library with alt text set once and reused.',
      arch: 'A studio photography is stored and tagged centrally, feeding optimized images to every page.',
      question: 'What does a media library centralize, and why does that help SEO?',
      practice: 'Explain why setting alt text in the media library scales better.',
      related: ['cms-asset-optimization', 'seo-image-optimization', 'cms-seo-image-alt']
    },
    {
      id: 'cms-asset-optimization', level: 'Intermediate', group: 'CMS Concepts', title: 'Asset optimization',
      pro: 'Asset optimization in a CMS automatically transforms uploaded media into efficient delivery formats and sizes - generating responsive widths, modern formats (AVIF and WebP), and serving via a CDN, often with on-the-fly transformations. It ensures heavy originals never reach the browser unoptimized.',
      eli5: 'It is the CMS automatically making uploaded pictures fast to load.',
      why: 'It guarantees performance even when editors upload huge originals, removing a major manual SEO chore.',
      example: 'An editor uploads a 10MB photo and the CMS serves a 180KB AVIF at the right size automatically.',
      arch: 'Studio staff upload full-resolution photography and the CMS handles all optimization.',
      question: 'What does CMS asset optimization automate, and why does it protect performance?',
      practice: 'Describe the journey of an uploaded image to an optimized delivery.',
      related: ['cms-media-library', 'seo-image-optimization', 'backend-cdn']
    },
    {
      id: 'cms-draft-publish', level: 'Beginner', group: 'CMS Concepts', title: 'Draft and publish workflow',
      pro: 'The draft-and-publish workflow separates work-in-progress (drafts, invisible to the public) from published content (live). Editors prepare and review drafts, then publish when ready, often triggering a rebuild. This prevents half-finished or unproofed content - including its SEO - from appearing or being indexed.',
      eli5: 'It lets you work on a page privately and only show it when it is ready.',
      why: 'It keeps unfinished content and incorrect metadata out of the public site and search index until intentionally released.',
      example: 'A project stays in draft while photos are chosen, then publishing makes it live and crawlable.',
      arch: 'A new project is drafted and proofed before its embargo, then published in one click.',
      question: 'What does the draft-and-publish split prevent, and what does publishing trigger?',
      practice: 'Explain why drafts should never be indexed.',
      related: ['cms-preview-mode', 'cms-editorial-workflow', 'backend-webhooks']
    },
    {
      id: 'cms-preview-mode', level: 'Intermediate', group: 'CMS Concepts', title: 'Preview mode',
      pro: 'Preview mode lets editors see draft content rendered in the real site layout before publishing, usually via a secure, non-indexed preview URL that fetches draft data. It catches layout, image, and metadata problems early. Preview environments must be excluded from search so drafts are never indexed.',
      eli5: 'It lets you see how a page will really look before you make it public.',
      why: 'It prevents publishing surprises and lets editors verify SEO fields in context - safely, without exposing drafts to search.',
      example: 'An editor opens a preview link to check the hero crop and meta title before publishing.',
      arch: 'A partner reviews a draft project on a private preview URL before it goes live.',
      question: 'What does preview mode show, and why must previews be non-indexable?',
      practice: 'Explain one risk preview mode helps catch before publishing.',
      related: ['cms-draft-publish', 'backend-environment-variables', 'cms-seo-preview-mode']
    },
    {
      id: 'cms-editorial-workflow', level: 'Intermediate', group: 'CMS Concepts', title: 'Editorial workflow',
      pro: 'An editorial workflow is the defined path content takes from creation to publication - draft, review, approval, publish - often with assigned roles and statuses. It enforces quality control and accountability, ensuring content (and its SEO) is checked before it reaches the public.',
      eli5: 'It is the steps content goes through before it is allowed to go live.',
      why: 'It builds in review so mistakes - including SEO errors - are caught before publishing, especially in larger teams.',
      example: 'A junior drafts, an editor reviews, a partner approves, then it publishes.',
      arch: 'Project copy passes from staff draft to partner approval before going public.',
      question: 'What stages does an editorial workflow add, and what does it guarantee?',
      practice: 'Define a three-step workflow for publishing a project.',
      related: ['cms-roles-permissions', 'cms-draft-publish', 'backend-authorization']
    },
    {
      id: 'cms-roles-permissions', level: 'Intermediate', group: 'CMS Concepts', title: 'Roles and permissions',
      pro: 'Roles and permissions control who can do what in a CMS - view, edit, publish, or change settings - by assigning users to roles (editor, admin). They protect critical configuration (like global SEO settings) from accidental change and enforce the editorial workflow safely.',
      eli5: 'It is giving each person the right keys for what they are allowed to change.',
      why: 'They prevent accidental damage to important settings and keep multi-person editing safe and orderly.',
      example: 'Editors can publish projects but cannot edit site-wide SEO defaults, while only admins can.',
      arch: 'Studio staff manage projects while a partner controls global metadata and redirects.',
      question: 'What do roles and permissions protect, and how do they support workflow?',
      practice: 'Assign three CMS abilities to either an editor or an admin role.',
      related: ['cms-editorial-workflow', 'backend-authorization', 'cms-global-settings']
    },
    {
      id: 'cms-slug-field', level: 'Intermediate', group: 'CMS Concepts', title: 'Slug field',
      pro: 'A slug field stores an entry URL segment, usually auto-generated from the title but editable and lockable. It is the bridge between content and routing: the slug becomes part of the page URL. Good CMSs warn on changes and can keep history to create redirects automatically.',
      eli5: 'It is the box that holds the readable end of the page web address.',
      why: 'The slug field controls each page URL, so managing it well (lock, redirect on change) protects links and rankings.',
      example: 'The CMS generates fjord-museum from the title and locks it before publishing.',
      arch: 'Each project slug field sets its permanent /projects/[slug] URL for press and awards.',
      question: 'What does the slug field control, and what should happen when it changes?',
      practice: 'Describe how a CMS should handle a changed slug.',
      related: ['seo-slugs', 'cms-seo-dynamic-slugs', 'seo-url-structure']
    },
    {
      id: 'cms-seo-fields', level: 'Intermediate', group: 'CMS Concepts', title: 'SEO fields',
      pro: 'SEO fields are dedicated content fields for search metadata - meta title, meta description, canonical override, OG image, and a noindex toggle - on each entry. They let editors control how a page appears in search and social, with sensible auto-generated defaults and length guidance, without touching code.',
      eli5: 'They are the boxes where you write how a page should look in Google and shares.',
      why: 'They put per-page SEO in editors hands safely, so every page can have a tailored title, description, and share image.',
      example: 'A project entry has SEO fields setting its title, description, and OG image.',
      arch: 'Studio editors fine-tune each project search snippet and share image via SEO fields.',
      question: 'What do SEO fields let editors control, and why include defaults and guidance?',
      practice: 'List the SEO fields you would add to every content type.',
      related: ['seo-meta-title', 'seo-open-graph', 'cms-seo-fields-to-meta']
    },
    {
      id: 'cms-global-settings', level: 'Intermediate', group: 'CMS Concepts', title: 'Global settings',
      pro: 'Global settings are site-wide configuration stored in the CMS - default meta templates, social handles, organization schema, fallback OG image, navigation, and robots defaults. They provide consistent defaults across all pages and a single place to manage sitewide SEO and branding.',
      eli5: 'They are the website-wide settings that apply to every page.',
      why: 'They centralize sitewide SEO and identity, so defaults stay consistent and are changed in one place.',
      example: 'A global title template applied to every page automatically keeps branding consistent.',
      arch: 'The studio organization schema and default share image live in global settings.',
      question: 'What belongs in global settings, and what consistency do they provide?',
      practice: 'Name three sitewide SEO values worth storing as global settings.',
      related: ['cms-seo-fields', 'seo-structured-data', 'cms-roles-permissions']
    },
    {
      id: 'cms-reusable-components', level: 'Intermediate', group: 'CMS Concepts', title: 'Reusable components',
      pro: 'Reusable components (blocks or modules) are configurable content pieces editors can place and rearrange within a page - hero, gallery, quote, CTA. They give editorial flexibility while keeping markup consistent and semantic, so pages stay on-brand and SEO-clean regardless of who assembles them.',
      eli5: 'They are ready-made building blocks editors snap together to make a page.',
      why: 'They let editors compose pages freely while guaranteeing consistent, semantic, SEO-friendly output.',
      example: 'An editor builds a project page from gallery, text, and CTA blocks without breaking structure.',
      arch: 'Studio staff assemble case studies from approved blocks that always render clean headings and links.',
      question: 'What do reusable components give editors, and how do they protect SEO?',
      practice: 'List four reusable blocks a project page needs.',
      related: ['cms-rich-text-field', 'cms-dynamic-pages', 'seo-heading-hierarchy']
    },
    {
      id: 'cms-dynamic-pages', level: 'Intermediate', group: 'CMS Concepts', title: 'Dynamic pages',
      pro: 'Dynamic pages are generated from data rather than hand-built - one template renders many pages by pulling each entry from a collection. A single project template produces all project pages. This scales content efficiently, and the template centralizes SEO so every generated page is consistent.',
      eli5: 'It is one page design that automatically becomes many pages from your data.',
      why: 'Dynamic pages scale content and centralize SEO, so improving the template improves every page at once.',
      example: 'One slug-based project template renders all 60 project pages from the collection.',
      arch: 'Adding a project entry instantly creates its page via the shared project template.',
      question: 'How do dynamic pages work, and why does centralized SEO help?',
      practice: 'Explain how one template can serve hundreds of pages.',
      related: ['cms-driven-routing', 'cms-collection', 'cms-seo-data-to-pages']
    },
    {
      id: 'cms-driven-routing', level: 'Advanced', group: 'CMS Concepts', title: 'CMS-driven routing',
      pro: 'CMS-driven routing means URLs are determined by content - dynamic routes (for example /projects/[slug]) resolve a slug against the CMS to render the matching entry, with unknown slugs returning a 404. The route structure mirrors the content model, so adding content adds routes automatically.',
      eli5: 'It is the website figuring out its addresses from the content you create.',
      why: 'It keeps URLs and content in sync automatically and makes the route map equal the information architecture.',
      example: '/projects/fjord-museum resolves the slug against the CMS and renders that project.',
      arch: 'Publishing a project automatically creates its URL, with no manual routing needed.',
      question: 'How does CMS-driven routing map content to URLs, and what handles unknown slugs?',
      practice: 'Write the dynamic route pattern for project pages.',
      related: ['cms-dynamic-pages', 'cms-slug-field', 'backend-content-model']
    },
    {
      id: 'cms-content-relationships', level: 'Intermediate', group: 'CMS Concepts', title: 'Content relationships',
      pro: 'Content relationships (references) link entries to each other - a project to its architects, services, or related projects. They model real connections, enable internal linking and related-content sections automatically, and let one change propagate (rename a person, and all their project credits update).',
      eli5: 'It is connecting items together, like linking a project to the people who designed it.',
      why: 'Relationships power automatic internal linking and consistent data, both good for SEO and maintenance.',
      example: 'Linking projects to a service auto-builds a related projects section on the service page.',
      arch: 'Projects reference their typology and team, generating cross-links that build topical clusters.',
      question: 'What do content relationships model, and how do they help internal linking?',
      practice: 'Name two relationships worth modeling on a Project entry.',
      related: ['seo-internal-linking', 'seo-topic-clusters', 'backend-content-model']
    },
    {
      id: 'cms-localization', level: 'Advanced', group: 'CMS Concepts', title: 'Localization',
      pro: 'Localization (internationalization) in a CMS manages content in multiple languages or regional variants - per-locale fields or parallel entries - so each market gets native content. It must coordinate with hreflang and URL structure so search engines serve the right version and do not treat translations as duplicates.',
      eli5: 'It is keeping the content in several languages so each visitor reads their own.',
      why: 'It enables correct multilingual SEO when paired with hreflang and a clear URL structure.',
      example: 'A project entry has English and Swedish fields rendered at /en and /sv with hreflang.',
      arch: 'A studio projects are localized so Nordic clients read their language and each version ranks locally.',
      question: 'What does CMS localization manage, and what must it coordinate with for SEO?',
      practice: 'Describe how localized entries map to URLs and hreflang.',
      related: ['seo-hreflang', 'seo-international-seo', 'cms-content-type']
    },
    {
      id: 'cms-version-history', level: 'Intermediate', group: 'CMS Concepts', title: 'Version history',
      pro: 'Version history records previous states of an entry, allowing editors to see changes, compare versions, and roll back mistakes. It provides accountability and a safety net - including for SEO fields - so an accidental change to a title or description can be reverted quickly.',
      eli5: 'It is a record of past versions so you can undo changes.',
      why: 'It makes editing safe and reversible, protecting content and SEO settings from accidental damage.',
      example: 'An editor restores a project previous meta description after a bad edit.',
      arch: 'If someone overwrites a project text, the studio reverts to the prior version instantly.',
      question: 'What does version history provide, and how does it protect SEO?',
      practice: 'Explain how version history reduces editing risk.',
      related: ['cms-draft-publish', 'cms-editorial-workflow', 'cms-seo-safe-editing']
    },

    /* ---------- CMS-Powered SEO Implementation ---------- */
    {
      id: 'cms-seo-data-to-pages', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How CMS data becomes pages',
      pro: 'CMS data becomes pages when the frontend (at build or request time) fetches entries via the CMS API and renders them through templates into HTML. Each entry maps to a route, its fields populate the layout, and the output is the crawlable HTML users and search engines receive.',
      eli5: 'It is how the stuff you type in the CMS turns into real web pages.',
      why: 'Understanding this pipeline is the foundation of CMS SEO - it is where content, URLs, and metadata are produced.',
      example: 'The build fetches all projects and renders each through the project template into a static page.',
      arch: 'A studio project entries flow through the API and template to become indexable project pages.',
      question: 'What is the path from a CMS entry to a rendered, crawlable page?',
      practice: 'Trace the steps from entry created to page in HTML.',
      related: ['cms-dynamic-pages', 'backend-api', 'seo-ssg'],
      v: [['b', 8, 40, 46, 40], ['t', 14, 55, 'ENTRY'], ['l', 14, 64, 34, 3], ['ar', 56, 60, 80, 60], ['b', 82, 40, 40, 40], ['t', 90, 62, 'TMPL'], ['ar', 124, 60, 148, 60], ['i', 150, 40, 44, 40], ['t', 152, 92, 'PAGE']]
    },
    {
      id: 'cms-seo-fields-to-meta', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How CMS fields map to meta tags',
      pro: 'CMS fields map to meta tags when the page template reads each entry fields (SEO title, description, OG image) and outputs the corresponding title, meta, and Open Graph tags in the HTML head, with global defaults filling any gaps. This makes per-page metadata editor-controlled and consistent.',
      eli5: 'It is how the SEO boxes you fill in become the labels Google reads.',
      why: 'It connects editor input to actual search and social output, so non-developers control real metadata safely.',
      example: 'The SEO title field renders into the title tag, and if empty a global template is used.',
      arch: 'An editor project SEO fields become the project page real title, description, and OG image.',
      question: 'How do CMS fields become meta tags, and what fills gaps?',
      practice: 'Map three SEO fields to the tags they produce.',
      related: ['cms-seo-fields', 'seo-meta-title', 'cms-global-settings']
    },
    {
      id: 'cms-seo-dynamic-slugs', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How dynamic pages get slugs',
      pro: 'Dynamic pages get slugs from the entry slug field: the CMS generates a slug from the title, the developer maps it into the dynamic route (/projects/[slug]), and the build or router uses it to create each page URL. Locking slugs and redirecting on change keeps URLs stable.',
      eli5: 'It is how each auto-made page gets its own readable web address.',
      why: 'It is the mechanism behind clean, stable, per-entry URLs - essential for crawlability and link permanence.',
      example: 'The fjord-museum slug field value produces the URL /projects/fjord-museum.',
      arch: 'Each project slug field drives its permanent project URL without manual routing.',
      question: 'How does an entry slug field become a page URL, and how is stability ensured?',
      practice: 'Explain the link between a slug field and a dynamic route.',
      related: ['cms-slug-field', 'cms-driven-routing', 'seo-slugs']
    },
    {
      id: 'cms-seo-structured-data', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How structured data is generated',
      pro: 'Structured data is generated by templates that read entry fields and output JSON-LD - mapping a project to CreativeWork, the firm to LocalBusiness, breadcrumbs to BreadcrumbList. Generating it from CMS data keeps it accurate and automatic for every page rather than hand-coded per page.',
      eli5: 'It is the website automatically writing Google hidden labels from your content.',
      why: 'Template-generated structured data stays correct and scales to every page, enabling rich results consistently.',
      example: 'The project template emits CreativeWork JSON-LD built from the entry title, image, and date.',
      arch: 'Every studio project page auto-generates accurate structured data from its fields.',
      question: 'How is structured data generated from CMS content, and why is that better than hand-coding?',
      practice: 'Name the Schema.org type you would generate for a project page.',
      related: ['seo-structured-data', 'seo-schema-org', 'cms-seo-data-to-pages']
    },
    {
      id: 'cms-seo-sitemap-generation', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How sitemap generation works',
      pro: 'Sitemap generation works by querying all publishable entries at build or request time and writing their URLs (with lastmod dates) into sitemap.xml, automatically including new content and excluding drafts and noindexed pages. Automation keeps the sitemap current without manual edits.',
      eli5: 'It is the website automatically writing its own list of pages for Google.',
      why: 'Automatic sitemaps keep discovery current as content changes, with no manual upkeep or missed pages.',
      example: 'Each build queries published projects and outputs their URLs to /sitemap.xml with lastmod.',
      arch: 'A studio sitemap updates itself every time a project is published.',
      question: 'How is a sitemap generated from CMS data, and what does it exclude?',
      practice: 'Explain how drafts stay out of the generated sitemap.',
      related: ['seo-xml-sitemap', 'backend-build-step', 'cms-draft-publish']
    },
    {
      id: 'cms-seo-robots-handling', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How robots.txt is handled',
      pro: 'Robots.txt is handled by serving a root robots.txt (static or generated) that allows public paths, disallows admin, API, and preview paths, and points to the sitemap. Per-environment logic can disallow everything on staging. Per-page indexing is controlled separately via meta robots and noindex driven by CMS fields.',
      eli5: 'It is how the site tells robots which areas to skip, with staging blocked entirely.',
      why: 'Correct robots handling protects private areas and prevents staging from leaking, without blocking real pages.',
      example: 'Production robots.txt allows the site and links the sitemap, while staging disallows all.',
      arch: 'A studio staging deploy blocks all crawling so unfinished projects never get indexed.',
      question: 'How is robots.txt handled across environments, and what controls per-page indexing instead?',
      practice: 'Describe the robots difference between production and staging.',
      related: ['seo-robots-txt', 'backend-environment-variables', 'cms-preview-mode']
    },
    {
      id: 'cms-seo-canonical-generation', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How canonical URLs are generated',
      pro: 'Canonical URLs are generated by the template outputting a rel=canonical tag built from the site base URL plus the entry path, with optional per-entry overrides for cross-posted or duplicated content. Generating canonicals consistently from CMS data prevents accidental duplicate-URL competition.',
      eli5: 'It is the site automatically stamping each page with its one true address.',
      why: 'Automatic, consistent canonicals stop parameter and duplicate variants from splitting ranking signals.',
      example: 'The template sets canonical to the base URL plus slug, and a filtered view inherits the clean project canonical.',
      arch: 'Every project page self-canonicalizes to its clean URL, ignoring filter parameters.',
      question: 'How are canonical URLs generated from CMS data, and when is an override needed?',
      practice: 'Explain how canonicals prevent filter-parameter duplicates.',
      related: ['seo-canonical-url', 'backend-environment-variables', 'seo-duplicate-content']
    },
    {
      id: 'cms-seo-redirect-management', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How redirects are managed',
      pro: 'Redirects are managed via a CMS-editable redirect list or automatic slug-change detection that maps old URLs to new ones, served as 301s by the app or edge. Editors can add redirects without code, and slug history can auto-create them, preserving link equity through content changes.',
      eli5: 'It is keeping a list of old addresses pointing to new ones so no link breaks.',
      why: 'Editor-manageable redirects keep rankings and external links intact when URLs change, without developer involvement.',
      example: 'Changing a slug auto-adds a 301 from the old URL, and editors can also add custom redirects.',
      arch: 'When a project URL changes, the studio redirect list preserves every press and award link.',
      question: 'How can redirects be managed in a CMS-driven site, and why does it matter?',
      practice: 'Describe how a slug change can auto-create a redirect.',
      related: ['seo-301-redirect', 'seo-redirects', 'cms-slug-field']
    },
    {
      id: 'cms-seo-preview-mode', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How preview mode works',
      pro: 'Preview mode works by the frontend detecting a secure preview flag (token or cookie) and fetching draft instead of published content, rendering it on a non-indexed preview URL. This lets editors verify content and SEO in context while keeping drafts out of search and caches.',
      eli5: 'It is a secret mode that shows drafts in the real design, hidden from Google.',
      why: 'It enables safe pre-publish review of pages and their metadata without exposing drafts to search.',
      example: 'A signed preview link makes the site fetch the draft project and render it for approval.',
      arch: 'A partner previews a draft project on a tokenized URL before it is published.',
      question: 'How does preview mode fetch and show drafts safely, and why must it be non-indexed?',
      practice: 'Explain how preview content is kept out of search.',
      related: ['cms-preview-mode', 'cms-draft-publish', 'backend-environment-variables']
    },
    {
      id: 'cms-seo-safe-editing', level: 'Intermediate', group: 'CMS-Powered SEO Implementation', title: 'How editors update SEO safely',
      pro: 'Editors update SEO safely when the CMS gives guarded SEO fields with sensible defaults, length counters and warnings, locked slugs with auto-redirects, role limits on global settings, preview, and version history. Guardrails let non-experts improve SEO without breaking URLs, canonicals, or indexing.',
      eli5: 'It is giving editors safe tools so they can improve SEO without breaking anything.',
      why: 'Guardrails let non-developers manage metadata confidently while preventing the common, damaging mistakes.',
      example: 'A title field shows a length counter, and changing a slug prompts an automatic redirect.',
      arch: 'Studio staff tweak project SEO within guardrails, never accidentally breaking a live URL.',
      question: 'What guardrails let editors change SEO safely, and what damage do they prevent?',
      practice: 'List three CMS guardrails that protect SEO during editing.',
      related: ['cms-seo-fields', 'cms-version-history', 'cms-roles-permissions']
    },
    {
      id: 'cms-seo-image-alt', level: 'Beginner', group: 'CMS-Powered SEO Implementation', title: 'How image alt text is managed',
      pro: 'Image alt text is managed by storing an alt field alongside each asset in the media library (or per use), so editors describe images once and the frontend outputs the alt attribute everywhere the image appears. Centralized alt text scales accessibility and image SEO across an image-heavy site.',
      eli5: 'It is where you write a description of each picture so it has a caption for Google and screen readers.',
      why: 'Managed alt text makes a photo-led site accessible and lets images rank, instead of being invisible.',
      example: 'Each media-library photo has an alt field rendered into every image alt attribute automatically.',
      arch: 'A studio sets alt text once per photo, making its portfolio accessible and image-searchable.',
      question: 'How is alt text managed centrally, and why does it matter for image-heavy sites?',
      practice: 'Write alt text for a project exterior dusk photo.',
      related: ['cms-media-library', 'seo-accessibility-seo', 'seo-image-heavy-seo']
    },

    /* ---------- Architecture-Firm SEO ---------- */
    {
      id: 'seo-studio-profile', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Studio profile SEO',
      pro: 'Studio profile SEO optimizes the About or Studio page and the firm entity across the web: a clear positioning statement, named people, location, Organization or LocalBusiness structured data, and consistent details (NAP) matching the Google Business Profile and directories. It makes the firm itself findable and credible.',
      eli5: 'It is making the page about your studio easy to find and trust.',
      why: 'Clients search the firm name and credibility, so a strong, structured profile wins branded and entity searches.',
      example: 'The Studio page adds Organization schema, founders, location, and awards, matching the Business Profile.',
      arch: 'A studio About page becomes its searchable identity for clients and juries researching the firm.',
      question: 'What does studio profile SEO optimize, and why does entity consistency matter?',
      practice: 'List four elements that strengthen a studio profile for search.',
      related: ['seo-local-seo', 'seo-schema-org', 'seo-awards-publications']
    },
    {
      id: 'seo-project-page', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Project page SEO',
      pro: 'Project page SEO makes individual project pages rank and convert: a descriptive title and slug, real written content (brief, location, materials, outcome), optimized images with alt text, structured data, and internal links. It turns a visual page into a crawlable, query-matching asset.',
      eli5: 'It is making each project page show up in search, not just look good.',
      why: 'Project pages are a firm core asset, so without text and metadata they stay beautiful but invisible.',
      example: 'A project page adds a written brief, location, alt text, and CreativeWork schema to rank for its type.',
      arch: 'Each building page targets [type] architect [city] with genuine content, not only photos.',
      question: 'What turns a visual project page into a ranking asset?',
      practice: 'List the on-page SEO elements a project page must have.',
      related: ['seo-project-pages', 'seo-image-heavy-seo', 'cms-seo-fields-to-meta']
    },
    {
      id: 'seo-architect-portfolio', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Architect portfolio SEO',
      pro: 'Architect portfolio SEO is the overall strategy for making a body of work discoverable: crawlable, well-structured project and index pages, topic clusters by typology, optimized media, structured data, and internal linking - balancing the visual-first brand with the crawlable content search engines need.',
      eli5: 'It is the whole plan to make an architect work findable online.',
      why: 'It reconciles a portfolio visual priorities with search needs, so great work is both seen and found.',
      example: 'Clustering projects by typology with linked index pages helps the portfolio rank by specialty.',
      arch: 'A studio structures its work into crawlable clusters so each typology ranks and feeds the others.',
      question: 'What does portfolio SEO strategy balance, and what structures support it?',
      practice: 'Sketch a typology-based cluster structure for a studio portfolio.',
      related: ['seo-portfolio-seo', 'seo-topic-clusters', 'seo-beautiful-invisible']
    },
    {
      id: 'seo-local-search-visibility', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Local search visibility',
      pro: 'Local search visibility is being found for geographic queries and in the map pack: a complete, accurate Google Business Profile, consistent NAP, local landing pages, LocalBusiness structured data, reviews, and locally relevant content. For region-chosen services it is often the highest-value SEO.',
      eli5: 'It is showing up when nearby people search for an architect.',
      why: 'Most architecture clients hire regionally, so local visibility frequently drives more inquiries than national rankings.',
      example: 'A complete Business Profile and city page put the studio in the local map results.',
      arch: 'Optimizing local signals wins the architect in [city] searches that bring real local commissions.',
      question: 'What drives local search visibility, and why is it high-value for firms?',
      practice: 'List three actions to improve a studio local visibility.',
      related: ['seo-local-seo', 'seo-service-area-pages', 'seo-studio-profile']
    },
    {
      id: 'seo-awards-publications', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Awards/publications metadata',
      pro: 'Awards and publications metadata captures recognition - award names, years, publishing outlets, links - as structured content and on-page text, and as structured data where applicable. It builds credibility (experience, expertise, authority, trust) signals, supports branded searches, and can earn links and press associations that aid ranking.',
      eli5: 'It is listing your awards and press in a way search engines notice.',
      why: 'Recognition signals trust and authority and attracts links, so structured, visible credentials reinforce the firm reputation in search.',
      example: 'An awards section lists each prize, year, and a link, marked up and crawlable.',
      arch: 'A studio Kasper Salin nomination is presented as text and metadata, boosting credibility searches.',
      question: 'Why do awards and publications matter for SEO, and how should they be presented?',
      practice: 'List the fields you would store for one award entry.',
      related: ['seo-studio-profile', 'seo-schema-org', 'seo-architect-portfolio']
    },
    {
      id: 'seo-service-page-strategy', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Service page strategy',
      pro: 'Service page strategy builds a dedicated, intent-matched page per offering (residential, cultural, adaptive reuse, interiors), each with clear scope, process, proof via linked projects, and a CTA. Distinct service pages capture specific commercial intent and anchor topic clusters far better than one generic services page.',
      eli5: 'It is making a separate clear page for each kind of work you do.',
      why: 'Separate service pages target distinct buyer searches and convert better than a single catch-all page.',
      example: 'An adaptive reuse service page targets that intent and links to relevant projects.',
      arch: 'Each studio service gets its own page, matching client searches and feeding its typology cluster.',
      question: 'Why are dedicated service pages better than one generic page for SEO and conversion?',
      practice: 'Define four service pages a studio should build.',
      related: ['seo-landing-pages', 'seo-topic-clusters', 'seo-service-area-pages']
    },
    {
      id: 'seo-location-project-pages', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Location-based project pages',
      pro: 'Location-based project pages organize and surface work by place, connecting projects to geographic queries through location metadata, local content, and internal links between a place page and its projects. They help a firm rank for projects in [area] and reinforce local relevance with real work.',
      eli5: 'They are pages that group your projects by where they are.',
      why: 'They turn a firm geographic footprint into rankable, locally relevant content backed by real projects.',
      example: 'A work in Gothenburg page lists local projects and links to each, capturing regional intent.',
      arch: 'A studio per-region project pages win local searches with genuine nearby work.',
      question: 'How do location-based project pages capture local intent credibly?',
      practice: 'Outline a work in [city] page linking to local projects.',
      related: ['seo-service-area-pages', 'seo-project-location-metadata', 'seo-local-search-visibility']
    },
    {
      id: 'seo-image-heavy-seo', level: 'Intermediate', group: 'Architecture-Firm SEO', title: 'Image-heavy website SEO',
      pro: 'Image-heavy website SEO makes visual sites both fast and crawlable: aggressive image optimization (formats, srcset, lazy loading, CDN), alt text on every image, enough real text for context, and content not locked inside non-crawlable scripts. It resolves the tension between rich visuals and search visibility.',
      eli5: 'It is making a picture-heavy site both fast and findable.',
      why: 'Photography sites are heavy and text-light by default, which hurts speed and indexing - this fixes both.',
      example: 'A portfolio adds AVIF srcset, alt text, and written context so it is fast and ranks.',
      arch: 'A studio keeps award-grade imagery while ensuring speed and crawlable text on every page.',
      question: 'What two problems does image-heavy SEO solve, and how?',
      practice: 'List three fixes that make a photo-led page fast and crawlable.',
      related: ['seo-image-optimization', 'seo-accessibility-seo', 'seo-minimal-crawlable']
    },
    {
      id: 'seo-minimal-crawlable', level: 'Advanced', group: 'Architecture-Firm SEO', title: 'Balancing minimal design with crawlable content',
      pro: 'Balancing minimal design with crawlable content means keeping a restrained, image-forward aesthetic while ensuring real, indexable text exists - descriptive headings, project narratives, alt text, and semantic HTML behind the sparse visuals. Minimalism must not strip the content and structure search engines need.',
      eli5: 'It is keeping a clean, simple look while still giving Google real words to read.',
      why: 'Minimal sites often delete the very text that makes them findable, so balance keeps both beauty and visibility.',
      example: 'A sparse home page keeps a real H1 and a concise intro text for crawlers and screen readers.',
      arch: 'A studio quiet design still includes project briefs and headings so the work is discoverable.',
      question: 'What tension does this balance resolve, and what content must minimal sites keep?',
      practice: 'List the minimum crawlable content a minimal home page should retain.',
      related: ['seo-beautiful-invisible', 'seo-thin-content', 'seo-heading-hierarchy']
    },
    {
      id: 'seo-beautiful-invisible', level: 'Advanced', group: 'Architecture-Firm SEO', title: 'Avoiding beautiful but invisible websites',
      pro: 'Avoiding beautiful-but-invisible websites is the discipline of ensuring a visually stunning site is also discoverable: crawlable HTML (not image-only or JS-locked content), real text and metadata, fast optimized media, structured data, and indexable URLs. A site no one can find through search wastes its design investment.',
      eli5: 'It is making sure a gorgeous website can actually be found, not just admired by people who already have the link.',
      why: 'Many architecture sites are beautiful yet rank for nothing, so visibility protects the investment and brings new clients.',
      example: 'Adding text, alt attributes, metadata, and crawlable URLs takes a silent showcase into search results.',
      arch: 'A studio ensures its striking site also ranks, so prospective clients discover it rather than only referrals.',
      question: 'Why are some beautiful sites invisible in search, and what makes them discoverable?',
      practice: 'Audit a stunning portfolio for the three most likely invisibility causes.',
      related: ['seo-minimal-crawlable', 'seo-portfolio-seo', 'seo-javascript-seo']
    }
  ];

  /* ---- wireframe renderer: reuse ARCH_WEB.wire when present ---- */
  const wire = (window.ARCH_WEB && typeof window.ARCH_WEB.wire === 'function') ? window.ARCH_WEB.wire : null;

  const byId = {};
  TERMS.forEach((t) => { byId[t.id] = t; t.featured = FEATURED.has(t.id); });
  const featuredTerms = TERMS.filter((t) => t.featured);

  function groupSlug(group) {
    return String(group || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  window.SEO_CMS = {
    category: CATEGORY,
    groups: GROUPS,
    terms: TERMS,
    byId,
    wire,
    // Focused HHL set surfaced in the curriculum + review.
    featuredGroupOrder: FEATURED_GROUP_ORDER,
    featuredTerms,
    isFeatured: (id) => FEATURED.has(id)
  };

  /* ---- merge featured terms into SRS deck ---- */
  /* Non-featured terms stay in TERMS for future use but are not added to the
     deck, so they never appear in review queues or progress calculations. */
  const DATA = window.AI_MASTERY_DATA;
  if (!DATA || DATA.__seoCmsLoaded) return;
  DATA.__seoCmsLoaded = true;
  if (Array.isArray(DATA.categories) && !DATA.categories.includes(CATEGORY)) DATA.categories.push(CATEGORY);
  const existing = new Set(DATA.cards.map((c) => c.id));
  for (const t of TERMS) {
    if (!t.featured) continue;
    if (existing.has(t.id)) continue;
    const example = t.arch ? `${t.example} Architecture-firm example: ${t.arch}` : t.example;
    DATA.cards.push({
      id: t.id, level: t.level, category: CATEGORY, type: 'seo',
      title: t.title, front: t.question, back: t.pro,
      whyItMatters: t.why, example, practice: t.practice,
      eli5: t.eli5, visualId: t.id, chunk: t.group,
      tags: ['seo-cms', groupSlug(t.group), String(t.level || '').toLowerCase()],
      connections: t.related.map((id) => (byId[id] ? byId[id].title : id))
    });
  }
})();
