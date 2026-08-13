package models

type Certification struct {
	Base
	Title       string      `json:"title" validate:"required,max=200"`
	Issuer      string      `json:"issuer" validate:"max=120"`
	BadgeDate   string      `json:"badgeDate" validate:"max=60"`
	Tags        StringSlice `gorm:"type:jsonb;serializer:json" json:"tags"`
	Image       string      `json:"image" validate:"omitempty,max=500"`
	Description string      `gorm:"type:text" json:"description" validate:"max=2000"`
}
