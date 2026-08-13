package httpapi

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
)

// ServeStatic serves the built Vite frontend from dir and falls back to
// index.html for any path that isn't a real file — the SPA-fallback that
// lets React Router own client-side routes like /admin/projects on a hard
// refresh or direct link.
func ServeStatic(r chi.Router, dir string) {
	fileServer := http.FileServer(http.Dir(dir))
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			writeError(w, http.StatusNotFound, "not found")
			return
		}
		cleanPath := filepath.Clean(r.URL.Path)
		fsPath := filepath.Join(dir, cleanPath)
		if info, err := os.Stat(fsPath); err == nil && !info.IsDir() {
			fileServer.ServeHTTP(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join(dir, "index.html"))
	})
}
