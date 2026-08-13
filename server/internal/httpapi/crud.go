package httpapi

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

// Entity is satisfied (via method promotion) by every model embedding
// models.Base, letting Resource operate generically on id/order without
// per-entity boilerplate.
type Entity interface {
	GetID() uint
	SetID(uint)
	GetOrder() int
	SetOrder(int)
}

// Resource is a generic CRUD+reorder handler set reused by every repeatable
// portfolio entity (education, skills, projects, certifications, social
// links, coding profiles) — adding a new dynamic section means adding a
// model + one short mount file, not a new handler implementation.
type Resource[T any, PT interface {
	*T
	Entity
}] struct {
	DB *gorm.DB
	// ApplyList customizes the list query (e.g. preloading SkillCategory.Items).
	ApplyList func(*gorm.DB) *gorm.DB
}

func NewResource[T any, PT interface {
	*T
	Entity
}](db *gorm.DB) *Resource[T, PT] {
	return &Resource[T, PT]{DB: db}
}

func (res *Resource[T, PT]) List(w http.ResponseWriter, r *http.Request) {
	var items []T
	q := res.DB.Order("sort_order asc")
	if res.ApplyList != nil {
		q = res.ApplyList(q)
	}
	if err := q.Find(&items).Error; err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (res *Resource[T, PT]) Create(w http.ResponseWriter, r *http.Request) {
	var item T
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	pt := PT(&item)
	pt.SetID(0)
	if err := validate.Struct(&item); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if pt.GetOrder() == 0 {
		var count int64
		res.DB.Model(new(T)).Count(&count)
		pt.SetOrder(int(count))
	}
	if err := res.DB.Create(&item).Error; err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, item)
}

func (res *Resource[T, PT]) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseUint(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	var existing T
	if err := res.DB.First(&existing, uint(id)).Error; err != nil {
		writeError(w, http.StatusNotFound, "not found")
		return
	}
	// Decoding onto the already-loaded row preserves fields the request body
	// omits (CreatedAt, etc.) and supports partial updates naturally.
	if err := json.NewDecoder(r.Body).Decode(&existing); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	pt := PT(&existing)
	pt.SetID(uint(id))
	if err := validate.Struct(&existing); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := res.DB.Save(&existing).Error; err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, existing)
}

func (res *Resource[T, PT]) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseUint(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := res.DB.Delete(new(T), uint(id)).Error; err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (res *Resource[T, PT]) Reorder(w http.ResponseWriter, r *http.Request) {
	var body struct {
		IDs []uint `json:"ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	err := res.DB.Transaction(func(tx *gorm.DB) error {
		for idx, id := range body.IDs {
			if err := tx.Model(new(T)).Where("id = ?", id).Update("sort_order", idx).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (res *Resource[T, PT]) Mount(r chi.Router, path string) {
	r.Route(path, func(r chi.Router) {
		r.Get("/", res.List)
		r.Post("/", res.Create)
		r.Put("/{id}", res.Update)
		r.Delete("/{id}", res.Delete)
		r.Patch("/reorder", res.Reorder)
	})
}
