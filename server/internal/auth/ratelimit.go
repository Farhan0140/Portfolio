package auth

import (
	"net"
	"net/http"
	"sync"

	"golang.org/x/time/rate"
)

// IPLimiter caps repeated attempts against a sensitive endpoint (the admin
// login) per source IP, guarding the single shared ADMIN_PASSWORD against
// brute force without requiring an external store.
type IPLimiter struct {
	mu       sync.Mutex
	limiters map[string]*rate.Limiter
	r        rate.Limit
	burst    int
}

func NewIPLimiter(perMinute int, burst int) *IPLimiter {
	return &IPLimiter{
		limiters: make(map[string]*rate.Limiter),
		r:        rate.Limit(float64(perMinute) / 60.0),
		burst:    burst,
	}
}

func (l *IPLimiter) Allow(ip string) bool {
	l.mu.Lock()
	lim, ok := l.limiters[ip]
	if !ok {
		lim = rate.NewLimiter(l.r, l.burst)
		l.limiters[ip] = lim
	}
	l.mu.Unlock()
	return lim.Allow()
}

func ClientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
