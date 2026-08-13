// Command seed populates the database with the content that used to be
// hardcoded in src/data/*.js (plus the copy embedded directly in the Hero/
// About/Career/Contact/Hobbies components), so that after running it the
// live site reproduces today's portfolio exactly. Safe to re-run — it wipes
// and re-inserts every table.
package main

import (
	"log"

	"gorm.io/gorm"

	"portfolio/server/internal/config"
	"portfolio/server/internal/database"
	"portfolio/server/internal/models"
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

	if err := seed(conn); err != nil {
		log.Fatalf("seed: %v", err)
	}
	log.Println("seed complete")
}

func seed(db *gorm.DB) error {
	return db.Transaction(func(tx *gorm.DB) error {
		if err := seedProfile(tx); err != nil {
			return err
		}
		if err := seedSiteContent(tx); err != nil {
			return err
		}
		if err := seedEducation(tx); err != nil {
			return err
		}
		if err := seedSkills(tx); err != nil {
			return err
		}
		if err := seedProjects(tx); err != nil {
			return err
		}
		if err := seedCertifications(tx); err != nil {
			return err
		}
		if err := seedSocialLinks(tx); err != nil {
			return err
		}
		if err := seedCodingProfiles(tx); err != nil {
			return err
		}
		return nil
	})
}

func seedProfile(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM profile").Error; err != nil {
		return err
	}
	p := models.Profile{
		IDBase:      models.IDBase{ID: 1},
		FirstName:   "Farhan",
		LastName:    "Nadim",
		Kicker:      "Designing, building, and bringing ideas to life.",
		Description: "I’m a Computer Science & Engineering student who enjoys building things and figuring out how they work. Most of my free time goes into IoT projects, where I get to play with sensors, boards, and code to bring ideas to life.",
		TypedRoles:  models.StringSlice{"Software Developer", "IoT tinkerer", "Go & React builder", "Problem solver"},
		PhotoURL:    "https://i.ibb.co.com/PGYMFqnH/Nadim.jpg",
		Handle:      "@Farhan0140",
		Location:    "Narayanganj",
		CvURL:       "/Farhan_Nadim_CV.pdf",
		Email:       "farhannadim2023@gmail.com",
		Phone:       "+880 1403 527730",
		ContactLocation: "Narayanganj, Bangladesh",
	}
	return tx.Create(&p).Error
}

func seedSiteContent(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM site_content").Error; err != nil {
		return err
	}
	sc := models.SiteContent{
		IDBase:           models.IDBase{ID: 1},
		CareerBadgeLabel: "Software Engineer",
		CareerText:       "I’m working toward becoming a Software Engineer, focused on building reliable, thoughtful, and useful software. With every project and every line of code, I’m learning, improving, and getting closer to the kind of engineer I want to become.",
		HobbiesTitle:     "Building IoT projects",
		HobbiesText:      "Outside of coursework, I like getting hands-on — connecting microcontrollers, sensors, and code to build small systems that sense, react, and talk to each other. It's where my software knowledge meets the physical world.",
	}
	return tx.Create(&sc).Error
}

func seedEducation(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM educations").Error; err != nil {
		return err
	}
	rows := []models.Education{
		{
			Degree:      "B.Sc. in Computer Science & Engineering",
			School:      "University of Information Technology and Sciences (UITS)",
			Duration:    "2023 — Present (4th year)",
			Location:    "Dhaka, Bangladesh",
			GPA:         "3.70 / 4.00",
			StatusLabel: "Currently enrolled",
			Description: "I'm working through an undergraduate degree with a strong focus on software engineering principles — pairing the academic theory with practical work through competitive programming, data structure analysis, and full-stack development projects.",
			Coursework: models.StringSlice{
				"Data Structures & Algorithms",
				"Object Oriented Programming",
				"Database Management Systems",
				"Operating Systems",
				"Computer Networks",
				"Software Engineering",
			},
		},
	}
	return createOrdered(tx, rows)
}

