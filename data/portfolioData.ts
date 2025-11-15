import { Skill, TimelineItem, Project, Certification, TechnicalEvent } from '../types';

export const skills: Skill[] = [
  { icon: "fab fa-python", name: "Python", description: "Machine Learning, Data Analysis, Automation", level: 90 },
  { icon: "fab fa-java", name: "Java", description: "Application Development, OOP", level: 85 },
  { icon: "fas fa-code", name: "C Programming", description: "System Programming, Embedded Systems", level: 75 },
  { icon: "fab fa-html5", name: "HTML/CSS", description: "Responsive Web Design", level: 95 },
  { icon: "fab fa-js", name: "JavaScript", description: "Interactive Web Applications", level: 80 },
  { icon: "fas fa-database", name: "SQL", description: "Database Management, Queries", level: 85 },
  { icon: "fab fa-github", name: "GitHub", description: "Version Control, Collaboration", level: 90 },
  { icon: "fas fa-wifi", name: "IoT", description: "Connected Devices, Automation", level: 70 },
];

export const tools: Skill[] = [
    { icon: "fas fa-code", name: "Android Studio", description: "Mobile App Development", level: 75 },
    { icon: "fas fa-terminal", name: "VS Code", description: "Primary Code Editor", level: 95 },
    { icon: "fas fa-microchip", name: "Arduino IDE", description: "IoT Development", level: 80 },
    { icon: "fas fa-paint-brush", name: "Canva", description: "Graphic Design", level: 85 },
    { icon: "fas fa-database", name: "MongoDB", description: "NoSQL Database", level: 70 },
    { icon: "fas fa-cube", name: "Anaconda", description: "Data Science", level: 80 },
    { icon: "fas fa-file-code", name: "Jupyter", description: "Notebook Environment", level: 85 },
    { icon: "fas fa-server", name: "Firebase", description: "Backend Services", level: 90 },
];

export const education: TimelineItem[] = [
  {
    title: "B.Tech in Information Technology",
    institution: "Dr. N.G.P Institute of Technology, Coimbatore",
    date: "2022 - 2026 (Expected)",
    description: "Specializing in and Web Application Development. Current CGPA: 7.6",
    details: ["Relevant Coursework: Web Technologies, Database Systems, Machine Learning, Network Security"],
  },
  {
    title: "Higher Secondary Certificate (HSC)",
    institution: "AKV Matric Higher Secondary School",
    date: "2020 - 2022 | 79.4%",
    description: "Specialized in Computer Science and Mathematics",
  },
  {
    title: "Secondary School Leaving Certificate (SSLC)",
    institution: "AKV Matric Higher Secondary School",
    date: "2020 | 78.8%",
    description: "Specialized in Computer Science and Mathematics",
  },
];

export const experience: TimelineItem[] = [
  {
    title: "Front End Development Intern",
    institution: "One Data Software Solutions, Coimbatore",
    date: "January 2024 - February 2024",
    description: "",
    details: [
        "Developed responsive web interfaces using HTML, CSS, and JavaScript",
        "Collaborated with team members to implement UI/UX designs",
        "Participated in code reviews and debugging sessions",
        "Gained experience with version control using Git"
    ],
    tags: ["HTML5", "CSS3", "JavaScript", "Git"],
  },
  {
    title: "Technical Volunteer",
    institution: "College Tech Fest",
    date: "October 2023",
    description: "",
    details: [
        "Managed technical infrastructure for college event",
        "Assisted participants with coding competition setup",
        "Troubleshoot hardware and software issues"
    ],
  },
];

