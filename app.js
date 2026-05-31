const storageKeys = {
  theme: "theme",
  news: "gpn_news",
  subscribers: "gpn_subscribers",
  messages: "gpn_messages",
  visitors: "gpn_visitors",
  visitorEmails: "gpn_visitor_emails",
  lastSeenNews: "gpn_last_seen_news_count"
};

let currentTheme = localStorage.getItem(storageKeys.theme) || "default";
let newsArticles = JSON.parse(localStorage.getItem(storageKeys.news)) || [];
let subscribers = JSON.parse(localStorage.getItem(storageKeys.subscribers)) || [];
let contactMessages = JSON.parse(localStorage.getItem(storageKeys.messages)) || [];
let visitorEmails = JSON.parse(localStorage.getItem(storageKeys.visitorEmails)) || [];
let adminToken = sessionStorage.getItem("gpn_admin_token") || null;
let currentImageData = null;
let slideIndex = 0;
let comingSoonTimer = null;
const expandedCategories = new Set();
const categoryPreviewLimit = 3;
const directAdminUser = window.GPN_ADMIN_USER || "Admin";
const directAdminPass = window.GPN_ADMIN_PASS || "password";

const programsList = [
  { name: "Epic Games", category: "Gaming & Entertainment", logo: "https://www.google.com/s2/favicons?sz=96&domain=epicgames.com", desc: "Game store and publishing platform for PC titles, creator tools, and major releases such as Fortnite.", link: "https://affiliate.gpn.com/epic" },
  { name: "Razer", category: "Gaming & Entertainment", logo: "https://www.google.com/s2/favicons?sz=96&domain=razer.com", desc: "Gaming hardware brand for laptops, keyboards, mice, headsets, streaming gear, and performance accessories.", link: "https://affiliate.gpn.com/razer" },
  { name: "Xbox Game Pass", category: "Gaming & Entertainment", logo: "https://www.google.com/s2/favicons?sz=96&domain=xbox.com", desc: "Subscription library for console, PC, and cloud games with rotating titles and multiplayer benefits.", link: "https://affiliate.gpn.com/xbox" },
  { name: "PlayStation Store", category: "Gaming & Entertainment", logo: "https://www.google.com/s2/favicons?sz=96&domain=playstation.com", desc: "Digital marketplace for PlayStation games, add-ons, subscriptions, demos, and entertainment content.", link: "https://affiliate.gpn.com/ps" },
  { name: "Steam", category: "Gaming & Entertainment", logo: "https://www.google.com/s2/favicons?sz=96&domain=steampowered.com", desc: "PC gaming storefront with game sales, wishlists, community features, mods, and developer publishing tools.", link: "https://affiliate.gpn.com/steam" },
  { name: "Canva", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=canva.com", desc: "Browser-based design tool for social posts, presentations, posters, videos, brand kits, and templates.", link: "https://affiliate.gpn.com/canva" },
  { name: "Adobe Creative Cloud", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=adobe.com", desc: "Creative suite for photo editing, illustration, video production, layout, animation, and digital publishing.", link: "https://affiliate.gpn.com/adobe" },
  { name: "Envato Elements", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=elements.envato.com", desc: "Subscription library of templates, stock videos, graphics, music, fonts, presentation assets, and themes.", link: "https://affiliate.gpn.com/envato" },
  { name: "Figma", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=figma.com", desc: "Collaborative interface design platform for wireframes, prototypes, design systems, and developer handoff.", link: "https://affiliate.gpn.com/figma" },
  { name: "CorelDRAW", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=coreldraw.com", desc: "Vector illustration and page layout software for branding, signs, print design, typography, and graphics.", link: "https://affiliate.gpn.com/corel" },
  { name: "Autodesk", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=autodesk.com", desc: "Professional CAD, BIM, engineering, animation, and 3D design software for technical production.", link: "https://affiliate.gpn.com/autodesk" },
  { name: "SketchUp", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=sketchup.com", desc: "3D modeling tool for architecture, interiors, construction planning, product concepts, and visual studies.", link: "https://affiliate.gpn.com/sketchup" },
  { name: "SolidWorks", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=solidworks.com", desc: "Mechanical CAD software for product design, assemblies, drawings, simulation, manufacturing, and engineering workflows.", link: "https://affiliate.gpn.com/solidworks" },
  { name: "Blender Market", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=blendermarket.com", desc: "Marketplace for Blender add-ons, shaders, 3D models, materials, rigs, and production assets.", link: "https://affiliate.gpn.com/blender" },
  { name: "Filmora", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=filmora.wondershare.com", desc: "Accessible video editor for creators with effects, transitions, titles, AI tools, audio cleanup, and exports.", link: "https://affiliate.gpn.com/filmora" },
  { name: "Final Cut Pro", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=apple.com", desc: "Apple professional video editor for timeline editing, color work, motion graphics, multicam, and delivery.", link: "https://affiliate.gpn.com/finalcut" },
  { name: "Movavi", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=movavi.com", desc: "Video editing and screen capture software for quick edits, tutorials, slideshow videos, and social content.", link: "https://affiliate.gpn.com/movavi" },
  { name: "Camtasia", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=techsmith.com", desc: "Screen recording and video editing tool for tutorials, training videos, demos, captions, and annotations.", link: "https://affiliate.gpn.com/camtasia" },
  { name: "Notion", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=notion.so", desc: "Connected workspace for notes, documents, databases, project tracking, wikis, calendars, and team knowledge.", link: "https://affiliate.gpn.com/notion" },
  { name: "Webflow", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=webflow.com", desc: "Visual website builder and CMS for responsive sites, landing pages, animations, hosting, and client projects.", link: "https://affiliate.gpn.com/webflow" },
  { name: "Monday.com", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=monday.com", desc: "Work management platform for projects, automations, CRM pipelines, task boards, dashboards, and team operations.", link: "https://affiliate.gpn.com/monday" },
  { name: "FreshBooks", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=freshbooks.com", desc: "Accounting software for invoices, expenses, time tracking, payments, reports, and small business finance.", link: "https://affiliate.gpn.com/freshbooks" },
  { name: "SEMrush", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=semrush.com", desc: "SEO and digital marketing platform for keyword research, competitive analysis, content planning, and rank tracking.", link: "https://affiliate.gpn.com/semrush" },
  { name: "ConvertKit", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=convertkit.com", desc: "Email marketing platform for creators with forms, newsletters, landing pages, automations, and audience monetization.", link: "https://affiliate.gpn.com/convertkit" },
  { name: "Ahrefs", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=ahrefs.com", desc: "SEO toolset for backlink analysis, keyword ideas, competitor research, site audits, and content opportunities.", link: "https://affiliate.gpn.com/ahrefs" },
  { name: "Jasper AI", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=jasper.ai", desc: "AI writing and marketing assistant for campaigns, brand voice, blog drafts, ad copy, and content workflows.", link: "https://affiliate.gpn.com/jasper" },
  { name: "Surfer SEO", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=surferseo.com", desc: "Content optimization platform for SEO briefs, SERP analysis, article scoring, topical maps, and content audits.", link: "https://affiliate.gpn.com/surfer" },
  { name: "Shopify", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=shopify.com", desc: "Commerce platform for online stores, checkout, inventory, payments, apps, themes, and multi-channel selling.", link: "https://affiliate.gpn.com/shopify" },
  { name: "BigCommerce", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=bigcommerce.com", desc: "E-commerce platform for scalable storefronts, catalog management, payments, B2B tools, and integrations.", link: "https://affiliate.gpn.com/bigcommerce" },
  { name: "Kinsta", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=kinsta.com", desc: "Managed hosting for WordPress and web apps with performance tools, security, staging, and cloud infrastructure.", link: "https://affiliate.gpn.com/kinsta" },
  { name: "WP Engine", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=wpengine.com", desc: "Managed WordPress hosting platform for secure sites, staging, performance, backups, and developer workflows.", link: "https://affiliate.gpn.com/wpengine" },
  { name: "Booking.com", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=booking.com", desc: "Travel marketplace for hotels, apartments, flights, car rentals, airport taxis, and vacation stays.", link: "https://affiliate.gpn.com/booking" },
  { name: "TripAdvisor", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=tripadvisor.com", desc: "Travel research platform with reviews, destination guides, restaurants, attractions, hotels, and booking links.", link: "https://affiliate.gpn.com/tripadvisor" },
  { name: "Expedia", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=expedia.com", desc: "Travel booking site for flights, hotels, packages, car rentals, cruises, activities, and itinerary planning.", link: "https://affiliate.gpn.com/expedia" },
  { name: "Airbnb", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=airbnb.com", desc: "Marketplace for homes, rooms, experiences, long stays, unique properties, and host-led travel options.", link: "https://affiliate.gpn.com/airbnb" },
  { name: "NordVPN", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=nordvpn.com", desc: "VPN service for encrypted browsing, privacy protection, secure Wi-Fi, threat protection, and global servers.", link: "https://affiliate.gpn.com/nordvpn" },
  { name: "ExpressVPN", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=expressvpn.com", desc: "Privacy VPN for secure browsing, location protection, streaming access, router apps, and cross-device coverage.", link: "https://affiliate.gpn.com/expressvpn" },
  { name: "Surfshark", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=surfshark.com", desc: "VPN and cybersecurity suite for private browsing, antivirus, data breach alerts, and unlimited-device protection.", link: "https://affiliate.gpn.com/surfshark" },
  { name: "Amazon Associates", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=amazon.com", desc: "Retail affiliate marketplace for gaming gear, electronics, accessories, software, books, and everyday products.", link: "https://affiliate.gpn.com/amazon-associates" },
  { name: "Epic Games", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=epicgames.com", desc: "Game store and publisher platform for PC games, creator tools, Unreal Engine projects, and popular titles.", link: "https://affiliate.gpn.com/epic-games" },
  { name: "GameStop", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=gamestop.com", desc: "Retail destination for console games, gaming hardware, collectibles, accessories, and pre-owned gaming products.", link: "https://affiliate.gpn.com/gamestop" },
  { name: "Razer", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=razer.com", desc: "Gaming hardware brand for laptops, keyboards, mice, headsets, microphones, chairs, and streaming accessories.", link: "https://affiliate.gpn.com/razer-hardware" },
  { name: "Alienware", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=alienware.com", desc: "Gaming PC and laptop brand focused on high-performance desktops, displays, peripherals, and gaming setups.", link: "https://affiliate.gpn.com/alienware" },
  { name: "Logitech", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=logitechg.com", desc: "Hardware maker for gaming mice, keyboards, webcams, headsets, controllers, racing wheels, and creator devices.", link: "https://affiliate.gpn.com/logitech" },
  { name: "Nvidia", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=nvidia.com", desc: "Graphics technology platform for GPUs, AI computing, game streaming, drivers, creative tools, and workstation power.", link: "https://affiliate.gpn.com/nvidia" },
  { name: "Kinguin", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=kinguin.net", desc: "Digital marketplace for PC game keys, software keys, gift cards, and gaming deals from global sellers.", link: "https://affiliate.gpn.com/kinguin" },
  { name: "CDKeys", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=cdkeys.com", desc: "Game key marketplace for digital codes, subscriptions, gift cards, and downloadable gaming products.", link: "https://affiliate.gpn.com/cdkeys" },
  { name: "Zygor Guides", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=zygorguides.com", desc: "In-game guide software for leveling, quests, achievements, professions, and route planning in supported games.", link: "https://affiliate.gpn.com/zygor" },
  { name: "Leprestore", category: "Gaming & Hardware", logo: "https://www.google.com/s2/favicons?sz=96&domain=leprestore.com", desc: "Game services platform for boosting, coaching, raid assistance, account progression, and in-game achievements.", link: "https://affiliate.gpn.com/leprestore" },
  { name: "Twitch", category: "Entertainment & Streaming", logo: "https://www.google.com/s2/favicons?sz=96&domain=twitch.tv", desc: "Live streaming platform for gaming, creator broadcasts, community chat, events, and interactive entertainment.", link: "https://affiliate.gpn.com/twitch" },
  { name: "Hulu", category: "Entertainment & Streaming", logo: "https://www.google.com/s2/favicons?sz=96&domain=hulu.com", desc: "Streaming platform for TV shows, movies, originals, live television bundles, and entertainment subscriptions.", link: "https://affiliate.gpn.com/hulu" },
  { name: "Prime Video", category: "Entertainment & Streaming", logo: "https://www.google.com/s2/favicons?sz=96&domain=primevideo.com", desc: "Video streaming service for films, series, originals, rentals, channels, and entertainment libraries.", link: "https://affiliate.gpn.com/prime-video" },
  { name: "Audible", category: "Entertainment & Streaming", logo: "https://www.google.com/s2/favicons?sz=96&domain=audible.com", desc: "Audiobook and spoken-word platform for books, podcasts, originals, learning content, and audio storytelling.", link: "https://affiliate.gpn.com/audible" },
  { name: "Plex", category: "Entertainment & Streaming", logo: "https://www.google.com/s2/favicons?sz=96&domain=plex.tv", desc: "Media platform for streaming, organizing personal libraries, live TV, movies, shows, and media servers.", link: "https://affiliate.gpn.com/plex" },
  { name: "Amazon Music", category: "Entertainment & Streaming", logo: "https://www.google.com/s2/favicons?sz=96&domain=music.amazon.com", desc: "Music streaming service for songs, albums, playlists, podcasts, stations, and connected listening.", link: "https://affiliate.gpn.com/amazon-music" },
  { name: "Platinumlist", category: "Entertainment & Streaming", logo: "https://www.google.com/s2/favicons?sz=96&domain=platinumlist.net", desc: "Event ticketing platform for concerts, shows, festivals, sports, attractions, and live entertainment experiences.", link: "https://affiliate.gpn.com/platinumlist" },
  { name: "bet365 Partners", category: "iGaming & Betting", logo: "https://www.google.com/s2/favicons?sz=96&domain=bet365partners.com", desc: "Sports betting partner program connected to online sportsbook markets, live events, and gaming promotions.", link: "https://affiliate.gpn.com/bet365-partners" },
  { name: "Betsson Group Affiliates", category: "iGaming & Betting", logo: "https://www.google.com/s2/favicons?sz=96&domain=betssongroupaffiliates.com", desc: "Partner network for online casino, sportsbook brands, gaming offers, and betting entertainment platforms.", link: "https://affiliate.gpn.com/betsson" },
  { name: "1xPartners", category: "iGaming & Betting", logo: "https://www.google.com/s2/favicons?sz=96&domain=1xpartners.com", desc: "Sports and casino affiliate platform for betting products, online games, promotions, and performance campaigns.", link: "https://affiliate.gpn.com/1xpartners" },
  { name: "V.Partners", category: "iGaming & Betting", logo: "https://www.google.com/s2/favicons?sz=96&domain=v.partners", desc: "Casino partner network for gaming brands, player acquisition, promotional campaigns, and casino entertainment.", link: "https://affiliate.gpn.com/v-partners" },
  { name: "Bluefox Partners", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=bluefox.partners", desc: "iGaming affiliate inspiration with landing page concepts, neon palettes, dark UI direction, and 3D mascot ideas.", link: "https://affiliate.gpn.com/bluefox-partners" },
  { name: "Akliz", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=akliz.net", desc: "Gaming server hosting assets including logos, banners, badges, seals, and editable PSD creative files.", link: "https://affiliate.gpn.com/akliz-assets" },
  { name: "IndieGameStand", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=indiegamestand.com", desc: "Indie game affiliate creative reference for 300x250 banner ad layouts and compact promo graphics.", link: "https://affiliate.gpn.com/indiegamestand-assets" },
  { name: "YouTube Shopping", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=youtube.com", desc: "Shopping design inspiration with 3D visual systems, motion design, event branding, badges, and stickers.", link: "https://affiliate.gpn.com/youtube-shopping-assets" },
  { name: "WagerPilot", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=wagerpilot.com", desc: "iGaming identity reference with logo systems, color palette, typography, Figma UI kit, and WordPress design patterns.", link: "https://affiliate.gpn.com/wagerpilot-assets" },
  { name: "LivLive", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=liv.live", desc: "Referral program asset source for logo libraries, graphics, short videos, and brand guidelines.", link: "https://affiliate.gpn.com/livlive-assets" },
  { name: "IconScout", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=iconscout.com", desc: "Affiliate marketing design library for Lottie animations, GIFs, static SVGs, AEP files, and MP4 motion assets.", link: "https://affiliate.gpn.com/iconscout-assets" },
  { name: "PIN-UP Partners", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=pin-up.partners", desc: "iGaming creative inspiration with visual creatives, animations, gamification elements, and localized design assets.", link: "https://affiliate.gpn.com/pin-up-partners-assets" },
  { name: "Scaleo", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=scaleo.io", desc: "Affiliate platform inspiration with pre-approved creatives, dynamic landers, deep links, and email snippets.", link: "https://affiliate.gpn.com/scaleo-assets" },
  { name: "Vegas Kings", category: "Design Assets & Inspiration", logo: "https://www.google.com/s2/favicons?sz=96&domain=vegaskings.com", desc: "iGaming campaign design reference for design psychology, landing page best practices, and campaign creative ideas.", link: "https://affiliate.gpn.com/vegas-kings-assets" }
];

programsList.push(
  { name: "HubSpot", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=hubspot.com", desc: "CRM and marketing platform for content, email, sales pipelines, automation, landing pages, and customer growth.", link: "https://affiliate.gpn.com/hubspot" },
  { name: "Semrush", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=semrush.com", desc: "SEO and marketing suite for keyword research, competitor tracking, content strategy, and campaign analysis.", link: "https://affiliate.gpn.com/semrush-marketing" },
  { name: "Ahrefs", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=ahrefs.com", desc: "SEO research tool for backlinks, keywords, audits, rank tracking, and competitive content discovery.", link: "https://affiliate.gpn.com/ahrefs-marketing" },
  { name: "ConvertKit", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=convertkit.com", desc: "Creator email platform for newsletters, landing pages, forms, automations, tagging, and audience monetization.", link: "https://affiliate.gpn.com/convertkit-marketing" },
  { name: "Mailchimp", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=mailchimp.com", desc: "Email and marketing platform for newsletters, segmentation, automation, landing pages, and campaign reporting.", link: "https://affiliate.gpn.com/mailchimp" },
  { name: "ActiveCampaign", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=activecampaign.com", desc: "Marketing automation platform for email, CRM, customer journeys, messaging, and sales follow-up.", link: "https://affiliate.gpn.com/activecampaign" },
  { name: "GetResponse", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=getresponse.com", desc: "Marketing tool for email campaigns, automation, webinars, landing pages, forms, and conversion funnels.", link: "https://affiliate.gpn.com/getresponse" },
  { name: "ClickFunnels", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=clickfunnels.com", desc: "Sales funnel builder for landing pages, checkout flows, lead capture, upsells, and online campaigns.", link: "https://affiliate.gpn.com/clickfunnels" },
  { name: "Kajabi", category: "Marketing", logo: "https://www.google.com/s2/favicons?sz=96&domain=kajabi.com", desc: "Creator business platform for courses, memberships, landing pages, email marketing, and digital products.", link: "https://affiliate.gpn.com/kajabi" },
  { name: "Shopify", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=shopify.com", desc: "Commerce platform for online stores, product catalogs, checkout, payments, inventory, apps, and selling channels.", link: "https://affiliate.gpn.com/shopify-ecommerce" },
  { name: "WooCommerce", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=woocommerce.com", desc: "WordPress commerce plugin for stores, carts, checkout, product management, payments, and extensions.", link: "https://affiliate.gpn.com/woocommerce" },
  { name: "BigCommerce", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=bigcommerce.com", desc: "Scalable e-commerce platform for storefronts, B2B sales, checkout, integrations, and catalog operations.", link: "https://affiliate.gpn.com/bigcommerce-ecommerce" },
  { name: "Wix E-commerce", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=wix.com", desc: "Website and store builder for product pages, bookings, payments, marketing tools, and small business sites.", link: "https://affiliate.gpn.com/wix-ecommerce" },
  { name: "Squarespace", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=squarespace.com", desc: "Website and commerce builder for portfolios, stores, services, scheduling, templates, and branded checkout.", link: "https://affiliate.gpn.com/squarespace" },
  { name: "Ecwid", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=ecwid.com", desc: "Online store tool for adding products, carts, payments, and selling features to existing websites.", link: "https://affiliate.gpn.com/ecwid" },
  { name: "Sellfy", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=sellfy.com", desc: "Storefront platform for selling digital products, physical goods, subscriptions, print-on-demand, and downloads.", link: "https://affiliate.gpn.com/sellfy" },
  { name: "Gumroad", category: "E-commerce", logo: "https://www.google.com/s2/favicons?sz=96&domain=gumroad.com", desc: "Creator commerce platform for selling files, memberships, software, courses, templates, and digital products.", link: "https://affiliate.gpn.com/gumroad" },
  { name: "Skyscanner", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=skyscanner.com", desc: "Travel search platform for comparing flights, hotels, car rentals, routes, and trip pricing.", link: "https://affiliate.gpn.com/skyscanner" },
  { name: "Booking.com", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=booking.com", desc: "Travel marketplace for hotels, apartments, flights, cars, taxis, and vacation stays.", link: "https://affiliate.gpn.com/booking-travel" },
  { name: "Expedia", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=expedia.com", desc: "Travel booking site for flights, hotels, packages, cruises, rental cars, and activities.", link: "https://affiliate.gpn.com/expedia-travel" },
  { name: "Agoda", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=agoda.com", desc: "Travel booking platform for hotels, apartments, homes, flights, and destination deals.", link: "https://affiliate.gpn.com/agoda" },
  { name: "Trip.com", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=trip.com", desc: "Travel service for flights, hotels, trains, car rentals, tours, and international trip planning.", link: "https://affiliate.gpn.com/trip-com" },
  { name: "Kayak", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=kayak.com", desc: "Travel search engine for comparing flights, stays, rental cars, packages, and trip tools.", link: "https://affiliate.gpn.com/kayak" },
  { name: "Pelago by Singapore Airlines", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=pelago.com", desc: "Travel experiences platform for activities, attractions, tours, events, and destination discovery.", link: "https://affiliate.gpn.com/pelago" },
  { name: "La Compagnie Airlines", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=lacompagnie.com", desc: "Airline service focused on premium long-haul travel, flight booking, and business-class experiences.", link: "https://affiliate.gpn.com/la-compagnie" },
  { name: "Extra Holidays", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=extraholidays.com", desc: "Vacation rental booking platform for resort stays, family trips, condos, and leisure travel.", link: "https://affiliate.gpn.com/extra-holidays" },
  { name: "Tinggly", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=tinggly.com", desc: "Experience gift platform for travel activities, adventure boxes, hotel stays, and memorable trips.", link: "https://affiliate.gpn.com/tinggly" },
  { name: "Elife Transfer", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=elifelimo.com", desc: "Private transfer and chauffeur service for airport rides, business travel, and city transportation.", link: "https://affiliate.gpn.com/elife-transfer" },
  { name: "Backpack Travel Insurance", category: "Travel", logo: "https://www.google.com/s2/favicons?sz=96&domain=backpackertravelinsurance.com", desc: "Travel insurance option for backpackers, long trips, adventure travel, and international journeys.", link: "https://affiliate.gpn.com/backpack-insurance" },
  { name: "NordVPN", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=nordvpn.com", desc: "VPN service for encrypted browsing, threat protection, secure Wi-Fi, and privacy across devices.", link: "https://affiliate.gpn.com/nordvpn-vpn" },
  { name: "ExpressVPN", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=expressvpn.com", desc: "Privacy VPN for secure browsing, location protection, router apps, streaming access, and device coverage.", link: "https://affiliate.gpn.com/expressvpn-vpn" },
  { name: "Surfshark", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=surfshark.com", desc: "Cybersecurity suite with VPN, antivirus, breach alerts, private search, and unlimited-device support.", link: "https://affiliate.gpn.com/surfshark-vpn" },
  { name: "CyberGhost", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=cyberghostvpn.com", desc: "VPN service for private browsing, streaming servers, public Wi-Fi security, and cross-platform apps.", link: "https://affiliate.gpn.com/cyberghost" },
  { name: "IPVanish", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=ipvanish.com", desc: "VPN service for encrypted internet access, privacy tools, device protection, and secure connections.", link: "https://affiliate.gpn.com/ipvanish" },
  { name: "Private Internet Access", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=privateinternetaccess.com", desc: "VPN provider for encrypted browsing, open-source apps, privacy controls, and secure global servers.", link: "https://affiliate.gpn.com/private-internet-access" },
  { name: "Hotspot Shield", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=hotspotshield.com", desc: "VPN product for secure browsing, Wi-Fi protection, location privacy, and fast encrypted access.", link: "https://affiliate.gpn.com/hotspot-shield" },
  { name: "TunnelBear", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=tunnelbear.com", desc: "Simple VPN service for private browsing, public Wi-Fi protection, and location masking.", link: "https://affiliate.gpn.com/tunnelbear" },
  { name: "TorGuard", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=torguard.net", desc: "VPN and privacy service for encrypted access, business plans, proxies, and secure browsing.", link: "https://affiliate.gpn.com/torguard" },
  { name: "PrivateVPN", category: "VPN", logo: "https://www.google.com/s2/favicons?sz=96&domain=privatevpn.com", desc: "VPN service for online privacy, streaming access, encrypted connections, and cross-device protection.", link: "https://affiliate.gpn.com/privatevpn" },
  { name: "Adobe Creative Cloud", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=adobe.com", desc: "Creative software subscription for design, photography, video, layout, illustration, and publishing workflows.", link: "https://affiliate.gpn.com/adobe-saas" },
  { name: "Semrush", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=semrush.com", desc: "Cloud marketing platform for SEO, content research, competitor insights, traffic analysis, and reporting.", link: "https://affiliate.gpn.com/semrush-saas" },
  { name: "Zapier", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=zapier.com", desc: "Automation platform that connects apps, moves data, triggers workflows, and reduces manual tasks.", link: "https://affiliate.gpn.com/zapier" },
  { name: "Airtable", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=airtable.com", desc: "Collaborative database platform for project tracking, content calendars, workflows, records, and dashboards.", link: "https://affiliate.gpn.com/airtable" },
  { name: "Monday.com", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=monday.com", desc: "Work platform for task boards, CRM, automations, dashboards, team planning, and operations.", link: "https://affiliate.gpn.com/monday-saas" },
  { name: "Asana", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=asana.com", desc: "Project management tool for tasks, timelines, goals, team coordination, approvals, and workflow visibility.", link: "https://affiliate.gpn.com/asana" },
  { name: "Trello", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=trello.com", desc: "Kanban project board for task cards, lists, checklists, collaboration, automation, and lightweight planning.", link: "https://affiliate.gpn.com/trello" },
  { name: "Notion", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=notion.so", desc: "Workspace for documents, notes, databases, wikis, project tracking, calendars, and team knowledge.", link: "https://affiliate.gpn.com/notion-saas" },
  { name: "ClickUp", category: "SaaS", logo: "https://www.google.com/s2/favicons?sz=96&domain=clickup.com", desc: "Productivity platform for tasks, docs, goals, dashboards, time tracking, automation, and team workspaces.", link: "https://affiliate.gpn.com/clickup" },
  { name: "Adobe Premiere Pro", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=adobe.com", desc: "Professional video editor for timelines, color, audio, captions, effects, multicam, and production delivery.", link: "https://affiliate.gpn.com/premiere-pro" },
  { name: "DaVinci Resolve", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=blackmagicdesign.com", desc: "Video editing, color grading, audio, effects, and finishing software for professional post-production.", link: "https://affiliate.gpn.com/davinci-resolve" },
  { name: "Wondershare Filmora", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=filmora.wondershare.com", desc: "Creator-friendly video editor for effects, transitions, titles, AI tools, audio cleanup, and exports.", link: "https://affiliate.gpn.com/wondershare-filmora" },
  { name: "CyberLink PowerDirector", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=cyberlink.com", desc: "Video editing suite for creators with effects, templates, motion graphics, AI tools, and social exports.", link: "https://affiliate.gpn.com/powerdirector" },
  { name: "Final Cut Pro", category: "Video Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=apple.com", desc: "Apple video editor for professional timelines, color correction, effects, multicam, and final delivery.", link: "https://affiliate.gpn.com/final-cut-pro" },
  { name: "Adobe Photoshop", category: "Photo Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=adobe.com", desc: "Photo editing and compositing tool for retouching, graphics, image correction, layers, and creative production.", link: "https://affiliate.gpn.com/photoshop" },
  { name: "Canva", category: "Photo Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=canva.com", desc: "Design and image editing tool for social graphics, templates, brand kits, presentations, and quick visuals.", link: "https://affiliate.gpn.com/canva-photo" },
  { name: "CorelDRAW", category: "Photo Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=coreldraw.com", desc: "Graphics suite for illustration, layout, typography, photo adjustment, print design, and branding.", link: "https://affiliate.gpn.com/coreldraw-photo" },
  { name: "Affinity Photo", category: "Photo Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=affinity.serif.com", desc: "Photo editing software for retouching, compositing, RAW processing, layers, masks, and image finishing.", link: "https://affiliate.gpn.com/affinity-photo" },
  { name: "Pixlr", category: "Photo Editing", logo: "https://www.google.com/s2/favicons?sz=96&domain=pixlr.com", desc: "Browser photo editor for quick image edits, AI tools, templates, background removal, and graphics.", link: "https://affiliate.gpn.com/pixlr" },
  { name: "FL Studio", category: "Music Editors", logo: "https://www.google.com/s2/favicons?sz=96&domain=image-line.com", desc: "Digital audio workstation for beat making, recording, sequencing, mixing, plugins, and music production.", link: "https://affiliate.gpn.com/fl-studio" },
  { name: "Adobe Audition", category: "Music Editors", logo: "https://www.google.com/s2/favicons?sz=96&domain=adobe.com", desc: "Audio editor for recording, restoration, mixing, podcast cleanup, voiceover work, and post-production.", link: "https://affiliate.gpn.com/adobe-audition" },
  { name: "Plugin Boutique", category: "Music Editors", logo: "https://www.google.com/s2/favicons?sz=96&domain=pluginboutique.com", desc: "Marketplace for audio plugins, virtual instruments, effects, sound tools, and production software.", link: "https://affiliate.gpn.com/plugin-boutique" },
  { name: "Loopmasters", category: "Music Editors", logo: "https://www.google.com/s2/favicons?sz=96&domain=loopmasters.com", desc: "Sample and loop library for producers with sound packs, beats, instruments, vocals, and production assets.", link: "https://affiliate.gpn.com/loopmasters" },
  { name: "Sweetwater", category: "Music Editors", logo: "https://www.google.com/s2/favicons?sz=96&domain=sweetwater.com", desc: "Music gear retailer for studio equipment, instruments, microphones, audio interfaces, plugins, and production tools.", link: "https://affiliate.gpn.com/sweetwater" },
  { name: "AutoCAD", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=autodesk.com", desc: "CAD software for precise 2D drafting, 3D modeling, technical drawings, documentation, and engineering design.", link: "https://affiliate.gpn.com/autocad" },
  { name: "SketchUp", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=sketchup.com", desc: "3D modeling software for architecture, interiors, construction, concepts, presentation models, and visualization.", link: "https://affiliate.gpn.com/sketchup-cad" },
  { name: "SolidWorks", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=solidworks.com", desc: "Mechanical design tool for parts, assemblies, drawings, simulations, manufacturing data, and engineering workflows.", link: "https://affiliate.gpn.com/solidworks-cad" },
  { name: "Fusion 360", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=autodesk.com", desc: "Integrated CAD, CAM, CAE, and PCB platform for product design, simulation, manufacturing, and collaboration.", link: "https://affiliate.gpn.com/fusion-360" },
  { name: "Blender", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=blender.org", desc: "Open-source 3D suite for modeling, animation, sculpting, rendering, VFX, motion graphics, and assets.", link: "https://affiliate.gpn.com/blender-cad" },
  { name: "ActCAD", category: "CAD/3D", logo: "https://www.google.com/s2/favicons?sz=96&domain=actcad.com", desc: "CAD drafting software for 2D drawings, 3D modeling, DWG workflows, and engineering documentation.", link: "https://affiliate.gpn.com/actcad" },
  { name: "Canva", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=canva.com", desc: "Design platform for presentations, social media, brand assets, documents, videos, and template-based visuals.", link: "https://affiliate.gpn.com/canva-design" },
  { name: "Figma", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=figma.com", desc: "Collaborative design tool for UI screens, prototypes, design systems, whiteboards, and developer handoff.", link: "https://affiliate.gpn.com/figma-design" },
  { name: "Adobe Creative Cloud", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=adobe.com", desc: "Creative suite for Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, and production workflows.", link: "https://affiliate.gpn.com/adobe-design" },
  { name: "Envato Elements", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=elements.envato.com", desc: "Subscription library for templates, graphics, videos, music, fonts, themes, and creative production assets.", link: "https://affiliate.gpn.com/envato-design" },
  { name: "CorelDRAW", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=coreldraw.com", desc: "Vector and layout design suite for signs, print work, logos, illustration, typography, and branding.", link: "https://affiliate.gpn.com/coreldraw-design" },
  { name: "Sketch", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=sketch.com", desc: "Mac design platform for UI layouts, symbols, prototypes, collaboration, and design systems.", link: "https://affiliate.gpn.com/sketch-design" },
  { name: "InVision", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=invisionapp.com", desc: "Design collaboration and prototyping tool for feedback, flows, stakeholder reviews, and product planning.", link: "https://affiliate.gpn.com/invision" },
  { name: "Framer", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=framer.com", desc: "Interactive website and prototype builder for landing pages, animated interfaces, publishing, and design systems.", link: "https://affiliate.gpn.com/framer" },
  { name: "Procreate", category: "Design", logo: "https://www.google.com/s2/favicons?sz=96&domain=procreate.com", desc: "Digital illustration app for sketching, painting, lettering, concept art, and creative tablet workflows.", link: "https://affiliate.gpn.com/procreate" }
);

programsList.push(
  { name: "Picsart", category: "Poster Creation & Design Platforms", logo: "https://www.google.com/s2/favicons?sz=96&domain=picsart.com", desc: "AI design and photo editor for posters, social graphics, image editing, templates, stickers, and creative assets.", link: "https://affiliate.gpn.com/picsart" },
  { name: "Photoroom", category: "Poster Creation & Design Platforms", logo: "https://www.google.com/s2/favicons?sz=96&domain=photoroom.com", desc: "AI photo editing platform for background removal, product photos, marketing images, batch edits, and clean visuals.", link: "https://affiliate.gpn.com/photoroom" },
  { name: "Pippit AI", category: "Poster Creation & Design Platforms", logo: "https://www.google.com/s2/favicons?sz=96&domain=pippit.capcut.com", desc: "CapCut-powered AI poster and marketing creator for campaign visuals, product content, videos, and promotional designs.", link: "https://affiliate.gpn.com/pippit-ai" },
  { name: "Better Printzz", category: "Poster Creation & Design Platforms", logo: "https://www.google.com/s2/favicons?sz=96&domain=betterprintzz.com", desc: "Print-on-demand platform for custom printed products, poster-style merchandise, artwork, and production-ready designs.", link: "https://affiliate.gpn.com/better-printzz" },
  { name: "Inkifi", category: "Poster Creation & Design Platforms", logo: "https://www.google.com/s2/favicons?sz=96&domain=inkifi.com", desc: "Print-on-demand photo printing service for wall art, photo books, posters, framed prints, and visual keepsakes.", link: "https://affiliate.gpn.com/inkifi" },
  { name: "Dotyeti", category: "Poster Creation & Design Platforms", logo: "https://www.google.com/s2/favicons?sz=96&domain=dotyeti.com", desc: "Graphic design service for marketing creatives, posters, ads, social media graphics, branding, and design tasks.", link: "https://affiliate.gpn.com/dotyeti" },
  { name: "Canva", category: "Poster Creation & Design Platforms", logo: "https://www.google.com/s2/favicons?sz=96&domain=canva.com", desc: "Design platform for posters, presentations, social graphics, brand kits, templates, and visual content. Program closed January 2024 and is invite-only.", link: "https://affiliate.gpn.com/canva-poster" }
);

const categoryOrder = ["Gaming & Entertainment", "Gaming & Hardware", "Entertainment & Streaming", "iGaming & Betting", "Design Assets & Inspiration", "Poster Creation & Design Platforms", "Design", "Photo Editing", "Music Editors", "CAD/3D", "Video Editing", "SaaS", "Marketing", "E-commerce", "Travel", "VPN"];
const iconMap = {
  "Gaming & Entertainment": "fas fa-gamepad",
  "Gaming & Hardware": "fas fa-keyboard",
  "Entertainment & Streaming": "fas fa-tv",
  "iGaming & Betting": "fas fa-dice",
  "Design Assets & Inspiration": "fas fa-swatchbook",
  "Poster Creation & Design Platforms": "fas fa-object-group",
  Design: "fas fa-paintbrush",
  "Photo Editing": "fas fa-image",
  "Music Editors": "fas fa-music",
  "CAD/3D": "fas fa-cube",
  "Video Editing": "fas fa-video",
  SaaS: "fas fa-cloud",
  Marketing: "fas fa-chart-line",
  "E-commerce": "fas fa-shopping-cart",
  Travel: "fas fa-plane",
  VPN: "fas fa-shield-alt"
};

const categoryMap = programsList.reduce((map, program) => {
  if (!map[program.category]) map[program.category] = [];
  map[program.category].push(program);
  return map;
}, {});

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function setTheme(themeName) {
  document.body.className = themeName;
  localStorage.setItem(storageKeys.theme, themeName);
  currentTheme = themeName;
}

function renderCategories(searchCat = "", filterCat = "all") {
  const container = document.getElementById("categoriesContainer");
  if (!container) return;

  const searchTerm = searchCat.trim().toLowerCase();
  container.innerHTML = "";

  categoryOrder.forEach((category) => {
    if (filterCat !== "all" && filterCat !== category) return;
    if (searchTerm && !category.toLowerCase().includes(searchTerm)) return;

    const items = categoryMap[category] || [];
    if (!items.length) return;

    const wrapper = document.createElement("section");
    wrapper.className = "category-wrapper";
    wrapper.innerHTML = `
      <div class="category-header">
        <div class="category-title-main">
          <i class="${iconMap[category]}"></i>
          <h2>${escapeHtml(category)}</h2>
        </div>
      </div>
      <div class="category-grid"></div>
    `;

    const isExpanded = expandedCategories.has(category);
    const visibleItems = isExpanded ? items : items.slice(0, categoryPreviewLimit);
    const grid = wrapper.querySelector(".category-grid");

    visibleItems.forEach((program) => {
      const card = document.createElement("article");
      card.className = "affiliate-card";
      card.innerHTML = `
        <div style="display:flex; gap:1rem; align-items:center;">
          <img src="${program.logo}" class="affiliate-logo" alt="${escapeHtml(program.name)} logo">
          <div>
            <h3>${escapeHtml(program.name)}</h3>
            <p style="font-size:0.85rem; margin-top:4px;">${escapeHtml(program.desc)}</p>
          </div>
        </div>
        <div style="text-align:right; margin-top:1rem;">
          <button class="get-link-btn affiliate-link-btn" data-link="${program.link}" type="button">
            <i class="fas fa-handshake"></i> Get in touch
          </button>
        </div>
        <div class="coming-soon-field" hidden>Coming soon</div>
      `;
      grid.appendChild(card);
    });

    if (items.length > categoryPreviewLimit) {
      const seeMoreWrap = document.createElement("div");
      seeMoreWrap.className = "see-more-wrap";
      seeMoreWrap.innerHTML = `
        <button class="get-link-btn see-more-btn ${isExpanded ? "is-expanded" : ""}" data-category="${escapeHtml(category)}" type="button">
          ${isExpanded ? "See less" : "See more"}
        </button>
      `;
      wrapper.appendChild(seeMoreWrap);
    }

    container.appendChild(wrapper);
  });

  attachLinkEvents();
  attachSeeMoreEvents();
}

function attachSeeMoreEvents() {
  document.querySelectorAll(".see-more-btn").forEach((button) => {
    button.onclick = () => {
      const category = button.getAttribute("data-category");
      if (expandedCategories.has(category)) {
        expandedCategories.delete(category);
      } else {
        expandedCategories.add(category);
      }
      const searchInput = document.getElementById("searchInput");
      const categoryFilter = document.getElementById("categoryFilter");
      renderCategories(searchInput?.value || "", categoryFilter?.value || "all");
    };
  });
}

function attachLinkEvents() {
  document.querySelectorAll(".affiliate-link-btn, .join-now-btn").forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      showQuantumLoader(() => showComingSoonOverlay(), {
        text: "Loading...",
        duration: 3000
      });
    };
  });
}

function startSlideshow() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  setInterval(() => {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }, 5000);
}

function closeSideMenu() {
  document.getElementById("sideMenu")?.classList.remove("open");
  document.getElementById("menuOverlay")?.classList.remove("active");
}

function initSideMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("menuOverlay");

  document.getElementById("menuToggleBtn")?.addEventListener("click", () => {
    menu.classList.add("open");
    overlay.classList.add("active");
  });

  document.getElementById("closeMenuBtn")?.addEventListener("click", closeSideMenu);
  overlay?.addEventListener("click", closeSideMenu);
  document.querySelectorAll(".side-nav a").forEach((link) => link.addEventListener("click", closeSideMenu));
}

function initThemeDropdown() {
  const themeBtn = document.getElementById("themeDropdownBtn");
  const themeOpts = document.getElementById("themeOptions");

  themeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    themeOpts.style.display = themeOpts.style.display === "flex" ? "none" : "flex";
  });

  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.getAttribute("data-theme"));
      themeOpts.style.display = "none";
    });
  });
}

window.showMainContent = function() {
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("newsPage").style.display = "none";
  document.getElementById("quickContactPage").style.display = "none";
};

window.showNewsPage = function() {
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("newsPage").style.display = "block";
  document.getElementById("quickContactPage").style.display = "none";
  renderNewsPage();
  markNewsAsSeen();
};

window.showQuickContactPage = function() {
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("newsPage").style.display = "none";
  document.getElementById("quickContactPage").style.display = "block";
};

function renderNewsPage() {
  const container = document.getElementById("newsListContainer");
  if (!container) return;

  if (!newsArticles.length) {
    container.innerHTML = "<p style='text-align:center;'>No news yet. Admin can publish updates.</p>";
    return;
  }

  container.innerHTML = newsArticles.map((article) => `
    <article class="news-card">
      <h3>${escapeHtml(article.title)}</h3>
      <p>${escapeHtml(article.content)}</p>
      ${article.image ? `<img src="${article.image}" class="news-img" alt="News image">` : ""}
      <small>${new Date(article.date).toLocaleString()}</small>
    </article>
  `).join("");
}

function loadAdminNews() {
  const container = document.getElementById("adminNewsList");
  if (!container) return;

  if (!newsArticles.length) {
    container.innerHTML = "<p>No news has been created yet.</p>";
    return;
  }

  container.innerHTML = newsArticles.map((article, index) => `
    <div class="news-item">
      <div>
        <strong>${escapeHtml(article.title)}</strong>
        <p style="font-size:12px;">${escapeHtml(article.content.substring(0, 80))}${article.content.length > 80 ? "..." : ""}</p>
      </div>
      <button onclick="window.deleteNews(${index})" type="button">Delete</button>
    </div>
  `).join("");
}

function loadAdminSubscribers() {
  const container = document.getElementById("adminSubscribersList");
  if (!container) return;

  if (!subscribers.length) {
    container.innerHTML = "<p>No subscribers yet.</p>";
    return;
  }

  container.innerHTML = subscribers.map((subscriber, index) => `
    <div class="subscriber-item">
      <div>
        <strong>${escapeHtml(subscriber.email)}</strong>
        <p style="font-size:12px;">Subscribed: ${new Date(subscriber.date).toLocaleString()}</p>
      </div>
      <button onclick="window.deleteSubscriber(${index})" type="button">Delete</button>
    </div>
  `).join("");
}

function getVisitorStatsFromLocalStorage() {
  return calculateVisitorStats(getStoredVisits());
}

function calculateVisitorStats(visits) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayStart = startOfToday.getTime();
  const buckets = { today: 0, previousWeek: 0, previousMonth: 0, previousTwoMonths: 0, previousThreeMonths: 0, previousYear: 0 };

  visits.forEach((visit) => {
    const timestamp = typeof visit === "number" ? visit : visit.date;
    if (!timestamp) return;
    const age = now - timestamp;
    if (timestamp >= todayStart) buckets.today += 1;
    else if (age <= 7 * day) buckets.previousWeek += 1;
    else if (age <= 30 * day) buckets.previousMonth += 1;
    else if (age <= 60 * day) buckets.previousTwoMonths += 1;
    else if (age <= 90 * day) buckets.previousThreeMonths += 1;
    else if (age <= 365 * day) buckets.previousYear += 1;
  });

  return buckets;
}

function renderVisitorStats(stats = getVisitorStatsFromLocalStorage()) {
  const container = document.getElementById("adminVisitorStats");
  if (!container) return;

  const labels = [
    ["today", "Today", "fas fa-calendar-day"],
    ["previousWeek", "Previous 7 Days", "fas fa-calendar-week"],
    ["previousMonth", "8-30 Days Ago", "fas fa-calendar-days"],
    ["previousTwoMonths", "31-60 Days Ago", "fas fa-clock"],
    ["previousThreeMonths", "61-90 Days Ago", "fas fa-history"],
    ["previousYear", "91-365 Days Ago", "fas fa-chart-line"]
  ];

  container.innerHTML = labels.map(([key, label, icon]) => `
    <div class="visitor-stat-card">
      <strong><i class="${icon}"></i> ${label}</strong>
      <span>${stats[key] || 0}</span>
    </div>
  `).join("");
}

function getStoredVisits() {
  return JSON.parse(localStorage.getItem(storageKeys.visitors) || "[]").map((visit) => (
    typeof visit === "number" ? { date: visit, path: "/" } : visit
  ));
}

function saveStoredVisits(visits) {
  localStorage.setItem(storageKeys.visitors, JSON.stringify(visits));
}

function updateLatestVisit(updates = {}) {
  const visits = getStoredVisits();
  if (!visits.length) return;

  visits[visits.length - 1] = {
    ...visits[visits.length - 1],
    ...updates
  };
  saveStoredVisits(visits);
}

function rememberVisitorEmail(email, source = "Website") {
  if (!/^\S+@\S+\.\S+$/.test(email)) return;
  const normalizedEmail = email.trim().toLowerCase();
  const existing = visitorEmails.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (existing) {
    existing.lastSeen = Date.now();
    existing.source = source;
  } else {
    visitorEmails.unshift({
      email: email.trim(),
      source,
      firstSeen: Date.now(),
      lastSeen: Date.now()
    });
  }

  localStorage.setItem(storageKeys.visitorEmails, JSON.stringify(visitorEmails));
  updateLatestVisit({ email: email.trim() });
}

function renderVisitorEmails() {
  const container = document.getElementById("adminVisitorEmailsList");
  if (!container) return;

  if (!visitorEmails.length) {
    container.innerHTML = "<p>No captured emails yet. Browsers do not expose visitor emails automatically; emails appear here after newsletter or contact form submission.</p>";
    return;
  }

  container.innerHTML = visitorEmails.map((item) => `
    <div class="visitor-list-item">
      <div>
        <strong><i class="fas fa-envelope-circle-check"></i> ${escapeHtml(item.email)}</strong>
        <p>${escapeHtml(item.source)} - Last seen: ${new Date(item.lastSeen).toLocaleString()}</p>
      </div>
    </div>
  `).join("");
}

function renderVisitorHistory() {
  const container = document.getElementById("adminVisitorHistory");
  if (!container) return;
  const visits = getStoredVisits()
    .map((visit, index) => ({ ...visit, originalIndex: index }))
    .sort((a, b) => (b.date || 0) - (a.date || 0));

  if (!visits.length) {
    container.innerHTML = "<p>No visits recorded yet.</p>";
    return;
  }

  container.innerHTML = visits.slice(0, 50).map((visit) => {
    const locationButton = visit.location
      ? `<a class="location-link-btn" href="https://www.google.com/maps?q=${encodeURIComponent(`${visit.location.latitude},${visit.location.longitude}`)}" target="_blank" rel="noopener"><i class="fas fa-location-dot"></i> Open Location</a>`
      : `<span class="visitor-muted"><i class="fas fa-location-slash"></i> No location permission</span>`;
    const email = visit.email ? `<p><i class="fas fa-at"></i> Email: ${escapeHtml(visit.email)}</p>` : "";

    return `
      <div class="visitor-list-item">
        <div>
          <strong><i class="fas fa-user-clock"></i> ${new Date(visit.date).toLocaleString()}</strong>
          <p><i class="fas fa-link"></i> ${escapeHtml(visit.path || "/")} - ${escapeHtml(visit.timeZone || "Unknown timezone")}</p>
          ${email}
        </div>
        <div class="visitor-row-actions">
          ${locationButton}
          <button class="visitor-danger-btn" type="button" onclick="window.deleteVisitorHistory(${visit.originalIndex})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
    `;
  }).join("");
}

async function loadAdminVisitors() {
  renderVisitorStats();
  renderVisitorEmails();
  renderVisitorHistory();
}
function loadAdminMessages() {
  const container = document.getElementById("adminMessagesList");
  if (!container) return;

  if (!contactMessages.length) {
    container.innerHTML = "<p>No contact messages yet.</p>";
    return;
  }

  container.innerHTML = contactMessages.map((message, index) => `
    <div class="message-item">
      <div>
        <strong>${escapeHtml(message.name)}</strong>
        <p style="font-size:12px;">${escapeHtml(message.email)} - ${new Date(message.date).toLocaleString()}</p>
        <p>${escapeHtml(message.message)}</p>
      </div>
      <button onclick="window.deleteContactMessage(${index})" type="button">Delete</button>
    </div>
  `).join("");
}

window.deleteNews = function(index) {
  newsArticles.splice(index, 1);
  localStorage.setItem(storageKeys.news, JSON.stringify(newsArticles));
  loadAdminNews();
  renderNewsPage();
};

window.deleteSubscriber = function(index) {
  subscribers.splice(index, 1);
  localStorage.setItem(storageKeys.subscribers, JSON.stringify(subscribers));
  loadAdminSubscribers();
};

window.deleteContactMessage = function(index) {
  contactMessages.splice(index, 1);
  localStorage.setItem(storageKeys.messages, JSON.stringify(contactMessages));
  loadAdminMessages();
};

window.deleteVisitorHistory = function(index) {
  const visits = getStoredVisits();
  visits.splice(index, 1);
  saveStoredVisits(visits);
  loadAdminVisitors();
};

window.clearVisitorHistory = function() {
  if (!confirm("Clear all visitor history?")) return;
  saveStoredVisits([]);
  loadAdminVisitors();
};

function updateNewsCounter() {
  const badge = document.getElementById("newsCounterBadge");
  if (!badge) return;

  const lastSeen = Number(localStorage.getItem(storageKeys.lastSeenNews) || 0);
  const unread = Math.max(newsArticles.length - lastSeen, 0);
  badge.textContent = unread > 99 ? "99+" : String(unread);
  badge.hidden = unread === 0;
}

function markNewsAsSeen() {
  localStorage.setItem(storageKeys.lastSeenNews, String(newsArticles.length));
  updateNewsCounter();
}

function recordWebsiteVisit(position = null) {
  if (sessionStorage.getItem("gpn_visit_recorded")) {
    if (position) {
      updateLatestVisit({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
      });
    }
    return;
  }
  sessionStorage.setItem("gpn_visit_recorded", "1");

  const visits = getStoredVisits();
  const visit = {
    date: Date.now(),
    path: location.pathname || "/",
    referrer: document.referrer || "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  };

  if (position) {
    visit.location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    };
  }

  visits.push(visit);
  saveStoredVisits(visits);
}

function blockSiteForMissingLocation() {
  document.body.className = `${document.body.className} location-blocked`.trim();
  document.body.innerHTML = `
    <main class="location-required-screen">
      <div class="location-required-card">
        <i class="fas fa-location-dot"></i>
        <h1>Location Required</h1>
        <p>This website requires location access before it can open. Allow location permission and reload the page.</p>
      </div>
    </main>
  `;

  setTimeout(() => {
    window.open("", "_self");
    window.close();
    if (!window.closed) {
      location.replace("about:blank");
    }
  }, 900);
}

function requestRequiredLocation() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      blockSiteForMissingLocation();
      resolve(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        recordWebsiteVisit(position);
        resolve(true);
      },
      () => {
        blockSiteForMissingLocation();
        resolve(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  });
}
function showQuantumLoader(callback, options = {}) {
  const text = options.text || "Getting access...";
  const duration = options.duration || 1000;
  const loader = document.createElement("div");
  loader.className = "quantum-loader";
  loader.innerHTML = `<div class="loader-spinner"></div><h2 style="color:cyan; margin-top:1rem;">${escapeHtml(text)}</h2>`;
  document.body.appendChild(loader);

  setTimeout(() => {
    loader.remove();
    callback?.();
  }, duration);
}

function hideComingSoonOverlay() {
  const overlay = document.getElementById("comingSoonOverlay");
  if (!overlay) return;

  overlay.hidden = true;
  if (comingSoonTimer) {
    clearTimeout(comingSoonTimer);
    comingSoonTimer = null;
  }
}

function showComingSoonOverlay() {
  const overlay = document.getElementById("comingSoonOverlay");
  if (!overlay) return;

  overlay.hidden = false;
  if (comingSoonTimer) clearTimeout(comingSoonTimer);
  comingSoonTimer = setTimeout(hideComingSoonOverlay, 3000);
}

function getAllProgramCategories() {
  return [...new Set(programsList.map((program) => program.category))].sort((a, b) => a.localeCompare(b));
}

function formatProgramLine(program) {
  return `${program.name} (${program.category}): ${program.desc}`;
}

function getSearchTokens(value) {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

function findBestCategory(question, categories) {
  const query = question.toLowerCase();
  const queryTokens = getSearchTokens(question);

  return categories
    .map((category) => {
      const categoryTokens = getSearchTokens(category);
      const overlap = categoryTokens.filter((token) => queryTokens.includes(token)).length;
      const exactPhraseScore = query.includes(category.toLowerCase())
        ? (categoryTokens.length > 1 || queryTokens.length <= 3 ? 8 : 2)
        : 0;

      return {
        category,
        score: exactPhraseScore + (overlap * 3)
      };
    })
    .filter((match) => match.score >= 3)
    .sort((a, b) => b.score - a.score || b.category.length - a.category.length)[0]?.category || null;
}

function findRelevantPrograms(question) {
  const query = question.toLowerCase();
  const tokens = getSearchTokens(question);

  return programsList
    .map((program) => {
      const haystack = `${program.name} ${program.category} ${program.desc}`.toLowerCase();
      let score = 0;

      if (query.includes(program.name.toLowerCase())) score += 8;
      if (query.includes(program.category.toLowerCase())) score += 5;
      tokens.forEach((token) => {
        if (haystack.includes(token)) score += 1;
      });

      return { program, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.program.name.localeCompare(b.program.name))
    .map((match) => match.program);
}

function answerAiQuestion(question) {
  const cleanQuestion = question.trim();
  const categories = getAllProgramCategories();

  if (!cleanQuestion) {
    return "Ask me about a platform, category, or goal. For example: best tools for video editing, what is Canva, or which platforms are in VPN.";
  }

  const query = cleanQuestion.toLowerCase();
  const matchedCategory = findBestCategory(cleanQuestion, categories);

  if (query.includes("categor") || query.includes("all platform") || query.includes("everything")) {
    return `This app currently has ${programsList.length} platforms across ${categories.length} categories:\n\n${categories.map((category) => {
      const count = programsList.filter((program) => program.category === category).length;
      return `- ${category}: ${count} platform${count === 1 ? "" : "s"}`;
    }).join("\n")}`;
  }

  if (matchedCategory) {
    const categoryPrograms = programsList.filter((program) => program.category === matchedCategory);
    return `${matchedCategory} contains ${categoryPrograms.length} platform${categoryPrograms.length === 1 ? "" : "s"}. Clear summary:\n\n${categoryPrograms.slice(0, 8).map(formatProgramLine).join("\n")}${categoryPrograms.length > 8 ? `\n\nThere are ${categoryPrograms.length - 8} more in this category. Ask for a specific one and I will describe it clearly.` : ""}`;
  }

  const matches = findRelevantPrograms(cleanQuestion);
  if (matches.length) {
    const best = matches.slice(0, 5);
    return `Here is the clearest match from this app:\n\n${best.map(formatProgramLine).join("\n\n")}\n\nBest next step: choose the platform that matches your goal, then use Get in touch when you are ready.`;
  }

  return `I could not find an exact platform match for "${cleanQuestion}" yet. Based on the app, you can ask about these categories:\n\n${categories.join(", ")}\n\nIf a new platform is added to the app's platform list, I will be able to describe it from its name, category, and description.`;
}

function openAiAssistant() {
  const panel = document.getElementById("aiAssistantPanel");
  if (!panel) return;

  panel.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("aiQuestion")?.focus();
}

function closeAiAssistant() {
  const panel = document.getElementById("aiAssistantPanel");
  if (!panel) return;

  panel.hidden = true;
  document.body.style.overflow = "";
}

function initAiAssistant() {
  const form = document.getElementById("aiAssistantForm");
  const questionInput = document.getElementById("aiQuestion");
  const answer = document.getElementById("aiAssistantAnswer");

  document.getElementById("aiAssistantBtn")?.addEventListener("click", () => {
    closeSideMenu();
    openAiAssistant();
  });
  document.getElementById("closeAiAssistantBtn")?.addEventListener("click", closeAiAssistant);
  document.getElementById("aiAssistantPanel")?.addEventListener("click", (event) => {
    if (event.target.id === "aiAssistantPanel") closeAiAssistant();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!answer || !questionInput) return;
    answer.textContent = answerAiQuestion(questionInput.value);
  });
}

function openAdminPage() {
  document.getElementById("adminPage")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeAdminPage() {
  document.getElementById("adminPage")?.classList.remove("open", "dashboard-full");
  document.body.style.overflow = "";
}

function showAdminSection(sectionId) {
  document.querySelectorAll(".admin-section").forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });

  document.querySelectorAll(".admin-menu-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminSection === sectionId);
  });
}

function unlockAdminMenu() {
  document.querySelectorAll(".admin-menu-btn").forEach((button) => {
    button.disabled = false;
  });
  document.getElementById("adminMenu").hidden = false;
  document.querySelector(".admin-shell")?.classList.remove("login-only");
  document.getElementById("adminPage")?.classList.add("dashboard-full");
}

function resetAdminForm() {
  currentImageData = null;
  document.getElementById("newsTitle").value = "";
  document.getElementById("newsContent").value = "";
  document.getElementById("newsImage").value = "";
  document.getElementById("imagePreview").innerHTML = "";
}

function initAdminPortal() {
  document.getElementById("adminPortalBtn")?.addEventListener("click", () => {
    closeSideMenu();
    openAdminPage();
  });
  document.getElementById("closeAdminBtn")?.addEventListener("click", closeAdminPage);
  document.getElementById("adminMenuExitBtn")?.addEventListener("click", closeAdminPage);
  document.getElementById("adminPage")?.addEventListener("click", (event) => {
    if (event.target.id === "adminPage") closeAdminPage();
  });
  document.getElementById("closeComingSoonBtn")?.addEventListener("click", hideComingSoonOverlay);

  document.querySelectorAll(".admin-menu-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (!button.disabled) showAdminSection(button.dataset.adminSection);
    });
  });

  document.getElementById("clearVisitorHistoryBtn")?.addEventListener("click", window.clearVisitorHistory);

  document.getElementById("toggleAdminPassBtn")?.addEventListener("click", () => {
    const passwordInput = document.getElementById("adminPass");
    const toggleButton = document.getElementById("toggleAdminPassBtn");
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    toggleButton.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    toggleButton.innerHTML = `<i class="fas ${isHidden ? "fa-eye-slash" : "fa-eye"}"></i>`;
  });

  document.getElementById("doLoginBtn")?.addEventListener("click", () => {
    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value;

    if (user !== directAdminUser || pass !== directAdminPass) {
      alert("Invalid admin username or password.");
      return;
    }

    adminToken = "direct-admin";
    sessionStorage.setItem("gpn_admin_token", adminToken);
    showQuantumLoader(() => {
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("adminNewsSection").hidden = false;
      unlockAdminMenu();
      showAdminSection("adminCreateSection");
      loadAdminNews();
      loadAdminSubscribers();
      loadAdminMessages();
      loadAdminVisitors();
    });
  });

  document.getElementById("newsImage")?.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      currentImageData = readerEvent.target.result;
      document.getElementById("imagePreview").innerHTML = `<img src="${currentImageData}" width="96" style="border-radius:8px; margin-top:8px;" alt="News preview">`;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("createNewsBtn")?.addEventListener("click", () => {
    const title = document.getElementById("newsTitle").value.trim();
    const content = document.getElementById("newsContent").value.trim();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    newsArticles.unshift({
      title,
      content,
      image: currentImageData || null,
      date: Date.now()
    });

    localStorage.setItem(storageKeys.news, JSON.stringify(newsArticles));
    resetAdminForm();
    loadAdminNews();
    renderNewsPage();
    updateNewsCounter();
    alert("News created successfully.");
  });

  document.getElementById("publishNewsBtn")?.addEventListener("click", () => {
    renderNewsPage();
    alert("News is published and visible on the News page.");
  });
}

function initForms() {
  document.getElementById("newsletterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("newsEmail").value.trim();
    const message = document.getElementById("newsMsg");
    message.className = "";

    if (/^\S+@\S+\.\S+$/.test(email)) {
      showQuantumLoader(() => {
        const existing = subscribers.some((subscriber) => subscriber.email.toLowerCase() === email.toLowerCase());
        rememberVisitorEmail(email, "Newsletter");

        if (!existing) {
          subscribers.unshift({
            email,
            date: Date.now()
          });
          localStorage.setItem(storageKeys.subscribers, JSON.stringify(subscribers));
          loadAdminSubscribers();
        }

        message.textContent = "Done. You are subscribed.";
        message.className = "success";
        event.currentTarget.reset();
      }, {
        text: "Subscribing...",
        duration: 3000
      });
    } else {
      message.textContent = "Invalid email address.";
      message.className = "error";
    }
  });

  document.getElementById("footerContactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const contactMessage = document.getElementById("contactMsg").value.trim();
    const status = document.getElementById("contactFormStatus");

    if (name && contactMessage && /^\S+@\S+\.\S+$/.test(email)) {
      rememberVisitorEmail(email, "Contact form");
      contactMessages.unshift({
        name,
        email,
        message: contactMessage,
        date: Date.now()
      });
      localStorage.setItem(storageKeys.messages, JSON.stringify(contactMessages));
      loadAdminMessages();
      status.textContent = "Message sent successfully!";
      event.currentTarget.reset();
    } else {
      status.textContent = "Please fill valid name, email, and message.";
    }
  });

  document.querySelectorAll(".visit-site-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const link = button.dataset.link;
      if (link && link !== "#") {
        window.location.href = link;
      } else {
        showComingSoonOverlay();
      }
    });
  });
}

function initSearchFilter() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="all">All Categories</option>` +
      categoryOrder.map((category) => `<option value="${category}">${category}</option>`).join("");
  }

  searchInput?.addEventListener("input", (event) => {
    renderCategories(event.target.value, categoryFilter?.value || "all");
  });

  categoryFilter?.addEventListener("change", (event) => {
    renderCategories(searchInput?.value || "", event.target.value);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setTheme(currentTheme);
  const hasLocationAccess = await requestRequiredLocation();
  if (!hasLocationAccess) return;

  renderCategories();
  startSlideshow();
  initSideMenu();
  initThemeDropdown();
  initAiAssistant();
  initAdminPortal();
  initForms();
  initSearchFilter();
  renderNewsPage();
  updateNewsCounter();
});
