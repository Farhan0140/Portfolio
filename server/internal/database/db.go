package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"portfolio/server/internal/models"
)

func Connect(dsn string) (*gorm.DB, error) {
	return gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
}

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Profile{},
		&models.SiteContent{},
		&models.Education{},
		&models.SkillCategory{},
		&models.SkillItem{},
		&models.Project{},
		&models.Certification{},
		&models.SocialLink{},
		&models.CodingProfile{},
	)
}
