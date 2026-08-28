import { createContext, useContext, useMemo } from 'react';
import portfolioData from '../data/profile-information.json';

const PortfolioDataContext = createContext(null);

const EMPTY_DATA = {
  profile: {},
  siteContent: {},
  education: [],
  skillCategories: [],
  projects: { software: [], iot: [] },
  certifications: [],
  socialLinks: [],
  codingProfiles: [],
};

/**
 * Exposes the static portfolio data (bundled from data/profile-information.json)
 * plus a couple of derived shapes the existing section components expect.
 *
 * Pass `overrideData` (a full payload shape, same as profile-information.json)
 * to render the public section components against unsaved draft data instead.
 */
export function PortfolioDataProvider({ children, overrideData }) {
  const value = useMemo(() => {
    const effective = overrideData ? { ...EMPTY_DATA, ...overrideData } : { ...EMPTY_DATA, ...portfolioData };
    // `projects` is split into `software`/`iot` in the JSON so adding a new
    // project to one list never requires renumbering ids/order in the other —
    // each project's `slug` (already unique) is its identifier, and its
    // position in the array is its display order.
    const softwareRows = effective.projects?.software || [];
    const iotRows = effective.projects?.iot || [];
    const allProjects = [...softwareRows, ...iotRows];

    // Shape adapters below translate the flat JSON rows into the exact prop
    // shapes the (unchanged) section/modal components were built around, so
    // no JSX/markup has to change just because the data source did.
    const toProjectCard = (p) => ({
      id: p.slug,
      title: p.title,
      desc: p.shortDesc,
      image: p.image,
      imageAlt: p.imageAlt,
      status: p.status,
      emoji: p.emoji,
      langTags: p.tags || [],
      links: { code: p.githubUrl, live: p.liveUrl },
    });
    const toIotCard = (p) => ({
      id: p.slug,
      title: p.title,
      desc: p.shortDesc,
      image: p.image,
      imageAlt: p.imageAlt,
      emoji: p.emoji,
      componentTags: p.tags || [],
    });
    const toProjectModal = (p) => ({
      title: p.title,
      emoji: p.emoji,
      image: p.image,
      status: p.status,
      desc: p.fullDesc || p.shortDesc,
      tagsLabel: p.tagsLabel,
      tags: p.tags || [],
      links: { code: p.githubUrl, live: p.liveUrl },
    });

    const softwareProjects = softwareRows.map(toProjectCard);
    const iotCards = iotRows.map(toIotCard);

    const projectModalData = {};
    allProjects.forEach((p) => {
      projectModalData[p.slug] = toProjectModal(p);
    });

    const certModalData = {};
    (effective.certifications || []).forEach((c) => {
      certModalData[c.id] = { title: c.title, issuer: c.issuer, image: c.image, desc: c.description };
    });

    return {
      ...effective,
      projects: allProjects,
      softwareProjects,
      iotCards,
      projectModalData,
      certModalData,
      loading: false,
      error: null,
    };
  }, [overrideData]);

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  return ctx;
}
