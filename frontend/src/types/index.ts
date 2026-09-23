export type IconKey = "shield" | "clock" | "monitor" | "building" | "check" | "wrench" | "video" | "chart" | "package" | "link" | "file" | "bolt" | "eye" | "headset" | "users" | "heart" | "flask" | "calendar" | "mail" | "settings" | "graduation-cap" | "";

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  product_count: number;
}

export type ProductType = "mobile" | "web" | "desktop" | "device";

export interface ProductScreenshot {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface ProductLink {
  id: number;
  label: string;
  url: string;
  order: number;
}

/** Dedicated Products page — full listing. */
export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  product_type: ProductType;
  tagline: string;
  summary: string;
  logo: string | null;
  cover_image: string | null;
  is_featured: boolean;
}

/** Minimal shape for the persistent 'Our Products' sidebar. */
export interface ProductSidebarItem {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  product_type: ProductType;
  logo: string | null;
}

export interface SpecificationRow {
  label: string;
  value: string;
}

export type ProductHeroLayout = "circular_image" | "dashboard_mockup" | "photo_card" | "badge_heavy";

export interface ProductDetail extends ProductSummary {
  description: string;
  key_feature_list: string[];
  specification_rows: SpecificationRow[];
  hero_layout: ProductHeroLayout;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badges: string[];
  hero_tagline: string;
  hero_image: string | null;
  sidebar_note_title: string;
  sidebar_note_text: string;
  sidebar_note_phone: string;
  sidebar_note_email: string;
  sidebar_note_cta_label: string;
  sidebar_note_cta_url: string;
  website_url: string;
  app_store_url: string;
  play_store_url: string;
  download_url: string;
  screenshots: ProductScreenshot[];
  extra_links: ProductLink[];
  created_at: string;
  updated_at: string;
}

/**
 * Homepage-only 'Products' highlight card — a standalone marketing
 * showcase. Deliberately has no slug/category and is never linked into the
 * dedicated Products page or product detail routes; its buttons point at
 * external website/app/download links instead.
 */
export interface ProductHighlight {
  id: number;
  name: string;
  tagline: string;
  summary: string;
  cover_image: string | null;
  logo: string | null;
  highlight_feature_list: string[];
  highlight_link_label: string;
  website_url: string;
  app_store_url: string;
  play_store_url: string;
  download_url: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  icon: IconKey;
  summary: string;
  description: string;
  image: string | null;
  is_featured: boolean;
  order: number;
}

/** Minimal shape for the Services page's persistent tab bar. */
export interface ServicePageSidebarItem {
  id: number;
  nav_label: string;
  nav_icon: IconKey;
  slug: string;
  order: number;
}

export interface ServiceHeroBadge {
  icon: IconKey;
  text: string;
}

export interface ServiceFeatureItem {
  id: number;
  icon: IconKey;
  title: string;
  image: string | null;
  tag_label: string;
  focus_text: string;
  background_text: string;
  apply_url: string;
  order: number;
}

export interface ServiceProcessStep {
  id: number;
  title: string;
  description: string;
  order: number;
}

export interface ServiceEquipmentItem {
  id: number;
  icon: IconKey;
  title: string;
  order: number;
}

export interface ServiceValueItem {
  id: number;
  icon: IconKey;
  title: string;
  description: string;
  order: number;
}

export interface ServiceGalleryImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export type ServiceFormType = "support_demo" | "training_enquiry" | "career_application" | "general";

