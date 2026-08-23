package main

import (
	"log"
	"net/http"

	"portfolio/server/internal/config"
	"portfolio/server/internal/database"
	"portfolio/server/internal/httpapi"
)

func main() {
	cfg := config.Load()

	conn, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}
	if err := database.AutoMigrate(conn); err != nil {
		log.Fatalf("automigrate: %v", err)
	}

	router := httpapi.NewRouter(cfg, conn)

	log.Printf("portfolio API listening on :%s (env=%s, static=%s)", cfg.Port, cfg.Env, cfg.StaticDir)
	if err := http.ListenAndServe(":"+cfg.Port, router); err != nil {
		log.Fatal(err)
	}
}
