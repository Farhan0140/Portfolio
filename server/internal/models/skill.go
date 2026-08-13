package models

type SkillCategory struct {
	Base
	Title string      `json:"title" validate:"required,max=100"`
	Icon  string       `json:"icon" validate:"required,max=60"`
	Items []SkillItem `gorm:"foreignKey:CategoryID;constraint:OnDelete:CASCADE" json:"items"`
}

type SkillItem struct {
	Base
	CategoryID uint   `gorm:"column:category_id;not null" json:"categoryId" validate:"required"`
	Icon       string `json:"icon" validate:"required,max=60"`
	Label      string `json:"label" validate:"required,max=100"`
}
