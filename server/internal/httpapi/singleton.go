package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type Singleton interface {
	GetID() uint
	SetID(uint)
}

// SingletonResource is the Get/Update-only counterpart to Resource, used by
// the one-row Profile and SiteContent tables (id is always 1).
type SingletonResource[T any, PT interface {
	*T
	Singleton
}] struct {
	DB *gorm.DB
}

func NewSingletonResource[T any, PT interface {
	*T
	Singleton
}](db *gorm.DB) *SingletonResource[T, PT] {
	return &SingletonResource[T, PT]{DB: db}
}

func (res *SingletonResource[T, PT]) Get(w http.ResponseWriter, r *http.Request) {
	var item T
	err := res.DB.First(&item, 1).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		pt := PT(&item)
		pt.SetID(1)
		if err := res.DB.Create(&item).Error; err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
	} else if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, item)
}

func (res *SingletonResource[T, PT]) Update(w http.ResponseWriter, r *http.Request) {
	var item T
	err := res.DB.First(&item, 1).Error
	notFound := errors.Is(err, gorm.ErrRecordNotFound)
	if err != nil && !notFound {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	pt := PT(&item)
	pt.SetID(1)
	if err := validate.Struct(&item); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if notFound {
		err = res.DB.Create(&item).Error
	} else {
		err = res.DB.Save(&item).Error
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, item)
}

func (res *SingletonResource[T, PT]) Mount(r chi.Router, path string) {
	r.Route(path, func(r chi.Router) {
		r.Get("/", res.Get)
		r.Put("/", res.Update)
	})
}