export const projects: Project[] = [
  {
    id: "ml-disease",
    shortName: "MDPS",
    title: "Multiple Chronic Disease Prediction",
    subtitle: "Machine Learning approach for early detection of Heart Disease, Parkinson’s & Diabetes",
    description: "Machine learning system that predicts heart disease, diabetes, and Parkinson's with 85% accuracy by analyzing patient health data and symptoms.",
    tags: ["Python", "Machine Learning", "Streamlit", "Scikit-learn"],
    gradient: "linear-gradient(135deg, #4F46E5, #0EA5E9)",
    date: "June 2024",
    category: "Machine Learning & Healthcare",
    teamSize: "4 members",
    role: "Machine Learning Developer",
    status: "Completed",
    overview: "This project focuses on the prediction of multiple chronic diseases using machine learning algorithms. Logistic Regression is applied for Heart Disease prediction, while Support Vector Machine (SVM) is used for detecting Parkinson’s and Diabetes. The system assists in early detection, enabling better treatment and prevention strategies.",
    features: [
        "Prediction of three major chronic diseases: Heart Disease, Parkinson’s, and Diabetes",
        "Heart Disease model built with Logistic Regression",
        "Parkinson’s and Diabetes prediction using SVM classifier",
        "User-friendly input form for patient health parameters",
        "Visualization of prediction results with accuracy scores",
    ],
    implementation: "We used publicly available healthcare datasets for training and testing. Logistic Regression was chosen for heart disease due to its interpretability and efficiency with binary classification. For Parkinson’s and Diabetes, Support Vector Machine (SVM) was employed to handle non-linear data distributions. Data preprocessing, feature selection, and performance evaluation were performed using Python (Pandas, NumPy, Scikit-learn, Matplotlib).",
    images: {
        main: "https://i.imgur.com/kS5v23e.png",
        gallery: [
            { src: "https://i.imgur.com/kS5v23e.png", title: "Disease Selection", desc: "Main interface to select a disease for prediction." },
            { src: "https://i.imgur.com/vH9i3H6.png", title: "Diabetes Prediction", desc: "Input form for diabetes patient data." },
            { src: "https://i.imgur.com/0o1d2Yg.png", title: "Prediction Result", desc: "Displaying the prediction outcome." },
        ],
    },
  },
  {
    id: "hbs",
    shortName: "HBS",
    title: "Hotel Booking System",
    subtitle: "Full-featured web application for hotel reservations",
    description: "Full-featured web application for hotel reservations with user authentication, room selection, payment integration, and admin dashboard.",
    tags: ["HTML", "CSS", "JavaScript", "Firebase"],
    gradient: "linear-gradient(135deg, #7C3AED, #4F46E5)",
    date: "March 2024",
    category: "Web Development",
    teamSize: "1 member",
    role: "HTML Developer",
    status: "Completed",
    overview: "The Hotel Booking System is a comprehensive web application that allows users to search for hotels, view room availability, make reservations, and process payments. It includes both user-facing features and an admin Room Management for managing bookings and hotel information.",
    features: [
        "User authentication and profile management.",
        "Search and filter hotels by location, price, and amenities.",
        "Real-time room availability checking.",
        "Secure payment gateway integration.",
        "Admin dashboard for managing bookings, rooms, and users.",
    ],
    implementation: "The front-end was built with HTML, CSS, and vanilla JavaScript for a responsive user experience. Firebase was used for the backend, handling user authentication and data storage in Firestore. The payment system was integrated using Stripe API.",
    images: {
        main: "https://i.imgur.com/O6Sj9gq.png",
        gallery: [
            { src: "https://i.imgur.com/O6Sj9gq.png", title: "Booking Interface", desc: "User-friendly hotel search and booking interface." },
            { src: "https://i.imgur.com/4J15jYf.png", title: "Admin Room Management", desc: "Comprehensive admin panel for hotel management." },
            { src: "https://i.imgur.com/oW5e9X9.png", title: "Payment System", desc: "Secure payment processing with Stripe integration." },
            { src: "https://i.imgur.com/O6Sj9gq.png", title: "Room Management", desc: "Efficient room availability and booking management." },
            { src: "https://i.imgur.com/4J15jYf.png", title: "User Interface", desc: "Intuitive user interface for hotel selection." },
            { src: "https://i.imgur.com/oW5e9X9.png", title: "Booking Confirmation", desc: "Complete booking confirmation and payment flow." },
        ],
    },
  },
  {
    id: "ayurveda",
    shortName: "AYUR",
    title: "Holistic Harmony: Ayurveda + Tech Wellness App",
    subtitle: "A modern wellness platform combining ancient Ayurveda principles with technology",
    description: "Mobile app combining Ayurvedic principles with modern technology for personalized wellness plans, product recommendations, and doctor consultations.",
    tags: ["Flutter", "Firebase", "API", "Supabase"],
    gradient: "linear-gradient(135deg, #0EA5E9, #7C3AED)",
    date: "May 2024",
    category: "Mobile Development, Healthcare",
    teamSize: "4 members",
    role: "Flutter Developer",
    status: "Completed",
    overview: "The Holistic Harmony app bridges traditional Ayurvedic wisdom with modern technology to provide users with a personalized wellness journey. It offers features like dosha analysis, customized diet and lifestyle plans, an e-commerce platform for Ayurvedic products, and online consultations with certified practitioners.",
    features: [
        "Personalized wellness plans based on dosha analysis.",
        "E-commerce for Ayurvedic products.",
        "Appointment booking with doctors.",
        "User authentication and secure data handling.",
        "Modern, intuitive user interface.",
    ],
    implementation: "The app was developed using Flutter and Dart for cross-platform compatibility. Firebase and Supabase were used for backend services, including authentication, database management (Firestore), and cloud functions. External APIs were integrated for payment processing and other services.",
    images: {
        main: "https://i.imgur.com/N3vTjG1.jpeg",
        gallery: [
            { src: "https://i.imgur.com/N3vTjG1.jpeg", title: "Login Page", desc: "Secure authentication interface with modern UI." },
            { src: "https://i.imgur.com/Jd3fLqM.png", title: "Signup Page", desc: "User-friendly registration form with validation." },
            { src: "https://i.imgur.com/0Qf8h3C.jpeg", title: "Doctor List", desc: "Find doctors with filters and availability info." },
            { src: "https://i.imgur.com/4l5R2tG.jpeg", title: "Dashboard", desc: "Central hub showing personalized health details." },
            { src: "https://i.imgur.com/h5T2e7S.jpeg", title: "Product Page", desc: "Browse Ayurvedic medicines with prices & details." },
            { src: "https://i.imgur.com/Q2h8t2w.jpeg", title: "Checkout Page", desc: "Seamless order placement and payment system." },
        ],
    },
  },
  {
    id: "irrigation",
    shortName: "AWI",
    title: "Automatic Water Irrigation System",
    subtitle: "IoT-based solution for smart agriculture",
    description: "Developed an automatic water irrigation system utilizing sensors and microcontrollers to monitor soil moisture and regulate water flow, optimizing water usage for efficient plant care.",
    tags: ["Microcontrollers", "Agriculture", "Automation", "IoT"],
    gradient: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    date: "August 2024",
    category: "IoT & Embedded Systems",
    teamSize: "4 members",
    role: "Embedded Developer",
    status: "Completed",
    overview: "The Automatic Irrigation System is designed to reduce water wastage in agriculture by monitoring soil moisture and controlling water flow automatically. It helps farmers optimize water usage and improve crop yield.",
    features: [
        "Soil moisture sensor-based irrigation control",
        "Arduino microcontroller integration",
        "Automatic water pump activation",
        "Real-time monitoring",
        "Low-cost and scalable design",
    ],
    implementation: "The system was built using Arduino UNO, soil moisture sensors, and a water pump motor. Data was collected and used to control irrigation cycles. Future scope includes IoT integration with cloud dashboards for remote monitoring.",
    images: {
        main: "https://i.imgur.com/4h1gS3w.jpeg",
        gallery: [
            { src: "https://i.imgur.com/4h1gS3w.jpeg", title: "System Setup", desc: "Complete setup with Arduino and sensors." },
            { src: "https://i.imgur.com/m4L0i3E.jpeg", title: "Moisture Sensor", desc: "Close-up of the soil moisture sensor." },
            { src: "https://i.imgur.com/gK2Yh6v.jpeg", title: "Arduino Board", desc: "The brain of the system, Arduino UNO." },
            { src: "https://i.imgur.com/s6W7t4f.jpeg", title: "Water Pump", desc: "The pump that controls water flow." },
        ],
    },
  },
];

