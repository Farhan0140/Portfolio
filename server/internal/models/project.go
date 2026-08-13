package models

// Project backs both the "Projects" grid (Type=software) and the
// "Hobbies & projects" IoT grid (Type=iot), plus the shared detail modal —
// unifying what used to be projectCards/iotCards + projectModalData/
// certModalData style duplicate maps in the static frontend data.
type Project struct {
	Base
	Slug        string      `gorm:"uniqueIndex" json:"slug" validate:"required,max=80"`
	Title       string      `json:"title" validate:"required,max=200"`
	ShortDesc   string      `gorm:"type:text" json:"shortDesc" validate:"max=600"`
	FullDesc    string      `gorm:"type:text" json:"fullDesc" validate:"max=4000"`
	Image       string      `json:"image" validate:"omitempty,max=500"`
	ImageAlt    string      `json:"imageAlt" validate:"max=200"`
	Emoji       string      `json:"emoji" validate:"max=16"`
	Status      string      `json:"status" validate:"omitempty,oneof=live progress none"`
	Type        string      `json:"type" validate:"required,oneof=software iot"`
	TagsLabel   string      `json:"tagsLabel" validate:"max=80"`
	Tags        StringSlice `gorm:"type:jsonb;serializer:json" json:"tags"`
	GithubURL   string      `json:"githubUrl" validate:"omitempty,url"`
	LiveURL     string      `json:"liveUrl" validate:"omitempty,url"`
	Featured    bool        `json:"featured"`
}
