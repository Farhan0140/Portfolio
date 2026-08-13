package models

// Profile is the singleton hero/identity/contact record (single row, id=1).
type Profile struct {
	IDBase
	FirstName       string      `json:"firstName" validate:"required,max=80"`
	LastName        string      `json:"lastName" validate:"max=80"`
	Kicker          string      `json:"kicker" validate:"max=200"`
	Description     string      `gorm:"type:text" json:"description" validate:"max=2000"`
	TypedRoles      StringSlice `gorm:"type:jsonb;serializer:json" json:"typedRoles"`
	PhotoURL        string      `json:"photoUrl" validate:"omitempty,url"`
	Handle          string      `json:"handle" validate:"max=80"`
	Location        string      `json:"location" validate:"max=120"`
	CvURL           string      `json:"cvUrl" validate:"omitempty,url"`
	Email           string      `json:"email" validate:"omitempty,email"`
	Phone           string      `json:"phone" validate:"max=40"`
	ContactLocation string      `json:"contactLocation" validate:"max=120"`
}

func (Profile) TableName() string { return "profile" }