func seedSkills(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM skill_items").Error; err != nil {
		return err
	}
	if err := tx.Exec("DELETE FROM skill_categories").Error; err != nil {
		return err
	}

	type cat struct {
		title string
		icon  string
		items []models.SkillItem
	}
	cats := []cat{
		{"Frontend", "i-monitor", []models.SkillItem{
			{Icon: "b-react", Label: "React"},
			{Icon: "b-js", Label: "JavaScript"},
			{Icon: "b-html5", Label: "HTML5"},
			{Icon: "b-css3", Label: "CSS3"},
		}},
		{"Backend & Database", "i-layers", []models.SkillItem{
			{Icon: "b-django", Label: "Django"},
			{Icon: "b-drf", Label: "Django REST Framework"},
			{Icon: "b-rest", Label: "REST API"},
			{Icon: "b-postgres", Label: "PostgreSQL"},
			{Icon: "b-neon", Label: "Neon"},
			{Icon: "b-supabase", Label: "Supabase"},
		}},
		{"Languages", "i-brackets", []models.SkillItem{
			{Icon: "b-python", Label: "Python"},
			{Icon: "b-go", Label: "Go"},
			{Icon: "b-c", Label: "C"},
			{Icon: "b-cpp", Label: "C++"},
			{Icon: "b-sql", Label: "SQL"},
		}},
		{"Tools & Platforms", "i-toolbox", []models.SkillItem{
			{Icon: "b-git", Label: "Git"},
			{Icon: "b-github", Label: "GitHub"},
			{Icon: "b-vscode", Label: "VS Code"},
			{Icon: "b-vercel", Label: "Vercel"},
			{Icon: "b-netlify", Label: "Netlify"},
			{Icon: "b-render", Label: "Render"},
			{Icon: "b-arduino", Label: "Arduino"},
			{Icon: "b-platformio", Label: "PlatformIO"},
		}},
	}

	for ci, c := range cats {
		category := models.SkillCategory{Title: c.title, Icon: c.icon}
		category.SortOrder = ci
		if err := tx.Create(&category).Error; err != nil {
			return err
		}
		for ii := range c.items {
			c.items[ii].CategoryID = category.ID
			c.items[ii].SortOrder = ii
		}
		if err := tx.Create(&c.items).Error; err != nil {
			return err
		}
	}
	return nil
}

