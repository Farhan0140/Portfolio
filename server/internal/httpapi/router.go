package httpapi

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"gorm.io/gorm"

	"portfolio/server/internal/auth"
	"portfolio/server/internal/config"
)

func NewRouter(cfg *config.Config, db *gorm.DB) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.AllowedOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	loginLimiter := auth.NewIPLimiter(10, 5) // 10/min, burst 5 — brute-force guard on the single shared password

	r.Route("/api", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, http.StatusOK, map[string]string{"status": "ok", "time": time.Now().Format(time.RFC3339)})
		})

		r.Get("/public/portfolio", PublicPortfolioHandler(db))

		r.Route("/admin", func(r chi.Router) {
			r.Post("/login", auth.LoginHandler(cfg, loginLimiter))
			r.Post("/logout", auth.LogoutHandler(cfg))

			r.Group(func(r chi.Router) {
				r.Use(auth.RequireAdmin(cfg))
				r.Get("/me", auth.MeHandler())
				MountEntities(r, db)
			})
		})
	})

	ServeStatic(r, cfg.StaticDir)

	return r
}