/** Full content for one Services page tab (e.g. 'AMC & Maintenance'). */
export interface ServicePageDetail {
  id: number;
  nav_label: string;
  nav_icon: IconKey;
  slug: string;
  order: number;
  hero_eyebrow: string;
  hero_title_main: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_badges: ServiceHeroBadge[];
  hero_cta_label: string;
  hero_tagline_lines: string[];
  hero_image: string | null;
  overview_eyebrow: string;
  overview_title: string;
  overview_subtitle: string;
  overview_description: string;
  process_title: string;
  process_subtitle: string;
  equipment_title: string;
  equipment_subtitle: string;
  secondary_eyebrow: string;
  secondary_title: string;
  secondary_subtitle: string;
  gallery_title: string;
  gallery_subtitle: string;
  cta_icon: IconKey;
  cta_title: string;
  cta_subtitle: string;
  cta_image: string | null;
  cta_button_label: string;
  cta_button_url: string;
  form_title: string;
  form_description: string;
  form_type: ServiceFormType;
  feature_items: ServiceFeatureItem[];
  process_steps: ServiceProcessStep[];
  equipment_items: ServiceEquipmentItem[];
  value_items: ServiceValueItem[];
  gallery_images: ServiceGalleryImage[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  title: string;
  photo: string | null;
  bio: string;
  bio_paragraphs: string[];
  quote: string;
  quote_label: string;
  badge_text: string;
  years_text: string;
  prior_leadership: string;
  domain_expertise: string;
  operational_base: string;
  is_leadership: boolean;
  order: number;
}

export interface CompanyStat {
  id: number;
  label: string;
  value: string;
  icon: IconKey;
  order: number;
}

/** Homepage 'Who We Are' preview — singleton. */
export interface HomeTrustPoint {
  id: number;
  icon: IconKey;
  label: string;
  order: number;
}

/** Homepage hero banner — singleton. */
export interface HomeHero {
  eyebrow: string;
  title_main: string;
  title_highlight: string;
  subtitle: string;
  background_image: string | null;
  primary_button_label: string;
  primary_button_url: string;
  secondary_button_label: string;
  secondary_button_url: string;
  trust_points: HomeTrustPoint[];
}

export interface AboutSection {
  eyebrow: string;
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  image: string | null;
  badge_icon: IconKey;
  badge_title: string;
  badge_subtitle: string;
}

/** Homepage-only 'The MedEx Biomed Ecosystem' card. */
export interface EcosystemPillar {
  id: number;
  icon: IconKey;
  title: string;
  bullet_list: string[];
  link_label: string;
  link_url: string;
  order: number;
}

/** Homepage-only 'Our Operating Pillars' card. */
export interface OperatingPillar {
  id: number;
  icon: IconKey;
  title: string;
  description: string;
  order: number;
}

export interface VisionHighlight {
  id: number;
  title: string;
  description: string;
  order: number;
}

export interface VisionStatusRow {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface MissionPillar {
  id: number;
  title: string;
  description: string;
  order: number;
}

/** Vision & Mission — singleton. */
export interface VisionMission {
  vision_title: string;
  vision_text: string;
  mission_title: string;
  mission_text: string;
  network_panel_title: string;
  network_panel_status_label: string;
  network_panel_quote: string;
  network_benchmark_title: string;
  network_benchmark_subtitle: string;
  network_benchmark_tag: string;
  ecosystem_eyebrow: string;
  ecosystem_title: string;
  ecosystem_subtitle: string;
  ecosystem_core_label: string;
  ecosystem_core_title: string;
  ecosystem_core_subtitle: string;
  ecosystem_footer_badge_1: string;
  ecosystem_footer_badge_2: string;
  highlights: VisionHighlight[];
  status_rows: VisionStatusRow[];
  mission_pillars: MissionPillar[];
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject?: string;
  interested_in?: string;
  additional_info?: string;
  message: string;
}

/** Site-wide identity & contact info — singleton, editable in Django Admin. */
export interface SiteSettings {
  site_name: string;
  logo: string | null;
  footer_tagline: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_link: string;
  email: string;
  business_hours: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
}

export type PageKey = "about" | "services" | "contact";

/** Per-page hero/CTA copy for the static pages. */
export interface PageIntro {
  page: PageKey;
  eyebrow: string;
  title: string;
  title_highlight: string;
  description: string;
  image: string | null;
  cta_title: string;
  cta_text: string;
}

export interface OfficeLocation {
  id: number;
  name: string;
  address: string;
  phone: string;
  map_embed_url: string;
  order: number;
}

export interface ContactHighlight {
  id: number;
  text: string;
  order: number;
}

export interface ContactPageContent {
  form_title: string;
  form_description: string;
  details_eyebrow: string;
  details_title: string;
  details_subtitle: string;
  highlights_intro: string;
  map_eyebrow: string;
  map_title: string;
  map_description: string;
  highlights: ContactHighlight[];
}

/** About Us page's Mission/Approach text — singleton. */
export interface WhyChooseUsItem {
  id: number;
  icon: IconKey;
  title: string;
  description: string;
  order: number;
}

export interface AboutPageContent {
  hero_badge_title: string;
  hero_highlight_value: string;
  hero_highlight_label: string;
  hero_status_text: string;
  story_eyebrow: string;
  story_title: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  story_quote: string;
  story_image: string | null;
  story_image_badge: string;
  story_caption_eyebrow: string;
  story_caption_text: string;
  leadership_eyebrow: string;
  leadership_title: string;
  why_choose_eyebrow: string;
  why_choose_title_main: string;
  why_choose_title_highlight: string;
  why_choose_description: string;
  why_choose_items: WhyChooseUsItem[];
}