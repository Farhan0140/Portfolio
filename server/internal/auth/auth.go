package auth

import (
	"crypto/subtle"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"portfolio/server/internal/config"
)

const CookieName = "admin_session"

type claims struct {
	jwt.RegisteredClaims
}

func issueToken(secret string) (string, error) {
	now := time.Now()
	c := claims{jwt.RegisteredClaims{
		Subject:   "admin",
		IssuedAt:  jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
	}}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return tok.SignedString([]byte(secret))
}

func verifyToken(tokenStr, secret string) error {
	tok, err := jwt.ParseWithClaims(tokenStr, &claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return err
	}
	if !tok.Valid {
		return errors.New("invalid token")
	}
	return nil
}

func setSessionCookie(w http.ResponseWriter, cfg *config.Config, value string, maxAge int) {
	http.SetCookie(w, &http.Cookie{
		Name:     CookieName,
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.IsProduction(),
		SameSite: http.SameSiteStrictMode,
		MaxAge:   maxAge,
	})
}

// LoginHandler compares the submitted password against ADMIN_PASSWORD
// (constant-time, never logged, never echoed back) and, on success, issues a
// signed JWT in an httpOnly cookie. The password itself never reaches
// client-side JS beyond the one submitted keystroke-driven request.
func LoginHandler(cfg *config.Config, limiter *IPLimiter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !limiter.Allow(ClientIP(r)) {
			http.Error(w, `{"error":"too many attempts, try again shortly"}`, http.StatusTooManyRequests)
			return
		}
		var body struct {
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
			return
		}
		if subtle.ConstantTimeCompare([]byte(body.Password), []byte(cfg.AdminPassword)) != 1 {
			http.Error(w, `{"error":"incorrect password"}`, http.StatusUnauthorized)
			return
		}
		token, err := issueToken(cfg.SessionSecret)
		if err != nil {
			http.Error(w, `{"error":"could not start session"}`, http.StatusInternalServerError)
			return
		}
		setSessionCookie(w, cfg, token, 86400)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"ok":true}`))
	}
}

func LogoutHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		setSessionCookie(w, cfg, "", -1)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"ok":true}`))
	}
}

func MeHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"ok":true}`))
	}
}

// RequireAdmin protects every /api/admin/* mutation route; it never accepts
// credentials from anywhere but the signed session cookie.
func RequireAdmin(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			c, err := r.Cookie(CookieName)
			if err != nil || verifyToken(c.Value, cfg.SessionSecret) != nil {
				http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
