package models

// CodingProfile supplies the handles ProblemSolving.jsx's useLiveStats hook
// fetches live stats for (Codeforces/CodeChef/LeetCode) plus the Codolio
// aggregate link. The live-fetch logic itself stays client-side and unchanged.
type CodingProfile struct {
	Base
	Platform   string `json:"platform" validate:"required,max=60"`
	Handle     string `json:"handle" validate:"required,max=120"`
	ProfileURL string `json:"profileUrl" validate:"omitempty,url"`
}
