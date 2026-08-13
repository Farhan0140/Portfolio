package models

// SiteContent is the singleton record for small standalone copy blocks that
// aren't repeatable — the Career section and the Hobbies section intro.
type SiteContent struct {
	IDBase
	CareerBadgeLabel string `json:"careerBadgeLabel" validate:"max=120"`
	CareerText       string `gorm:"type:text" json:"careerText" validate:"max=2000"`
	HobbiesTitle     string `json:"hobbiesTitle" validate:"max=200"`
	HobbiesText      string `gorm:"type:text" json:"hobbiesText" validate:"max=2000"`
}

func (SiteContent) TableName() string { return "site_content" }