func seedProjects(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM projects").Error; err != nil {
		return err
	}
	rows := []models.Project{
		{
			Slug: "propnest", Title: "PropNest", Type: "software", Status: "live",
			ShortDesc: "A property listing and management platform with a Go backend and a React frontend for browsing and managing real estate listings.",
			FullDesc:  "A property listing and management platform for browsing and managing real estate listings. The backend is written in Go and exposes the API that the React frontend consumes for listing, filtering, and managing properties.",
			Image:     "https://i.ibb.co.com/7NTcMTzk/Screenshot-2026-08-08-213254.png",
			ImageAlt:  "PropNest property listings page showing available real estate",
			Emoji:     "🏠", TagsLabel: "Built with",
			Tags:      models.StringSlice{"Go", "React"},
			GithubURL: "https://github.com/Farhan0140/PropNest",
			LiveURL:   "https://prop-nest-client.vercel.app/login",
		},
		{
			Slug: "soulshield", Title: "Soul_Shield", Type: "software", Status: "progress",
			ShortDesc: "Soul Shield helps you build and keep daily routines — dhikr, prayers, reading, or any recurring habit — by tracking completion, celebrating streaks with custom reward messages, and nudging you with a notification if you forget. One backend, two clients:",
			FullDesc:  "Soul Shield helps you build and keep daily routines — dhikr, prayers, reading, or any recurring habit — by tracking completion, celebrating streaks with custom reward messages, and nudging you with a notification if you forget. One backend, two clients:",
			Image:     "https://i.ibb.co.com/TxDFVxHV/Screenshot-2026-08-08-214319.png",
			ImageAlt:  "Soul_Shield application interface",
			Emoji:     "🛡️", TagsLabel: "Built with",
			Tags:      models.StringSlice{"Go", "React", "React-Native"},
			GithubURL: "https://github.com/Farhan0140/Soul_Shield",
		},
		{
			Slug: "carbonlens", Title: "CarbonLens", Type: "software", Status: "live",
			ShortDesc: "An app for tracking and visualizing carbon footprint data, built with Django REST Framework on the backend and React on the frontend.",
			FullDesc:  "An app for tracking and visualizing carbon footprint data. The backend is built with Django REST Framework, serving the data that the React frontend turns into charts and dashboards.",
			Image:     "assets/projects/carbonlens.webp",
			ImageAlt:  "CarbonLens dashboard showing carbon footprint charts",
			Emoji:     "🌱", TagsLabel: "Built with",
			Tags:      models.StringSlice{"Django REST Framework", "React"},
			GithubURL: "https://github.com/Farhan0140/CarbonLens",
			LiveURL:   "https://carbon-lens.vercel.app/login",
		},
		{
			Slug: "typingtest", Title: "Typing_Speed_Test", Type: "software", Status: "live",
			ShortDesc: "A lightweight browser-based typing speed test built with plain HTML and JavaScript to measure typing speed and accuracy.",
			FullDesc:  "A lightweight browser-based typing speed test built with plain HTML and JavaScript. It measures words-per-minute and accuracy in real time as the user types a given passage.",
			Image:     "assets/projects/typing-speed-test.webp",
			ImageAlt:  "Typing Speed Test results screen showing words per minute and accuracy",
			Emoji:     "⌨️", TagsLabel: "Built with",
			Tags:      models.StringSlice{"HTML", "JavaScript"},
			GithubURL: "https://github.com/Farhan0140/Typing_Speed_Test",
			LiveURL:   "https://imaginative-alpaca-a75f52.netlify.app/",
		},
		{
			Slug: "smart-step", Title: "SmartStep: Footstep Energy Harvesting and Automatic Street Lighting System", Type: "iot",
			ShortDesc: "This project is a smart renewable-energy system that generates electricity from human footsteps and uses the generated energy to power street lights automatically.",
			FullDesc:  "My project is a Footstep Power Generation and Smart Street Lighting System. The main idea is to generate electricity from human footsteps using piezoelectric sensors. When someone steps on the sensor, mechanical pressure is converted into electrical energy. A voltage sensor measures the generated voltage and sends the data to the ESP32. The ESP32 displays the voltage on an I2C LCD and also sends the information to a website for real-time monitoring. The generated energy is stored in a battery through a charging module. During the night, an LDR detects darkness and automatically activates a relay, which turns on the street lights using the stored battery energy. Therefore, the entire system works automatically, from energy generation and storage to monitoring and street-light control",
			Image:     "https://i.ibb.co.com/HpPwgPsR/704614733-1578060747654663-5600560599121967951-n.jpg",
			ImageAlt:  "Smart Plant Monitor board with soil moisture sensor wired to a microcontroller",
			Emoji:     "🌿", TagsLabel: "Components used",
			Tags: models.StringSlice{"ESP32", "Piezoelectric", "Voltage Sensor", "I2C LCD", "Charging Module", "Battery", "LDR", "Relay"},
		},
		{
			Slug: "smart-baby", Title: "SmartBaby: IoT-Based Baby Monitoring & Safety System", Type: "iot",
			ShortDesc: "SmartBaby is an IoT-based baby monitoring and safety system designed to continuously monitor a baby's environment and provide automatic protection and real-time alerts to the mother.",
			FullDesc:  "My project is called SmartBaby, an IoT-based Baby Monitoring and Safety System. The system has two units: a Baby Unit and a Mother Unit. The Baby Unit uses an ESP32 and several sensors to monitor temperature, gas leakage, the baby's crying, and movement around the bed. A laser and LDR are used to create a safety boundary so that if the baby approaches the edge of the bed, the system can provide an alert. An audio module can play a soothing sound, and a servo motor can simulate gentle back-patting. When any abnormal situation occurs, the ESP32 sends a signal wirelessly to an ESP32-C3 Mini in the mother's wearable device. The mother then receives an immediate alert through a buzzer. The main goal of this project is to provide automatic baby monitoring, safety, and quick alerts to the mother.",
			Image:     "https://i.ibb.co.com/jZRHNWDy/704327427-1578060770987994-528982844665955715-n.jpg",
			ImageAlt:  "Home automation hub controlling relays and appliances",
			Emoji:     "🏡", TagsLabel: "Components used",
			Tags: models.StringSlice{"NodeMCU (ESP32)", "2-channel relay module", "Buzzer", "Power Supply", "Servo Motor", "Speaker", "Memory Module", "Laser Module", "LDR Module", "Microphone/Sound Sensor", "Gas Sensor", "Temperature Sensor"},
		},
		{
			Slug: "himaghar", Title: "Smartshield Himaghar Monitoring & Safety System", Type: "iot",
			ShortDesc: "Smartshield Himaghar is a smart monitoring and safety system designed for cold storage or refrigerated warehouses. The system continuously monitors temperature, gas levels, motion, and door status to protect stored products and maintain a safe environment",
			FullDesc:  "My project is called ColdGuard, a Smart Cold Storage Monitoring and Safety System. The main controller of the system is an Arduino UNO. It continuously monitors the temperature inside the cold storage using a temperature sensor. A gas sensor detects harmful or unusual gases that may indicate product spoilage or gas leakage, while a PIR sensor detects unexpected movement such as a person or an animal. A magnetic door switch detects when the storage door is opened and helps prevent unnecessary alerts during normal access. If harmful gas is detected, a relay automatically turns on an exhaust fan to remove the gas. If any critical problem occurs, the Arduino uses a SIM800L GSM module to make a phone call to the cold-storage owner. The main goal of this project is to protect stored products and provide automatic safety monitoring and emergency notification.",
			Image:     "https://i.ibb.co.com/Y434yV1g/Screenshot-2026-08-08-230634.png",
			ImageAlt:  "IoT weather station with temperature and humidity sensor",
			Emoji:     "🏭", TagsLabel: "Components used",
			Tags: models.StringSlice{"Arduino Uno", "DHT22 temperature", "LCD display", "Exhaust Fan", "Humidifier", "Relay", "SIM800L GSM Module", "Magnetic Switch", "PIR Motion Sensor", "Gas Sensor"},
		},
		{
			Slug: "smart-desk", Title: "SmartDesk: IoT-Based Smart Table Management System", Type: "iot",
			ShortDesc: "SmartDesk is an IoT-based smart table management system developed using an ESP32. The system is designed to automatically control and monitor different devices on a study/work table, such as a laptop, cooling fan, and table lamp.",
			FullDesc:  "My project is called SmartDesk, an IoT-Based Smart Table Management System. The main controller is an ESP32. An ultrasonic sensor detects the presence of my laptop, and based on this, the cooling fan can be controlled automatically. An LDR sensor monitors the room brightness. If the room becomes dark, the table lamp automatically turns on, and when there is enough light, it turns off. An OLED display shows the current time, room temperature, robotic animations, stopwatch, and countdown timer. The system is also connected to a web interface, through which I can remotely control the table lamp and cooling fan. Overall, this project combines IoT, automation, environmental monitoring, and smart workspace management into a single system.",
			Image:     "https://i.ibb.co.com/pj03PDpV/Screenshot-2026-08-08-232740.png",
			ImageAlt:  "SmartDesk: IoT-Based Smart Table Management System",
			Emoji:     "🖥️", TagsLabel: "Components used",
			Tags: models.StringSlice{"ESP32", "Oled display", "Relay", "Temperature Sensor", "LDR", "Ultrasonic Sensor"},
		},
	}
	return createOrdered(tx, rows)
}

