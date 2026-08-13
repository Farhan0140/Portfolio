package models

type Education struct {
	Base
	Degree      string      `json:"degree" validate:"required,max=200"`
	School      string      `json:"school" validate:"required,max=200"`
	Duration    string      `json:"duration" validate:"max=120"`
	Location    string      `json:"location" validate:"max=120"`
	GPA         string      `json:"gpa" validate:"max=40"`
	StatusLabel string      `json:"statusLabel" validate:"max=80"`
	Description string      `gorm:"type:text" json:"description" validate:"max=2000"`
	Coursework  StringSlice `gorm:"type:jsonb;serializer:json" json:"coursework"`
}
