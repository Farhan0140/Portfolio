package models

// SocialLink feeds both the Hero dev-card icon row and the Contact footer's
// social pills (github/linkedin/CV/email today).
type SocialLink struct {
	Base
	Platform     string `json:"platform" validate:"required,max=60"`
	Label        string `json:"label" validate:"required,max=60"`
	Icon         string `json:"icon" validate:"required,max=60"`
	URL          string `json:"url" validate:"required,max=500"`
	ShowInHero   bool   `gorm:"default:true" json:"showInHero"`
	ShowInFooter bool   `gorm:"default:true" json:"showInFooter"`
}