export const certifications: Certification[] = [
    { title: "Programming in Java", institution: "NPTEL (IIT Madras)", date: "2023 | Score: 58%", description: "12-week course covering core Java concepts including OOP, data structures, and exception handling." },
    { title: "Introduction To Internet Of Things 4.0", institution: "NPTEL (IIT Kharagpur)", date: "2023 | Score: 73%", description: "Comprehensive course on Internet of Things architecture, protocols, and web integration." },
    { title: "Human Computer Interaction", institution: "NPTEL (University Certification)", date: "2022 | Score: 79%", description: "Studied principles of user-centered design, usability testing, and interface development." },
];

export const technicalEvents: TechnicalEvent[] = [
    { title: "Smart India Hackathon Participant", institution: "Dr. N.G.P Institute of Technology", date: "2023", description: "We propose a solar-powered EV charging system designed to support electric vehicles during long-distance travel. By utilizing renewable solar energy, the system offers an eco-friendly and portable charging solution. This helps reduce range anxiety, promotes sustainable transport, and supports charging in remote or infrastructure-poor areas." },
    { title: "Technical Symposium Attendee", institution: "Madras Institute of Technology, Chennai", date: "2023", description: "Attended a Technical Symposium at Madras Institute of Technology, Chennai (2023). Participated in hands-on cybersecurity workshops and gained insights into emerging technologies. Engaged with industry experts through keynote sessions on the future of information security." },
    { title: "Code Debugging Competition", institution: "Sri Ramakrishna Institute of Technology", date: "2022", description: "Participated in the Code Debugging Competition at Sri Ramakrishna Institute of Technology (2022). Solved complex Java and Python programming errors under strict time constraints. Enhanced logical thinking, problem-solving speed, and real-time debugging skills in a competitive environment." },
];