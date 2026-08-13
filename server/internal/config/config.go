package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL   string
	AdminPassword string
	SessionSecret string
	Port          string
	AllowedOrigin string
	Env           string
	StaticDir     string
}

func Load() *Config {
	// Best effort — in production the platform sets real env vars and there
	// is no .env file to load. Try every location .env could sit at
	// depending on where `go run`/the binary was invoked from (repo root,
	// server/, or server/cmd/api), so this doesn't depend on cwd.
	_ = godotenv.Load()
	_ = godotenv.Load("../.env")
	_ = godotenv.Load("../../.env")
	_ = godotenv.Load("server/.env")

	cfg := &Config{
		DatabaseURL:   mustGetEnv("DATABASE_URL"),
		AdminPassword: mustGetEnv("ADMIN_PASSWORD"),
		SessionSecret: mustGetEnv("SESSION_SECRET"),
		Port:          getEnvDefault("PORT", "8080"),
		AllowedOrigin: getEnvDefault("ALLOWED_ORIGIN", "http://localhost:5173"),
		Env:           getEnvDefault("APP_ENV", "development"),
		StaticDir:     getEnvDefault("STATIC_DIR", "../dist"),
	}
	return cfg
}

func (c *Config) IsProduction() bool { return c.Env == "production" }

func mustGetEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("missing required environment variable %s", key)
	}
	return v
}

func getEnvDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
