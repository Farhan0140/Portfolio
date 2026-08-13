package models

import "time"

// IDBase is embedded by singleton tables (Profile, SiteContent) that only
// ever have one row.
type IDBase struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (b *IDBase) GetID() uint   { return b.ID }
func (b *IDBase) SetID(id uint) { b.ID = id }

// Base is embedded by every repeatable/orderable entity (education, skills,
// projects, certifications, social links, coding profiles).
type Base struct {
	IDBase
	// SortOrder backs the "order" JSON field; the Go/JSON name avoids the
	// SQL keyword collision that "order" would cause as a bare column name.
	SortOrder   int  `gorm:"column:sort_order;default:0" json:"order"`
	IsPublished bool `gorm:"column:is_published;default:true" json:"isPublished"`
}

func (b *Base) GetOrder() int  { return b.SortOrder }
func (b *Base) SetOrder(o int) { b.SortOrder = o }

// StringSlice is stored as a jsonb column via GORM's json serializer,
// sidestepping Postgres native array driver plumbing for simple string lists
// (typed roles, coursework, tags).
type StringSlice []string
