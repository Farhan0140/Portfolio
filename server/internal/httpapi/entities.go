package httpapi

import (
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"

	"portfolio/server/internal/models"
)

// MountEntities wires every admin CRUD resource onto r. Each line is the
// entirety of what's needed to add a new dynamic section's admin API.
func MountEntities(r chi.Router, db *gorm.DB) {
	NewSingletonResource[models.Profile](db).Mount(r, "/profile")
	NewSingletonResource[models.SiteContent](db).Mount(r, "/site-content")

	NewResource[models.Education](db).Mount(r, "/education")
	NewResource[models.Project](db).Mount(r, "/projects")
	NewResource[models.Certification](db).Mount(r, "/certifications")
	NewResource[models.SocialLink](db).Mount(r, "/social-links")
	NewResource[models.CodingProfile](db).Mount(r, "/coding-profiles")

	categories := NewResource[models.SkillCategory](db)
	categories.ApplyList = func(q *gorm.DB) *gorm.DB {
		return q.Preload("Items", func(d *gorm.DB) *gorm.DB { return d.Order("sort_order asc") })
	}
	categories.Mount(r, "/skill-categories")
	NewResource[models.SkillItem](db).Mount(r, "/skill-items")
}
