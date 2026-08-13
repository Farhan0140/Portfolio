package httpapi

import (
	"errors"
	"net/http"

	"gorm.io/gorm"

	"portfolio/server/internal/models"
)

// PublicPortfolioHandler returns everything the public site needs in one
// payload, each list published-only and ordered — the single source of
// truth the frontend's PortfolioDataContext fetches on load.
func PublicPortfolioHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var profile models.Profile
		if err := db.First(&profile, 1).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}

		var siteContent models.SiteContent
		if err := db.First(&siteContent, 1).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}

		var education []models.Education
		var categories []models.SkillCategory
		var projects []models.Project
		var certifications []models.Certification
		var socialLinks []models.SocialLink
		var codingProfiles []models.CodingProfile

		published := db.Where("is_published = ?", true).Order("sort_order asc")

		if err := published.Find(&education).Error; err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if err := db.Where("is_published = ?", true).Order("sort_order asc").
			Preload("Items", func(d *gorm.DB) *gorm.DB {
				return d.Where("is_published = ?", true).Order("sort_order asc")
			}).Find(&categories).Error; err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if err := db.Where("is_published = ?", true).Order("sort_order asc").Find(&projects).Error; err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if err := db.Where("is_published = ?", true).Order("sort_order asc").Find(&certifications).Error; err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if err := db.Where("is_published = ?", true).Order("sort_order asc").Find(&socialLinks).Error; err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if err := db.Where("is_published = ?", true).Order("sort_order asc").Find(&codingProfiles).Error; err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"profile":        profile,
			"siteContent":    siteContent,
			"education":      education,
			"skillCategories": categories,
			"projects":       projects,
			"certifications": certifications,
			"socialLinks":    socialLinks,
			"codingProfiles": codingProfiles,
		})
	}
}
