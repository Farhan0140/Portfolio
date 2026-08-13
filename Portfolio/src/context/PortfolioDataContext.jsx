import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const PortfolioDataContext = createContext(null);

const EMPTY_DATA = {
  profile: {},
  siteContent: {},
  education: [],
  skillCategories: [],
  projects: [],
  certifications: [],
  socialLinks: [],
  codingProfiles: [],
};

/**
 * Fetches the public portfolio payload once and exposes it (plus a couple of
 * derived shapes the existing section components expect) to the whole tree.
 *
 * Pass `overrideData` (a full payload shape, same as the API response) to
 * render the public section components against unsaved draft data instead —
 * this is how the admin's live preview reuses the real components without a
 * second rendering pipeline.
 */
export function PortfolioDataProvider({ children, overrideData }) {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(!overrideData);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetch('/api/public/portfolio')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load portfolio data (${res.status})`);
        return res.json();
      })
      .then((json) => {
        setData({ ...EMPTY_DATA, ...json });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load portfolio data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (overrideData) return undefined;
    fetchData();
    return undefined;
  }, [fetchData, overrideData]);

  const value = useMemo(() => {
    const effective = overrideData ? { ...EMPTY_DATA, ...overrideData } : data;
    const projects = effective.projects || [];

    // Shape adapters below translate the flat DB rows into the exact prop
    // shapes the (unchanged) section/modal components were built around, so
    // no JSX/markup has to change just because the data source did.
    const toProjectCard = (p) => ({
      id: p.id,
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
      id: p.id,
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

    const softwareProjects = projects.filter((p) => p.type === 'software').map(toProjectCard);
    const iotCards = projects.filter((p) => p.type === 'iot').map(toIotCard);

    const projectModalData = {};
    projects.forEach((p) => {
      projectModalData[p.id] = toProjectModal(p);
    });

    const certModalData = {};
    (effective.certifications || []).forEach((c) => {
      certModalData[c.id] = { title: c.title, issuer: c.issuer, image: c.image, desc: c.description };
    });

    return {
      ...effective,
      softwareProjects,
      iotCards,
      projectModalData,
      certModalData,
      loading: overrideData ? false : loading,
      error: overrideData ? null : error,
      refetch: fetchData,
    };
  }, [data, overrideData, loading, error, fetchData]);

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  return ctx;
}
