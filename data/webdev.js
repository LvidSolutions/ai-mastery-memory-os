/* Architecture Website Review Mode — data + wireframe visuals.
   36 terms · professional + ELI5 explanations · architecture-firm relevance ·
   inline SVG wireframes (no external images) · related links · review questions.
   Exposes window.ARCH_WEB and merges SRS cards into window.AI_MASTERY_DATA. */
(() => {
  'use strict';
  if (window.ARCH_WEB) return;

  const GROUPS = ['Page Anatomy', 'Portfolio Patterns', 'Navigation', 'Layout & Craft', 'Motion', 'Performance & Reach', 'System & Stack'];

  /* Wireframe spec primitives (200x120 canvas unless h overrides):
     b=outline box, f=faint box, i=image placeholder, a=accent box,
     l=text line, t=tiny label, c=circle, ar=arrow, w=line */
  const TERMS = [
    {
      id: 'aw-hero-section', tier: 'Beginner', group: 'Page Anatomy', title: 'Hero Section',
      pro: 'The hero section is the first full-viewport block a visitor sees: typically a single dominant visual, a short value statement, and one primary action. It sets tone, establishes hierarchy, and answers "where am I and why should I stay" within seconds. Strong heroes pair one idea with one action instead of competing messages.',
      eli5: 'It is the big first picture at the top of a website that tells you what the place is about, like a shop window.',
      why: 'Architecture firms are judged on visual taste instantly. A full-bleed photograph of one signature building communicates more capability than paragraphs of text, so the hero usually IS the portfolio argument.',
      example: 'A studio opens with a full-screen photo of its harbor pavilion, the line "Architecture for northern light," and one button: View Work.',
      question: 'What three elements does an effective hero section combine, and what question must it answer in seconds?',
      practice: 'Open any architecture studio site and write down its hero image subject, headline, and primary action.',
      related: ['aw-cta-section', 'aw-featured-project', 'aw-navigation-bar'],
      v: [['i', 6, 16, 188, 98], ['l', 16, 46, 92], ['l', 16, 58, 70], ['a', 16, 74, 44, 14, 'View work'], ['t', 16, 26, 'STUDIO']]
    },
    {
      id: 'aw-navigation-bar', tier: 'Beginner', group: 'Navigation', title: 'Navigation Bar',
      pro: 'The navigation bar is the persistent strip, usually at the top, holding the brand mark and links to primary sections. It is the site\'s contract with the visitor: every important destination should be reachable from it in one tap. Good navigation stays short (4–6 items), uses plain nouns, and keeps the highest-value action visually distinct.',
      eli5: 'It is the row of buttons at the top that takes you to different rooms of the website.',
      why: 'Firm sites live or die on Projects, Studio, and Contact. A short, calm nav keeps attention on the photography while guaranteeing a commissioning client can always find the contact route.',
      example: 'Logo left; Projects, Studio, Journal, Contact right — Contact rendered as an outlined button.',
      question: 'What belongs in a primary navigation bar, and how many items should it usually hold?',
      practice: 'List the nav items of two firm sites; mark any item a paying client would never click.',
      related: ['aw-sticky-header', 'aw-mega-menu', 'aw-mobile-navigation', 'aw-footer'],
      v: [['b', 6, 10, 188, 18], ['c', 16, 19, 5], ['l', 86, 17, 18], ['l', 110, 17, 18], ['l', 134, 17, 18], ['a', 158, 13, 30, 12, 'Contact'], ['f', 6, 36, 188, 76]]
    },
    {
      id: 'aw-footer', tier: 'Beginner', group: 'Page Anatomy', title: 'Footer',
      pro: 'The footer is the closing region of every page, carrying secondary navigation, contact details, legal links, social profiles, and often a final call to action. Visitors deliberately scroll to footers to find addresses and emails, so it should be structured, scannable, and consistent site-wide.',
      eli5: 'It is the bottom part of the page where the website keeps its address, phone number, and small links.',
      why: 'Clients and journalists hunting for a studio\'s address, press contact, or careers email go straight to the footer. For a firm it doubles as the "office plaque": location, registration, and credentials.',
      example: 'Three columns: studio address and map link; project index; newsletter signup with social icons.',
      question: 'What information do visitors expect to find in a footer, and why does it deserve deliberate design?',
      practice: 'Sketch a three-column footer for a fictional studio including address, index, and contact.',
      related: ['aw-navigation-bar', 'aw-contact-form', 'aw-seo-metadata'],
      v: [['f', 6, 8, 188, 70], ['b', 6, 84, 188, 30], ['l', 14, 92, 36], ['l', 14, 100, 30], ['l', 84, 92, 30], ['l', 84, 100, 26], ['l', 148, 92, 34], ['c', 152, 104, 3], ['c', 162, 104, 3], ['c', 172, 104, 3]]
    },
    {
      id: 'aw-about-page', tier: 'Beginner', group: 'Page Anatomy', title: 'About Page',
      pro: 'The About page tells the organization\'s story: who it is, what it believes, and why it is credible. It converts interest into trust through narrative, faces, history, and recognition such as awards or publications. The strongest About pages are specific — named people, real philosophy, concrete milestones — rather than generic mission statements.',
      eli5: 'It is the page that tells you who made the website and what they care about.',
      why: 'Commissioning a building is a multi-year relationship; clients research the humans behind the renders. An About page with the founders\' philosophy and studio culture often closes the shortlist decision.',
      example: 'A founding story, a design-philosophy statement, a timeline of built work, and awards from the national architecture association.',
      question: 'What is the conversion job of an About page, and what makes one credible rather than generic?',
      practice: 'Write a two-sentence philosophy statement for an imaginary studio that avoids the word "passionate".',
      related: ['aw-studio-profile', 'aw-team-section', 'aw-services-page'],
      v: [['l', 10, 14, 60], ['i', 10, 24, 80, 60], ['l', 100, 28, 88], ['l', 100, 38, 84], ['l', 100, 48, 88], ['l', 100, 58, 60], ['t', 10, 96, 'EST. 2009 · 14 AWARDS'], ['l', 10, 104, 120]]
    },
    {
      id: 'aw-services-page', tier: 'Beginner', group: 'Page Anatomy', title: 'Services Page',
      pro: 'A Services page enumerates what the organization actually sells, scoped clearly enough for a buyer to self-qualify. Effective ones group offerings, describe process and deliverables, and state who each service is for. Vague capability lists underperform pages that explain engagement models and outcomes.',
      eli5: 'It is the page that lists what jobs the company can do for you.',
      why: 'Firms span feasibility studies, full design, interiors, and landscape. Spelling out phases (concept → permit → construction documents → site supervision) tells private and public clients exactly where the studio fits their procurement.',
      example: 'Four service blocks — Residential, Cultural, Adaptive Reuse, Interiors — each with process stages and a representative project link.',
      question: 'What should a services page communicate beyond a list of capabilities?',
      practice: 'Draft service categories for a small studio and note one deliverable per category.',
      related: ['aw-about-page', 'aw-portfolio-case-study', 'aw-cta-section'],
      v: [['l', 10, 12, 70], ['b', 10, 24, 56, 70], ['c', 20, 36, 5], ['l', 16, 50, 40], ['l', 16, 60, 36], ['b', 72, 24, 56, 70], ['c', 82, 36, 5], ['l', 78, 50, 40], ['l', 78, 60, 36], ['b', 134, 24, 56, 70], ['c', 144, 36, 5], ['l', 140, 50, 40], ['l', 140, 60, 36]]
    },
    {
      id: 'aw-contact-form', tier: 'Beginner', group: 'Page Anatomy', title: 'Contact Form',
      pro: 'A contact form collects structured inquiries — name, email, message, often project type and budget — and routes them to the team. It reduces friction versus bare email links, enables validation and spam control, and feeds CRM or notification systems. Every added field lowers completion, so forms should ask only what the first reply genuinely needs.',
      eli5: 'It is a small set of boxes you fill in to send the company a message.',
      why: 'A commission inquiry is high value; losing one to a clunky form is expensive. Asking project type, location, and timeline up front lets a firm triage serious clients from casual requests.',
      example: 'Name, email, project type dropdown (residential / cultural / commercial), message — and a promised response time under the button.',
      question: 'Why does each extra form field cost conversions, and which fields earn their place on a firm\'s contact form?',
      practice: 'Design a four-field inquiry form for a studio and justify each field.',
      related: ['aw-cta-section', 'aw-footer', 'aw-accessibility'],
      v: [['l', 10, 14, 56], ['b', 10, 24, 110, 12], ['b', 10, 42, 110, 12], ['b', 10, 60, 110, 26], ['a', 10, 94, 46, 13, 'Send'], ['t', 132, 30, 'NAME'], ['t', 132, 48, 'EMAIL'], ['t', 132, 70, 'MESSAGE']]
    },
    {
      id: 'aw-team-section', tier: 'Beginner', group: 'Page Anatomy', title: 'Team Section',
      pro: 'A team section presents the people behind the work — portraits, names, roles, and sometimes short bios or credentials. It humanizes the brand and signals capacity and seniority. Consistent photography and honest titles matter more than quantity.',
      eli5: 'It is the part of the page that shows photos of the people who work there.',
      why: 'Clients hire architects, not logos; planning authorities and partners check who holds the licenses. Showing partners and project leads with credentials builds the trust a multi-million build requires.',
      example: 'A grid of uniform black-and-white portraits: two founding partners, project architects, and the model-workshop lead.',
      question: 'What does a team section signal to prospective clients beyond names and faces?',
      practice: 'Decide which three roles a five-person studio should feature first and why.',
      related: ['aw-about-page', 'aw-studio-profile', 'aw-image-optimization'],
      v: [['l', 10, 12, 50], ['c', 32, 44, 14], ['l', 20, 66, 26], ['c', 78, 44, 14], ['l', 66, 66, 26], ['c', 124, 44, 14], ['l', 112, 66, 26], ['c', 170, 44, 14], ['l', 158, 66, 26], ['t', 20, 80, 'PARTNER'], ['t', 66, 80, 'PARTNER'], ['t', 110, 80, 'PROJECT LEAD'], ['t', 158, 80, 'WORKSHOP']]
    },
    {
      id: 'aw-studio-profile', tier: 'Beginner', group: 'Page Anatomy', title: 'Studio Profile',
      pro: 'A studio profile is the condensed identity package: positioning statement, founding facts, scale, sectors, recognition, and selected clients. It exists both as a web section and as a downloadable document for competitions and procurement. It is the firm\'s elevator pitch made permanent.',
      eli5: 'It is a short card that says who the studio is, how big it is, and what it is best at.',
      why: 'Public tenders and competition juries ask for exactly this. A web profile that mirrors the PDF (sectors, staff count, key awards, reference projects) saves bid time and keeps facts consistent everywhere.',
      example: '"22-person studio in Stockholm focused on cultural and adaptive-reuse projects; Kasper Salin nominee; selected clients: city museums, regional councils."',
      question: 'What facts belong in a studio profile, and in which two contexts is it used?',
      practice: 'Write a 40-word profile for a fictional studio including scale, sector, and one recognition.',
      related: ['aw-about-page', 'aw-team-section', 'aw-portfolio-case-study'],
      v: [['i', 10, 14, 70, 50], ['l', 90, 18, 96], ['l', 90, 28, 80], ['b', 90, 40, 28, 18], ['t', 94, 51, '22'], ['b', 122, 40, 28, 18], ['t', 126, 51, '2009'], ['b', 154, 40, 32, 18], ['t', 158, 51, '14 AW'], ['l', 10, 76, 176], ['l', 10, 86, 150]]
    },
    {
      id: 'aw-image-gallery', tier: 'Beginner', group: 'Portfolio Patterns', title: 'Image Gallery',
      pro: 'An image gallery presents a curated sequence of photographs with controlled navigation — grid, slider, or lightbox. Order is editorial: it walks the viewer through a space or argument. Galleries need keyboard support, swipe gestures, and lazy loading to stay fast and accessible.',
      eli5: 'It is a photo album on a website you can flip through.',
      why: 'A building is experienced as a sequence — approach, entry, hall, detail. A well-ordered gallery recreates that promenade, which is precisely how architects want juries and clients to read a project.',
      example: 'A project page lightbox ordered: dusk exterior, entry sequence, main hall, stair detail, material close-up, site plan.',
      question: 'Why is image order in a gallery an editorial decision, and which three interaction features keep galleries usable?',
      practice: 'Sequence six imaginary photos of a library project from approach to detail.',
      related: ['aw-masonry-layout', 'aw-project-grid', 'aw-image-optimization', 'aw-loading-states'],
      v: [['i', 10, 14, 56, 40], ['i', 72, 14, 56, 40], ['i', 134, 14, 56, 40], ['i', 10, 60, 56, 40], ['i', 72, 60, 56, 40], ['i', 134, 60, 56, 40], ['t', 92, 112, '< 2 / 6 >']]
    },
    {
      id: 'aw-featured-project', tier: 'Beginner', group: 'Portfolio Patterns', title: 'Featured Project',
      pro: 'A featured project is deliberate curation: one work given dominant placement and scale on the home page or section top. It concentrates attention on the strongest, most strategic piece instead of treating all work equally. Rotating the feature keeps the site feeling alive and steers the kind of inquiries a firm receives.',
      eli5: 'It is the one project the studio puts in the biggest frame so everyone sees it first.',
      why: 'Firms get commissioned for what they show biggest. Featuring the new concert hall rather than early kitchen extensions repositions the studio toward the work it wants next.',
      example: 'Home page leads with a full-width module for the just-completed museum, photo plus one line and a "Read case study" link.',
      question: 'What strategic effect does choosing a featured project have on the inquiries a firm receives?',
      practice: 'Pick which of three fictional projects to feature to win more cultural work, and say why.',
      related: ['aw-hero-section', 'aw-portfolio-case-study', 'aw-project-grid'],
      v: [['i', 10, 14, 124, 92], ['t', 16, 100, 'FJORD MUSEUM — 2026'], ['i', 142, 14, 48, 28], ['i', 142, 46, 48, 28], ['i', 142, 78, 48, 28]]
    },
    {
      id: 'aw-cta-section', tier: 'Beginner', group: 'Page Anatomy', title: 'CTA Section',
      pro: 'A call-to-action section is a focused block asking the visitor to take one specific next step — start a project, book a call, download a profile. It pairs a short motivating line with a single prominent control and minimal competing content. Pages convert when each scroll depth ends in a clear CTA.',
      eli5: 'It is the part of the page with one big button telling you what to do next.',
      why: 'Portfolio browsing must end somewhere; a "Start a conversation about your project" block at the end of every case study turns admiration into inquiries — the entire commercial point of a firm\'s site.',
      example: 'After a case study: "Planning a cultural building? Talk to the partners." with a single Book-a-call button.',
      question: 'What makes a CTA section effective, and where should CTAs appear across a page?',
      practice: 'Write CTA copy (max 8 words) for the end of a housing case study.',
      related: ['aw-contact-form', 'aw-hero-section', 'aw-footer'],
      v: [['f', 6, 8, 188, 104], ['l', 50, 38, 100], ['l', 62, 50, 76], ['a', 72, 68, 56, 16, 'Book a call']]
    },
    {
      id: 'aw-breadcrumbs', tier: 'Beginner', group: 'Navigation', title: 'Breadcrumbs',
      pro: 'Breadcrumbs are a secondary navigation trail showing the page\'s position in the hierarchy (Home › Projects › Housing › Tile House) with each ancestor clickable. They orient visitors who land deep via search, reduce pogo-sticking back to the home page, and feed structured data that search engines display.',
      eli5: 'They are the little trail of links at the top that shows the path you took, like crumbs leading home.',
      why: 'Project pages are the classic deep-entry point from Google Images. Breadcrumbs let that visitor jump to all Housing work in one click — and they earn richer search listings for project names.',
      example: 'On a project page: Home › Projects › Cultural › Fjord Museum, with Cultural linking to the filtered grid.',
      question: 'What two problems do breadcrumbs solve for visitors arriving from search engines?',
      practice: 'Write the breadcrumb trail for a kitchen-detail page three levels deep.',
      related: ['aw-routing', 'aw-slug', 'aw-seo-metadata', 'aw-navigation-bar'],
      v: [['b', 6, 10, 188, 16], ['t', 12, 20, 'HOME'], ['t', 36, 20, '›'], ['t', 44, 20, 'PROJECTS'], ['t', 80, 20, '›'], ['a', 88, 12, 52, 12, 'FJORD MUSEUM'], ['f', 6, 34, 188, 78]]
    },
    {
      id: 'aw-project-grid', tier: 'Intermediate', group: 'Portfolio Patterns', title: 'Project Grid',
      pro: 'A project grid is the index of work: a repeating arrangement of project cards (image, title, minimal metadata) in consistent columns. It is built for scanning and comparison, with hover states revealing details and the grid itself communicating breadth. Equal cells read as democratic; varied cells create hierarchy.',
      eli5: 'It is a wall of project pictures arranged in neat rows so you can look at everything quickly.',
      why: 'The grid IS the portfolio for most visitors — many never open a single project. Its crop discipline, ordering, and density define how prolific and how refined the practice appears.',
      example: 'A three-column grid of 24 projects, each card showing one photo and the project name on hover, newest first.',
      question: 'What does a project grid communicate as a whole, beyond access to individual projects?',
      practice: 'Choose grid order (newest, typology, scale) for a studio seeking public commissions; defend it.',
      related: ['aw-masonry-layout', 'aw-project-filter', 'aw-featured-project', 'aw-responsive-layout'],
      v: [['i', 10, 12, 56, 42], ['i', 72, 12, 56, 42], ['i', 134, 12, 56, 42], ['i', 10, 62, 56, 42], ['i', 72, 62, 56, 42], ['i', 134, 62, 56, 42], ['t', 10, 112, 'TILE HOUSE'], ['t', 72, 112, 'FJORD MUSEUM'], ['t', 134, 112, 'BIRCH HALL']]
    },
    {
      id: 'aw-masonry-layout', tier: 'Intermediate', group: 'Portfolio Patterns', title: 'Masonry Layout',
      pro: 'Masonry is a multi-column layout where items keep their natural heights and stack into the shortest column, producing a staggered, brick-like wall without cropping. It honors mixed aspect ratios — verticals, panoramas, squares — at the cost of strict row alignment and a more complex reading order. CSS columns, grid row-spanning, or JS libraries implement it.',
      eli5: 'It is like stacking bricks of different sizes so there are no big gaps, instead of forcing every brick to be the same.',
      why: 'Architectural photography mixes tall stair shots with wide elevations; uniform grids crop them brutally. Masonry shows each photograph in its intended proportion — the photographer\'s and the architect\'s composition survive.',
      example: 'A journal page where site photos, vertical details, and panoramic elevations interlock without any image being cropped.',
      question: 'What problem does masonry solve compared with a uniform grid, and what does it trade away?',
      practice: 'List three image aspect ratios from a building shoot and sketch how masonry stacks them.',
      related: ['aw-project-grid', 'aw-image-gallery', 'aw-image-optimization'],
      v: [['i', 10, 12, 56, 60], ['i', 10, 78, 56, 30], ['i', 72, 12, 56, 34], ['i', 72, 52, 56, 56], ['i', 134, 12, 56, 46], ['i', 134, 64, 56, 28], ['t', 150, 104, 'NO CROP']]
    },
    {
      id: 'aw-project-filter', tier: 'Intermediate', group: 'Portfolio Patterns', title: 'Project Filter',
      pro: 'Project filters let visitors narrow an index by attributes — typology, status, location, year — usually as toggle chips above the grid with instant, animated results. Filters should reflect how outsiders search, update the URL for shareability, and never strand users in empty states.',
      eli5: 'They are buttons that hide everything except the kind of projects you asked to see.',
      why: 'A school board only wants schools; a journalist only wants completed work. Typology and status filters take a 60-project archive to a relevant shortlist in one tap, directly shaping commission fit.',
      example: 'Chips for All / Cultural / Housing / Public / In Progress; choosing Cultural animates the grid down to seven projects and updates the URL.',
      question: 'Which filter facets serve a firm\'s visitors best, and why should filter state live in the URL?',
      practice: 'Define four filter facets for a 50-project studio and one facet you would deliberately exclude.',
      related: ['aw-project-grid', 'aw-routing', 'aw-cms'],
      v: [['a', 10, 10, 24, 12, 'ALL'], ['b', 38, 10, 38, 12], ['t', 42, 18, 'CULTURAL'], ['b', 80, 10, 34, 12], ['t', 84, 18, 'HOUSING'], ['b', 118, 10, 30, 12], ['t', 122, 18, 'PUBLIC'], ['i', 10, 30, 56, 40], ['i', 72, 30, 56, 40], ['i', 10, 76, 56, 36], ['t', 140, 50, '7 RESULTS']]
    },
    {
      id: 'aw-portfolio-case-study', tier: 'Intermediate', group: 'Portfolio Patterns', title: 'Portfolio Case Study',
      pro: 'A case study is the long-form story of one project: brief, constraints, process, solution, and outcome, told through structured narrative, photography, and drawings. Unlike a gallery it argues — it shows how thinking produced the result and quantifies impact where possible. It is the deepest trust-building asset a portfolio has.',
      eli5: 'It is the full story of one project: the problem, what they did, and how it turned out.',
      why: 'Juries and clients shortlisting for serious work read process, not just results. Plans, sections, and a constraints-to-solution narrative prove authorship and competence in a way photos alone cannot.',
      example: 'Fjord Museum: the flood-risk brief, three massing studies, the chosen section drawing, construction photos, and visitor numbers one year after opening.',
      question: 'How does a case study differ from a gallery, and what structure makes it persuasive?',
      practice: 'Outline a five-part case-study structure for a school renovation in one line per part.',
      related: ['aw-featured-project', 'aw-image-gallery', 'aw-studio-profile', 'aw-cms'],
      v: [['i', 10, 10, 122, 44], ['b', 138, 10, 52, 44], ['t', 142, 20, 'CLIENT'], ['t', 142, 30, 'YEAR'], ['t', 142, 40, 'STATUS'], ['l', 10, 64, 120], ['l', 10, 74, 116], ['l', 10, 84, 120], ['i', 10, 94, 56, 18], ['i', 72, 94, 56, 18], ['t', 140, 104, 'SECTION A-A']]
    },
    {
      id: 'aw-sticky-header', tier: 'Intermediate', group: 'Navigation', title: 'Sticky Header',
      pro: 'A sticky (fixed) header keeps the navigation pinned to the viewport while content scrolls beneath it, often shrinking or changing background after the first scroll. It guarantees constant access to navigation on long pages at the cost of vertical space — so sticky headers should be slim, and many sites hide them on scroll-down and reveal on scroll-up.',
      eli5: 'It is a menu bar that sticks to the top of the screen even when you scroll down.',
      why: 'Case-study pages run long and image-heavy; a slim sticky bar means the visitor can jump to Contact from photo twelve without scrolling back. Shrink-on-scroll keeps photography, not chrome, dominant.',
      example: 'Transparent header over the hero that gains a solid background and shrinks to half height after 100px of scroll.',
      question: 'What does a sticky header trade for permanent navigation access, and how do sites mitigate it?',
      practice: 'Specify sticky-header behavior (height, background, hide/reveal) for an image-led project page.',
      related: ['aw-navigation-bar', 'aw-scroll-animation', 'aw-mobile-navigation'],
      v: [['a', 6, 8, 188, 14, ''], ['t', 12, 17, 'LOGO'], ['t', 150, 17, 'CONTACT'], ['f', 6, 30, 188, 30], ['f', 6, 66, 188, 22], ['f', 6, 94, 188, 18], ['ar', 100, 50, 100, 86]]
    },
    {
      id: 'aw-mega-menu', tier: 'Intermediate', group: 'Navigation', title: 'Mega Menu',
      pro: 'A mega menu is a large dropdown panel exposing an entire section\'s structure at once — multiple columns of grouped links, often with imagery. It suits deep catalogs by reducing click depth, but adds complexity: it needs careful keyboard and touch behavior and can overwhelm small sites where a simple dropdown would do.',
      eli5: 'It is a giant menu that opens like a map and shows many choices at the same time.',
      why: 'A large practice with 200 projects across eight typologies can expose Cultural / Housing / Workplace / Public with a thumbnail each — one hover replaces three navigation hops. Boutique studios usually should not pay its complexity cost.',
      example: 'Hovering Projects opens a panel: four typology columns plus a featured-project thumbnail on the right.',
      question: 'When does a mega menu earn its complexity, and what interaction details make or break it?',
      practice: 'Decide for a 12-project studio and a 300-project firm whether each should use a mega menu.',
      related: ['aw-navigation-bar', 'aw-project-filter', 'aw-accessibility'],
      v: [['b', 6, 8, 188, 14], ['t', 12, 17, 'PROJECTS ▾'], ['b', 6, 24, 188, 64], ['t', 14, 34, 'CULTURAL'], ['l', 14, 42, 30], ['l', 14, 50, 26], ['t', 64, 34, 'HOUSING'], ['l', 64, 42, 30], ['l', 64, 50, 26], ['t', 114, 34, 'PUBLIC'], ['l', 114, 42, 30], ['i', 152, 30, 36, 50]]
    },
    {
      id: 'aw-mobile-navigation', tier: 'Intermediate', group: 'Navigation', title: 'Mobile Navigation',
      pro: 'Mobile navigation adapts wayfinding to small screens and thumbs: typically a compact header with a menu trigger opening a full-screen or drawer panel, or a persistent bottom tab bar for app-like products. Targets need at least 44px, gestures must not fight the browser, and the pattern must respect safe areas on notched devices.',
      eli5: 'It is the phone version of the menu — usually a little button that opens a big list you can tap with your thumb.',
      why: 'Half or more of portfolio traffic is phones, often a client browsing from a site visit. Full-screen menus with generous type keep the brand\'s calm confidence; cramped hamburger drawers undo it.',
      example: 'A hamburger opening a full-screen overlay: five large links, studio address at the bottom, close button within thumb reach.',
      question: 'What constraints (target size, gestures, safe areas) govern mobile navigation design?',
      practice: 'Sketch a full-screen mobile menu for a studio: list the five links and their order.',
      related: ['aw-navigation-bar', 'aw-responsive-layout', 'aw-accessibility', 'aw-sticky-header'],
      v: [['b', 70, 8, 60, 104], ['t', 76, 18, '≡'], ['f', 76, 26, 48, 8], ['b', 78, 40, 44, 64], ['l', 84, 50, 30], ['l', 84, 62, 26], ['l', 84, 74, 30], ['l', 84, 86, 22], ['t', 84, 99, 'CONTACT']]
    },
      {
      id: 'aw-responsive-layout', tier: 'Intermediate', group: 'Layout & Craft', title: 'Responsive Layout',
      pro: 'Responsive layout means one codebase whose structure adapts fluidly to any viewport — columns collapse, type scales, images resize — driven by fluid grids, flexible media, and CSS breakpoints. Modern practice designs mobile-first, then enhances upward, and prefers intrinsic techniques (grid, flexbox, clamp()) over pixel-perfect device targeting.',
      eli5: 'It means the website rearranges itself so it looks right on a big computer, a tablet, or a small phone.',
      why: 'A three-column project grid must become one elegant column on a phone without wrecking image composition. Juries browse on laptops, clients on phones, journalists on tablets — one portfolio must hold up everywhere.',
      example: 'The project grid: 3 columns ≥1024px, 2 columns ≥640px, 1 column below — with type scaled via clamp().',
      question: 'What three ingredients make a layout responsive, and why is mobile-first the default strategy?',
      practice: 'Write the breakpoint plan (columns per width) for a portfolio grid in three lines.',
      related: ['aw-mobile-navigation', 'aw-typography-scale', 'aw-project-grid', 'aw-image-optimization'],
      v: [['b', 6, 14, 92, 64], ['f', 12, 20, 24, 20], ['f', 40, 20, 24, 20], ['f', 68, 20, 24, 20], ['b', 108, 24, 44, 54], ['f', 113, 30, 16, 16], ['f', 132, 30, 16, 16], ['b', 162, 30, 28, 48], ['f', 166, 36, 20, 12], ['f', 166, 52, 20, 12], ['t', 30, 90, 'DESKTOP'], ['t', 116, 90, 'TABLET'], ['t', 164, 90, 'PHONE']]
    },
    {
      id: 'aw-typography-scale', tier: 'Intermediate', group: 'Layout & Craft', title: 'Typography Scale',
      pro: 'A typography scale is a fixed ladder of font sizes derived from a base size and ratio (e.g., 16px × 1.25), giving every text level — display, headings, body, captions — a deliberate, harmonious step. Scales kill arbitrary sizing, encode hierarchy consistently, and pair with line-height and weight rules to form the type system.',
      eli5: 'It is a staircase of letter sizes, so titles, normal text, and small notes always fit together nicely.',
      why: 'Architecture brands often carry their print identity online — restrained, grid-true, Swiss-influenced. A strict modular scale is the difference between a site that feels typeset and one that feels assembled.',
      example: 'Base 18px, ratio 1.333: captions 13.5, body 18, h3 24, h2 32, h1 42.7, display 56.9 — six sizes, nothing else allowed.',
      question: 'How is a modular type scale constructed, and what problem does it eliminate?',
      practice: 'Compute a five-step scale from base 16px with ratio 1.25.',
      related: ['aw-white-space', 'aw-design-system', 'aw-responsive-layout'],
      v: [['l', 14, 22, 120, 10], ['l', 14, 42, 96, 7], ['l', 14, 58, 110, 4], ['l', 14, 68, 102, 4], ['l', 14, 78, 110, 4], ['l', 14, 92, 60, 2.5], ['t', 150, 26, '×1.33'], ['t', 150, 46, '×1.33'], ['t', 150, 70, 'BODY'], ['t', 150, 94, 'CAPTION']]
    },
    {
      id: 'aw-white-space', tier: 'Intermediate', group: 'Layout & Craft', title: 'White Space',
      pro: 'White space (negative space) is the deliberately empty area around and between elements. It groups related content, isolates what matters, slows the reading rhythm, and signals confidence — premium design consistently uses more of it. It is an active material with its own spacing scale, not leftover room.',
      eli5: 'It is the empty space around things on a page — like leaving room around a painting so you can really see it.',
      why: 'Galleries hang one work per wall; firm sites borrow the same move. Generous margins around a single photograph say "this work deserves room" — cramped layouts read as a discount catalog.',
      example: 'A project page showing one image per viewport with 20% side margins and a single caption line beneath.',
      question: 'What jobs does white space perform, and why does it read as premium?',
      practice: 'Take a cramped three-image row and describe how you would re-space it for a gallery feel.',
      related: ['aw-typography-scale', 'aw-hero-section', 'aw-design-system'],
      v: [['b', 6, 8, 188, 104], ['i', 60, 32, 80, 44], ['l', 78, 86, 44, 3], ['t', 24, 22, '← SPACE'], ['t', 148, 22, 'SPACE →']]
    },
    {
      id: 'aw-cms', tier: 'Intermediate', group: 'System & Stack', title: 'CMS',
      pro: 'A Content Management System separates content from presentation: editors create and update structured entries (projects, posts, people) through an admin interface, and the site renders them through templates. Headless CMSs (Sanity, Contentful, Strapi) expose content as APIs for any frontend. A good content model — fields, relations, validations — is the real design work.',
      eli5: 'It is a control room where you type in new projects and the website updates itself, without touching code.',
      why: 'Studios publish a project a month, not a redesign a month. With a Projects model (title, typology, year, photos, body), the office manager publishes new work in minutes and the portfolio never goes stale waiting for a developer.',
      example: 'A "Project" content type in a headless CMS with fields for hero image, gallery, typology, status, and credits — the grid and case-study pages render from it automatically.',
      question: 'What does a CMS decouple, and why is the content model the critical design decision?',
      practice: 'List the eight fields you would give a Project content type for a firm.',
      related: ['aw-slug', 'aw-routing', 'aw-component-library', 'aw-deployment'],
      v: [['b', 8, 16, 80, 84], ['t', 14, 26, 'EDITOR'], ['b', 14, 32, 68, 10], ['b', 14, 46, 68, 10], ['b', 14, 60, 68, 24], ['a', 14, 88, 36, 9, 'PUBLISH'], ['ar', 92, 58, 116, 58], ['b', 120, 16, 72, 84], ['i', 126, 22, 60, 30], ['l', 126, 60, 56], ['l', 126, 70, 50], ['l', 126, 80, 56]]
    },
    {
      id: 'aw-component-library', tier: 'Intermediate', group: 'System & Stack', title: 'Component Library',
      pro: 'A component library is the implemented kit of reusable interface parts — buttons, cards, navigation, galleries — each built once with defined props, states, and accessibility baked in, then composed into pages. It is the code counterpart of a design system\'s component layer and the practical guarantee of consistency and speed.',
      eli5: 'It is a box of ready-made Lego pieces for the website, so every page is built from the same good parts.',
      why: 'ProjectCard, ImageSequence, CreditsBlock, InquiryForm: build each once, reuse across 60 project pages. One fix to the card\'s hover state propagates everywhere — consistency a 22-person studio cannot maintain by hand.',
      example: 'A ProjectCard component (image, title, typology, hover reveal) used by the grid, the mega menu, and related-projects rows.',
      question: 'What guarantees does a component library provide that page-by-page building cannot?',
      practice: 'Name six components an architecture portfolio needs and one state each must handle.',
      related: ['aw-design-system', 'aw-cms', 'aw-loading-states'],
      v: [['b', 10, 12, 52, 30], ['t', 16, 22, 'BUTTON'], ['a', 16, 28, 28, 9, ''], ['b', 70, 12, 56, 30], ['t', 76, 22, 'CARD'], ['i', 76, 26, 24, 12], ['b', 134, 12, 56, 30], ['t', 140, 22, 'NAV'], ['l', 140, 32, 40], ['ar', 100, 50, 100, 66], ['b', 36, 72, 128, 38], ['t', 44, 82, 'PAGE = COMPONENTS'], ['i', 44, 86, 30, 16], ['a', 80, 88, 26, 9, ''], ['l', 112, 92, 40]]
    },
    {
      id: 'aw-slug', tier: 'Intermediate', group: 'System & Stack', title: 'Slug',
      pro: 'A slug is the human-readable identifier segment of a URL — lowercase words joined by hyphens (/projects/fjord-museum) — usually generated from a title and kept stable even if the title changes. Good slugs are short, descriptive, and permanent; changing one requires a redirect to avoid breaking links and search rankings.',
      eli5: 'It is the readable name at the end of a web address, like the label on a folder.',
      why: 'Press links and award listings point at project URLs for years. /projects/fjord-museum is quotable, searchable, and stable; /p?id=8347 is none of those — and a renamed project must keep its old slug redirected.',
      example: 'CMS auto-generates fjord-museum from the title; the editor locks it before publishing so future title tweaks never move the page.',
      question: 'What makes a good slug, and what must happen if one ever changes?',
      practice: 'Write slugs for three project titles including one with Scandinavian characters.',
      related: ['aw-routing', 'aw-breadcrumbs', 'aw-seo-metadata', 'aw-cms'],
      v: [['b', 6, 40, 188, 18], ['t', 14, 51, 'studio.com /projects/'], ['a', 96, 43, 70, 12, 'fjord-museum'], ['t', 30, 80, 'TITLE: "Fjord Museum" → slug'], ['ar', 100, 86, 100, 64]]
    },
    {
      id: 'aw-scroll-animation', tier: 'Advanced', group: 'Motion', title: 'Scroll Animation',
      pro: 'Scroll animation ties element behavior to scroll position or visibility: content fades or translates in as it enters the viewport, sequences pin and play, values interpolate with progress. Implemented with IntersectionObserver, CSS scroll-driven animations, or libraries (GSAP ScrollTrigger, Lenis), it must respect prefers-reduced-motion and never block reading.',
      eli5: 'It means things on the page gently appear or move as you scroll down, like turning pages brings pictures to life.',
      why: 'A case study is a promenade; staggered image reveals pace it like walking a building. Subtle 300–600ms fades feel curated — heavy effects feel like a template demo and bury the work.',
      example: 'Case-study images translate up 24px and fade in over 500ms as each enters the viewport, staggered 80ms; disabled under prefers-reduced-motion.',
      question: 'What APIs drive scroll animation, and what two constraints keep it respectful?',
      practice: 'Spec a reveal (distance, duration, easing, stagger) for case-study images in one line.',
      related: ['aw-parallax', 'aw-loading-states', 'aw-accessibility', 'aw-sticky-header'],
      v: [['b', 6, 8, 188, 104], ['f', 20, 18, 160, 22], ['f', 20, 48, 160, 22, .6], ['f', 20, 78, 160, 22, .25], ['ar', 184, 30, 184, 92], ['t', 28, 32, 'VISIBLE'], ['t', 28, 62, 'ENTERING…'], ['t', 28, 92, 'WAITING']]
    },
    {
      id: 'aw-parallax', tier: 'Advanced', group: 'Motion', title: 'Parallax',
      pro: 'Parallax moves layers at different speeds during scroll — backgrounds slower than foregrounds — manufacturing depth on a flat screen. Used sparingly (hero images, section transitions) it adds dimensionality; overused it causes motion sickness, jank, and accessibility complaints. Transform-based implementation and reduced-motion fallbacks are mandatory.',
      eli5: 'It is when the back picture moves slower than the front one while you scroll, so the page feels deep like a diorama.',
      why: 'Buildings are depth; a hero where the facade photo drifts at half scroll speed beneath the title gives a flat page physical presence — one good parallax moment outperforms ten.',
      example: 'Hero photograph translates at 0.5× scroll speed behind fixed typography for the first viewport, then scrolls normally.',
      question: 'How does parallax create depth, and why must it be rationed and reduced-motion aware?',
      practice: 'Choose the single section of a portfolio where parallax earns its cost; justify.',
      related: ['aw-scroll-animation', 'aw-hero-section', 'aw-accessibility'],
      v: [['f', 14, 14, 172, 70, .25], ['f', 30, 30, 140, 62, .5], ['b', 46, 46, 108, 58], ['t', 78, 76, 'FOREGROUND'], ['ar', 22, 96, 22, 76], ['ar', 100, 112, 100, 84], ['t', 8, 108, '0.3×'], ['t', 92, 118, '1×']]
    },
    {
      id: 'aw-loading-states', tier: 'Advanced', group: 'Motion', title: 'Loading States',
      pro: 'Loading states are the designed intermediate conditions while data or media arrives: skeleton screens that hold layout, blur-up image placeholders, progress indicators, and optimistic UI. They prevent layout shift, communicate system status, and shape perceived speed — often mattering more than actual speed.',
      eli5: 'It is what the page shows while pictures are still on their way, like a gray sketch that becomes a photo.',
      why: 'Portfolios are megabytes of photography on gallery Wi-Fi. Blur-up placeholders with exact aspect-ratio boxes keep the grid composed from the first millisecond; popping, jumping images destroy the studio\'s precision message.',
      example: 'Project grid renders gray boxes at exact image ratios, each blurring up from a 20px LQIP as the full image decodes.',
      question: 'What three techniques compose good loading states, and which metric do they primarily protect?',
      practice: 'Describe the loading sequence for a 12-image case study from first paint to full quality.',
      related: ['aw-image-optimization', 'aw-component-library', 'aw-scroll-animation'],
      v: [['b', 10, 12, 86, 60], ['f', 16, 18, 74, 30], ['f', 16, 52, 50, 5], ['f', 16, 60, 60, 5], ['ar', 100, 42, 116, 42], ['i', 120, 12, 70, 60], ['t', 130, 80, 'LOADED'], ['t', 22, 80, 'SKELETON'], ['c', 100, 100, 8], ['w', 100, 94, 100, 100]]
    },
    {
      id: 'aw-seo-metadata', tier: 'Advanced', group: 'Performance & Reach', title: 'SEO Metadata',
      pro: 'SEO metadata is the machine-readable layer describing each page: title tag, meta description, canonical URL, Open Graph/Twitter cards for link previews, and structured data (JSON-LD) for rich results. It determines how pages appear in search and when shared, and it must be unique and accurate per page — templated metadata wastes the channel.',
      eli5: 'It is the secret label on every page that tells Google and shared links what the page is called and shows a nice preview picture.',
      why: 'When the museum client shares the case study in a board chat, the OG image and title ARE the first impression. And "fjord museum architect" should surface the project page with a rich result, not the home page.',
      example: 'Project template emits: title "Fjord Museum — Studio North", a 150-char description, OG image of the dusk photo, and JSON-LD marking it as a CreativeWork.',
      question: 'Which metadata controls search snippets and which controls share previews?',
      practice: 'Write title (≤60 chars) and description (≤155) for a fictional project page.',
      related: ['aw-slug', 'aw-breadcrumbs', 'aw-image-optimization', 'aw-accessibility'],
      v: [['b', 8, 14, 184, 44], ['a', 14, 20, 120, 7, ''], ['t', 14, 38, 'studio.com › projects › fjord-museum'], ['l', 14, 46, 160, 3], ['l', 14, 52, 140, 3], ['b', 8, 68, 90, 44], ['i', 12, 72, 82, 24], ['l', 12, 100, 60, 4], ['t', 104, 78, '← SHARE CARD'], ['t', 104, 92, '(OPEN GRAPH)']]
    },
    {
      id: 'aw-accessibility', tier: 'Advanced', group: 'Performance & Reach', title: 'Accessibility',
      pro: 'Accessibility (a11y) makes the site usable by people with disabilities: semantic HTML, full keyboard operability, visible focus, alt text, sufficient color contrast (WCAG AA), labeled forms, and respected motion preferences. It is a legal requirement in many markets (EU accessibility directives), an SEO factor, and simply quality engineering.',
      eli5: 'It means building the website so everyone can use it — including people who cannot see well or use a mouse.',
      why: 'Public and institutional clients are themselves bound by accessibility law and increasingly require WCAG-conformant suppliers. An inaccessible portfolio can quietly disqualify a firm from the public work it wants — and image-heavy sites without alt text are invisible to some jurors.',
      example: 'Gallery operable by arrow keys with visible focus rings, every photo carrying descriptive alt text, 4.5:1 text contrast, reduced-motion honored.',
      question: 'Name five concrete accessibility requirements and the standard that defines conformance.',
      practice: 'Write alt text for an imagined photo of a timber stair detail.',
      related: ['aw-contact-form', 'aw-mobile-navigation', 'aw-scroll-animation', 'aw-seo-metadata'],
      v: [['a', 14, 16, 56, 18, 'BUTTON'], ['b', 10, 12, 64, 26], ['t', 84, 26, '← FOCUS RING'], ['i', 14, 50, 56, 34], ['b', 76, 56, 48, 12], ['t', 80, 64, 'ALT TEXT'], ['t', 14, 100, 'CONTRAST 4.5:1'], ['t', 110, 100, 'KEYBOARD ✓'], ['c', 168, 60, 10], ['t', 162, 64, 'AA']]
    },
    {
      id: 'aw-image-optimization', tier: 'Advanced', group: 'Performance & Reach', title: 'Image Optimization',
      pro: 'Image optimization delivers the smallest acceptable file for each context: modern formats (AVIF/WebP), responsive srcset sizes, correct dimensions, lazy loading below the fold, CDN delivery, and explicit width/height to prevent layout shift. On image-led sites it is the dominant performance lever.',
      eli5: 'It means shrinking pictures cleverly so they still look great but load super fast.',
      why: 'A firm site is 90% photography; unoptimized 8MB TIFF exports make it unusable on mobile networks. AVIF at six srcset widths through a CDN keeps award-grade photography crisp at a tenth of the bytes — speed is part of the brand\'s precision.',
      example: 'Each project photo is generated in AVIF+WebP at 6 widths; the grid loads 400px versions lazily, the lightbox swaps in 2000px.',
      question: 'Which five techniques make up image optimization, and why is it the top lever for portfolio performance?',
      practice: 'Plan srcset widths for a grid thumbnail vs a full-bleed hero.',
      related: ['aw-loading-states', 'aw-masonry-layout', 'aw-deployment', 'aw-responsive-layout'],
      v: [['i', 10, 16, 76, 54], ['t', 18, 80, '8.0 MB TIFF'], ['ar', 92, 42, 112, 42], ['i', 116, 24, 40, 28], ['i', 160, 30, 24, 18], ['t', 116, 62, '180 KB AVIF'], ['t', 116, 74, 'srcset ×6 · lazy'], ['t', 10, 100, 'CLS 0 — width/height set'], ['c', 178, 98, 7]]
    },
    {
      id: 'aw-design-system', tier: 'Advanced', group: 'System & Stack', title: 'Design System',
      pro: 'A design system is the complete set of decisions and assets that make a product family coherent: design tokens (color, type, spacing), components, patterns, and written usage principles. It is the single source of truth that lets multiple people ship consistent work fast — the system is documentation plus implementation, not a Figma file alone.',
      eli5: 'It is the rulebook plus the Lego set: the colors, letters, and pieces everyone must use so everything matches.',
      why: 'The firm\'s identity spans site, competition boards, signage, and decks. Tokens (ink, paper, accent; the type scale; an 8px spacing grid) applied across web and print keep a studio\'s famous rigor intact as the team and site grow.',
      example: 'Tokens: --ink #14161a, --paper #f5f4f1, --accent #c2502a; type scale ×1.333; 8px spacing — consumed by the web components and the InDesign templates.',
      question: 'What layers compose a design system, and what problem does it solve as teams scale?',
      practice: 'Define five tokens (two colors, base type size, ratio, spacing unit) for a fictional studio.',
      related: ['aw-component-library', 'aw-typography-scale', 'aw-white-space'],
      v: [['c', 20, 22, 7], ['c', 40, 22, 7], ['c', 60, 22, 7], ['t', 76, 26, 'TOKENS'], ['l', 14, 40, 56, 6], ['l', 14, 52, 40, 4], ['ar', 100, 30, 124, 30], ['b', 128, 14, 62, 32], ['t', 134, 24, 'COMPONENTS'], ['a', 134, 30, 24, 9, ''], ['i', 162, 28, 22, 13], ['ar', 158, 50, 158, 66], ['b', 96, 70, 94, 40], ['t', 102, 80, 'PAGES'], ['i', 102, 84, 36, 20], ['l', 144, 88, 40], ['l', 144, 96, 34]]
    },
    {
      id: 'aw-routing', tier: 'Advanced', group: 'System & Stack', title: 'Routing',
      pro: 'Routing maps URLs to content: static routes (/studio), dynamic routes with parameters (/projects/[slug]), and nested structures. The route map defines the site\'s information architecture and its shareable surface; every distinct view deserves a stable URL, and dead routes need 404s and redirects.',
      eli5: 'It is the website\'s address book — each web address knows exactly which page to open.',
      why: 'Awards, press, and portfolio indexes deep-link firm projects for a decade. A clean route map (/projects, /projects/[slug], /studio, /journal/[slug]) with redirects from any legacy URLs preserves that accumulated link equity.',
      example: '/projects/fjord-museum resolves the slug against the CMS, renders the case-study template, or returns a designed 404.',
      question: 'What is a dynamic route, and why does the route map equal the information architecture?',
      practice: 'Write the full route map (six routes) for a studio site.',
      related: ['aw-slug', 'aw-breadcrumbs', 'aw-cms', 'aw-deployment'],
      v: [['b', 8, 12, 80, 12], ['t', 12, 20, '/projects'], ['b', 8, 32, 80, 12], ['t', 12, 40, '/projects/[slug]'], ['b', 8, 52, 80, 12], ['t', 12, 60, '/studio'], ['ar', 92, 18, 116, 26], ['ar', 92, 38, 116, 52], ['ar', 92, 58, 116, 80], ['b', 120, 16, 70, 20], ['t', 126, 28, 'GRID PAGE'], ['b', 120, 44, 70, 20], ['t', 126, 56, 'CASE STUDY'], ['b', 120, 72, 70, 20], ['t', 126, 84, 'ABOUT PAGE']]
    },
    {
      id: 'aw-deployment', tier: 'Advanced', group: 'System & Stack', title: 'Deployment',
      pro: 'Deployment is the pipeline that turns source code into the live site: build (compile, optimize), upload to hosting, and release — ideally automated on every push, with preview environments per change and instant rollback. Static portfolio sites deploy to CDNs/edge networks for global speed with near-zero operations.',
      eli5: 'It is pressing the magic button that takes the website from the computer it was built on and puts it on the internet for everyone.',
      why: 'The studio publishes a project the morning an embargo lifts; an automated pipeline makes that a CMS click, not a developer favor. Preview deployments also let partners approve the new case study on a private URL first.',
      example: 'Push to main → build runs → site is live on the CDN in 90 seconds; the PR earlier produced a preview URL the partners reviewed.',
      question: 'What stages compose a deployment pipeline, and what do preview deployments enable?',
      practice: 'Describe your rollback plan if a deploy breaks the project grid.',
      related: ['aw-vercel', 'aw-github-workflow', 'aw-routing', 'aw-cms'],
      v: [['b', 8, 40, 44, 26], ['t', 14, 50, 'CODE'], ['t', 14, 58, 'push'], ['ar', 56, 53, 76, 53], ['b', 80, 40, 44, 26], ['t', 86, 50, 'BUILD'], ['c', 102, 60, 3], ['ar', 128, 53, 148, 53], ['c', 168, 46, 12], ['t', 158, 70, 'LIVE CDN'], ['c', 156, 92, 3], ['c', 168, 96, 3], ['c', 180, 92, 3], ['t', 146, 108, 'VISITORS']]
    },
    {
      id: 'aw-vercel', tier: 'Advanced', group: 'System & Stack', title: 'Vercel',
      pro: 'Vercel is a frontend cloud platform: connect a Git repository and it builds on every push, serves through a global edge network, and creates a unique preview deployment per pull request. It pioneered the workflow around Next.js but hosts any static or modern frontend; custom domains, HTTPS, analytics, and rollbacks are built in.',
      eli5: 'It is a service that watches your code and automatically puts every new version of the website online, super fast, all over the world.',
      why: 'A studio without a dev-ops team gets enterprise-grade hosting: the portfolio deploys itself on push, every draft gets a shareable preview link for partner sign-off, and photography is served from edge nodes near each visitor.',
      example: 'Importing the GitHub repo gives main → studio.com, and every PR a preview URL like portfolio-git-new-museum.vercel.app.',
      question: 'What three things does Vercel automate the moment a repo is connected?',
      practice: 'List the steps to point a custom domain at a Vercel project.',
      related: ['aw-deployment', 'aw-github-workflow', 'aw-image-optimization'],
      v: [['b', 8, 46, 50, 22], ['t', 14, 56, 'GITHUB'], ['t', 14, 64, 'repo'], ['ar', 62, 57, 84, 57], ['b', 88, 30, 56, 54], ['t', 98, 42, 'VERCEL'], ['w', 96, 50, 136, 50], ['t', 96, 62, 'build'], ['t', 96, 72, 'preview'], ['ar', 148, 57, 166, 57], ['c', 178, 50, 10], ['t', 164, 74, 'EDGE CDN'], ['t', 96, 100, 'PR → preview URL'], ['a', 88, 92, 4, 4, '']]
    },
    {
      id: 'aw-github-workflow', tier: 'Advanced', group: 'System & Stack', title: 'GitHub Workflow',
      pro: 'A GitHub workflow is the team\'s loop around version control: branch from main, commit changes, open a pull request, pass automated checks (GitHub Actions running builds, tests, link validation), get review, merge, and let CI/CD deploy. Actions are YAML-defined automations triggered by repository events.',
      eli5: 'It is the team\'s rulebook for changing the website: make a copy, change it, let a robot check it, then a teammate approves, and it goes live.',
      why: 'Even a two-person web effort benefits: the intern\'s gallery tweak ships through a PR with an automatic preview and a build check, so the partner approves visually and main is always deployable — no more "who broke the site".',
      example: 'feature/new-gallery → PR #41 → Action builds + validates data → preview link reviewed → squash-merge → Pages/Vercel deploys main.',
      question: 'Walk the path of a change from branch to production in a GitHub workflow with Actions.',
      practice: 'Name two checks an Action should run on this very repository before merge.',
      related: ['aw-deployment', 'aw-vercel', 'aw-cms'],
      v: [['w', 14, 30, 186, 30], ['c', 30, 30, 4], ['c', 150, 30, 4], ['w', 50, 30, 70, 56], ['w', 70, 56, 110, 56], ['c', 70, 56, 4], ['c', 110, 56, 4], ['w', 110, 56, 130, 30], ['t', 12, 20, 'MAIN'], ['t', 58, 70, 'BRANCH'], ['b', 96, 64, 52, 16], ['t', 102, 74, 'PR + CI ✓'], ['t', 142, 20, 'MERGE'], ['ar', 160, 36, 174, 50], ['t', 152, 62, 'DEPLOY']]
    }
  ];

  /* ---- wireframe SVG renderer ---- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
  function wire(spec, opts) {
    const h = (opts && opts.h) || 120;
    const out = [];
    for (const p of spec) {
      const k = p[0];
      if (k === 'b') out.push(`<rect class="wfb" x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="2"/>`);
      else if (k === 'f') out.push(`<rect class="wff" x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="2" opacity="${p[5] != null ? p[5] : 1}"/>`);
      else if (k === 'i') out.push(`<g class="wfi"><rect x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="2"/><line x1="${p[1]}" y1="${p[2]}" x2="${p[1] + p[3]}" y2="${p[2] + p[4]}"/><line x1="${p[1] + p[3]}" y1="${p[2]}" x2="${p[1]}" y2="${p[2] + p[4]}"/></g>`);
      else if (k === 'a') { out.push(`<rect class="wfa" x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="3"/>`); if (p[5]) out.push(`<text class="wfat" x="${p[1] + p[3] / 2}" y="${p[2] + p[4] / 2 + 2.2}" text-anchor="middle">${esc(p[5])}</text>`); }
      else if (k === 'l') out.push(`<rect class="wfl" x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4] || 4}" rx="2"/>`);
      else if (k === 't') out.push(`<text class="wft" x="${p[1]}" y="${p[2]}">${esc(p[3])}</text>`);
      else if (k === 'c') out.push(`<circle class="wfc" cx="${p[1]}" cy="${p[2]}" r="${p[3]}"/>`);
      else if (k === 'w') out.push(`<line class="wfw" x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}"/>`);
      else if (k === 'ar') out.push(`<g class="wfar"><line x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}"/><path d="M ${p[3]} ${p[4]} l -3.4 -5.6 l 6.8 0 z" transform="rotate(${Math.atan2(p[4] - p[2], p[3] - p[1]) * 180 / Math.PI - 90} ${p[3]} ${p[4]})"/></g>`);
    }
    return `<svg class="wf" viewBox="0 0 200 ${h}" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`;
  }

  const byId = {};
  TERMS.forEach((t) => { byId[t.id] = t; });

  window.ARCH_WEB = { groups: GROUPS, terms: TERMS, byId, wire };

  /* ---- merge into SRS deck ---- */
  const DATA = window.AI_MASTERY_DATA;
  if (!DATA || DATA.__archWebLoaded) return;
  DATA.__archWebLoaded = true;
  if (!DATA.categories.includes('Architecture Web')) DATA.categories.push('Architecture Web');
  const existing = new Set(DATA.cards.map((c) => c.id));
  for (const t of TERMS) {
    if (existing.has(t.id)) continue;
    DATA.cards.push({
      id: t.id, level: t.tier, category: 'Architecture Web', type: 'term',
      title: t.title, front: t.question, back: t.pro,
      whyItMatters: t.why, example: t.example, practice: t.practice,
      eli5: t.eli5, visualId: t.id, chunk: t.group,
      tags: ['webdev', 'architecture-site', t.group.toLowerCase().replace(/[^a-z]+/g, '-')],
      connections: t.related.map((id) => (byId[id] ? byId[id].title : id))
    });
  }
})();