func seedCertifications(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM certifications").Error; err != nil {
		return err
	}
	rows := []models.Certification{
		{
			Title: "2★ Coder Rank on CodeChef", Issuer: "Phitron", BadgeDate: "Batch 5",
			Tags:        models.StringSlice{"CodeChef", "2★ Rated", "Competitive Programming", "Problem Solving"},
			Image:       "https://i.ibb.co.com/SXhbMwh5/farhannadim0000gmail-com-page-0001.jpg",
			Description: "Awarded for achieving an outstanding result at CodeChef with a 2★ Coder rank, from Phitron Batch 5.",
		},
	}
	return createOrdered(tx, rows)
}

func seedSocialLinks(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM social_links").Error; err != nil {
		return err
	}
	rows := []models.SocialLink{
		{Platform: "github", Label: "GitHub", Icon: "i-github", URL: "https://github.com/Farhan0140", ShowInHero: true, ShowInFooter: true},
		{Platform: "linkedin", Label: "LinkedIn", Icon: "i-linkedin", URL: "https://www.linkedin.com/in/farhan-nadim-660a52314", ShowInHero: true, ShowInFooter: true},
		{Platform: "cv", Label: "CV", Icon: "i-download", URL: "/Farhan_Nadim_CV.pdf", ShowInHero: false, ShowInFooter: true},
	}
	return createOrdered(tx, rows)
}

func seedCodingProfiles(tx *gorm.DB) error {
	if err := tx.Exec("DELETE FROM coding_profiles").Error; err != nil {
		return err
	}
	rows := []models.CodingProfile{
		{Platform: "codeforces", Handle: "_Farhan_Nadim__", ProfileURL: "https://codeforces.com/profile/_Farhan_Nadim__"},
		{Platform: "codechef", Handle: "farhan_nadim", ProfileURL: "https://www.codechef.com/users/farhan_nadim"},
		{Platform: "leetcode", Handle: "APtfcgMQdE", ProfileURL: "https://leetcode.com/u/APtfcgMQdE/"},
		{Platform: "codolio", Handle: "farhan_nadim", ProfileURL: "https://codolio.com/profile/farhan_nadim"},
	}
	return createOrdered(tx, rows)
}

// createOrdered assigns SortOrder from slice position and inserts one row
// at a time so per-row validation-shaped defaults (zero-value bools etc.)
// stay predictable.
func createOrdered[T any](tx *gorm.DB, rows []T) error {
	for i := range rows {
		v := any(&rows[i])
		if o, ok := v.(interface{ SetOrder(int) }); ok {
			o.SetOrder(i)
		}
		if err := tx.Create(&rows[i]).Error; err != nil {
			return err
		}
	}
	return nil
}
