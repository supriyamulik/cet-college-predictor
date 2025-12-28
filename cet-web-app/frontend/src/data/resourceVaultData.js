// frontend/src/data/resourceVaultData.js
// Complete data for Maharashtra CET Resource Vault

export const documentsData = {
  application: {
    title: "For Application",
    items: [
      {
        id: 1,
        name: "MHT CET Application Form",
        description: "Completed online application form",
        required: true,
        deadline: "February 27, 2025",
        format: "Online Form",
        notes: "Fill carefully, cannot be edited after submission"
      },
      {
        id: 2,
        name: "Passport Size Photographs",
        description: "Recent color photograph with white background",
        required: true,
        deadline: "During Application",
        format: "JPG (max 100KB)",
        notes: "Size: 3.5cm x 4.5cm, taken within last 3 months"
      },
      {
        id: 3,
        name: "Valid Photo ID Proof",
        description: "Aadhar Card / Voter ID / Passport / Driver's License",
        required: true,
        deadline: "During Application",
        format: "PDF/JPG",
        notes: "Must be government issued and valid"
      },
      {
        id: 4,
        name: "Class 10th Marksheet",
        description: "SSC or equivalent passing certificate",
        required: true,
        deadline: "During Application",
        format: "PDF",
        notes: "For Date of Birth verification"
      },
      {
        id: 5,
        name: "Class 12th Marksheet",
        description: "HSC or equivalent marksheet",
        required: true,
        deadline: "During Application",
        format: "PDF",
        notes: "Must show Physics, Chemistry, Mathematics/Biology"
      },
      {
        id: 6,
        name: "Category Certificate",
        description: "SC/ST/OBC/VJNT/SBC/EWS Certificate",
        required: false,
        deadline: "During Application",
        format: "PDF",
        notes: "Only if claiming reservation benefits"
      },
      {
        id: 7,
        name: "Caste Validity Certificate",
        description: "Issued by competent authority",
        required: false,
        deadline: "Before Counselling",
        format: "PDF",
        notes: "Required for SC/ST/OBC/VJNT/SBC category candidates"
      },
      {
        id: 8,
        name: "Non-Creamy Layer Certificate",
        description: "For OBC candidates (valid for current financial year)",
        required: false,
        deadline: "Before Counselling",
        format: "PDF",
        notes: "Must be issued after April 1st of admission year"
      },
      {
        id: 9,
        name: "Domicile Certificate",
        description: "Maharashtra State domicile certificate",
        required: true,
        deadline: "Before Counselling",
        format: "PDF",
        notes: "Essential for state quota seats"
      },
      {
        id: 10,
        name: "Payment Receipt",
        description: "Application fee payment confirmation",
        required: true,
        deadline: "During Application",
        format: "PDF",
        notes: "Save transaction ID and receipt"
      }
    ]
  },
  counselling: {
    title: "For CAP Counselling",
    items: [
      {
        id: 11,
        name: "CAP Registration Form",
        description: "Online counselling registration",
        required: true,
        deadline: "As per CAP schedule",
        format: "Online Form",
        notes: "Register immediately after result declaration"
      },
      {
        id: 12,
        name: "MHT CET Scorecard 2025",
        description: "Official score card from CET Cell",
        required: true,
        deadline: "During CAP",
        format: "PDF",
        notes: "Download from official website after result"
      },
      {
        id: 13,
        name: "MHT CET Admit Card 2025",
        description: "Exam hall ticket",
        required: true,
        deadline: "During CAP",
        format: "PDF",
        notes: "Keep original copy safe"
      },
      {
        id: 14,
        name: "Class X & XII Certificates",
        description: "Passing certificates with marksheets",
        required: true,
        deadline: "Document Verification",
        format: "Original + PDF",
        notes: "Carry both original and photocopy"
      },
      {
        id: 15,
        name: "JEE Main Marksheet",
        description: "If claiming JEE Main score",
        required: false,
        deadline: "During CAP",
        format: "PDF",
        notes: "Only if opting for JEE Main score for admission"
      },
      {
        id: 16,
        name: "Character Certificate",
        description: "From last attended institution",
        required: true,
        deadline: "College Admission",
        format: "Original",
        notes: "Must be recent (within 6 months)"
      },
      {
        id: 17,
        name: "School Leaving Certificate",
        description: "Transfer/Leaving certificate from school",
        required: true,
        deadline: "College Admission",
        format: "Original",
        notes: "Original TC is mandatory"
      },
      {
        id: 18,
        name: "Migration Certificate",
        description: "For students from outside Maharashtra",
        required: false,
        deadline: "College Admission",
        format: "Original",
        notes: "Required only for out-of-state students"
      },
      {
        id: 19,
        name: "Gap Certificate",
        description: "If there's a gap after 12th",
        required: false,
        deadline: "Document Verification",
        format: "Original + PDF",
        notes: "Affidavit stating reason for gap year"
      },
      {
        id: 20,
        name: "Income Certificate",
        description: "For scholarship and fee concession",
        required: false,
        deadline: "During Admission",
        format: "Original + PDF",
        notes: "Valid for current financial year"
      }
    ]
  }
};

export const scholarshipsData = [
  {
    id: 1,
    name: "Post Matric Scholarship for SC/ST Students",
    authority: "Government of India",
    eligibility: [
      "Belongs to SC/ST category",
      "Family income less than ₹2.5 lakh per annum",
      "Studying in government recognized institution"
    ],
    benefits: [
      "100% tuition fee reimbursement",
      "Maintenance allowance: ₹1000-1200 per month",
      "Hostel charges (if applicable)"
    ],
    amount: "₹50,000 - ₹2,00,000 per year",
    deadline: "Check MahaDBT portal",
    applicationProcess: "Apply online through MahaDBT portal",
    website: "https://mahadbt.maharashtra.gov.in",
    documents: [
      "Caste certificate",
      "Income certificate",
      "Previous year marksheet",
      "Bank account details",
      "Aadhar card"
    ]
  },
  {
    id: 2,
    name: "Dr. Punjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna",
    authority: "Maharashtra Government",
    eligibility: [
      "Children of registered construction workers",
      "Children of farmers with less than 5 acres land",
      "Annual family income below ₹8 lakh"
    ],
    benefits: [
      "Hostel accommodation support",
      "Monthly maintenance allowance",
      "Study material support"
    ],
    amount: "₹5,000 - ₹10,000 per month",
    deadline: "November - December annually",
    applicationProcess: "Through MahaDBT portal",
    website: "https://mahadbt.maharashtra.gov.in",
    documents: [
      "Labor registration certificate",
      "Income certificate",
      "Bonafide certificate",
      "Bank account passbook"
    ]
  },
  {
    id: 3,
    name: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojana",
    authority: "Maharashtra Government",
    eligibility: [
      "Students from economically weaker sections",
      "Family income less than ₹8 lakh per annum",
      "Minimum 60% marks in previous exam"
    ],
    benefits: [
      "50% tuition fee reimbursement",
      "50% examination fee reimbursement"
    ],
    amount: "Up to ₹50,000 per year",
    deadline: "Usually August - September",
    applicationProcess: "Online application via MahaDBT",
    website: "https://mahadbt.maharashtra.gov.in",
    documents: [
      "Income certificate (below ₹8 lakh)",
      "Previous year marksheet (60%+ marks)",
      "Bonafide certificate",
      "Fee receipt from college"
    ]
  },
  {
    id: 4,
    name: "EBC Scholarship - DTE Maharashtra",
    authority: "Directorate of Technical Education, Maharashtra",
    eligibility: [
      "Economically Backward Class students",
      "Annual family income: ₹1 lakh - ₹8 lakh",
      "Pursuing diploma/degree in technical education"
    ],
    benefits: [
      "Tuition fee waiver",
      "Examination fee support",
      "One-time grant for books/equipment"
    ],
    amount: "₹10,000 - ₹50,000 per year",
    deadline: "Check DTE website",
    applicationProcess: "Apply through institute or MahaDBT",
    website: "https://dte.maharashtra.gov.in",
    documents: [
      "EBC certificate",
      "Income certificate",
      "Admission proof",
      "Bank details"
    ]
  },
  {
    id: 5,
    name: "VJNT Scholarship",
    authority: "Vimukt Jati & Nomadic Tribes Welfare Department",
    eligibility: [
      "Students from VJNT category",
      "Pursuing higher education in recognized institution",
      "Income criteria as per government norms"
    ],
    benefits: [
      "Full/partial tuition fee reimbursement",
      "Maintenance allowance",
      "Book allowance"
    ],
    amount: "Varies based on course",
    deadline: "As notified by department",
    applicationProcess: "Through MahaDBT portal",
    website: "https://mahadbt.maharashtra.gov.in",
    documents: [
      "VJNT caste certificate",
      "Income certificate",
      "Bonafide certificate",
      "Fee receipt"
    ]
  },
  {
    id: 6,
    name: "OBC Scholarship",
    authority: "Maharashtra Backward Class Welfare Department",
    eligibility: [
      "OBC category students (Non-Creamy Layer)",
      "Annual family income below ₹8 lakh",
      "Minimum attendance and academic requirements"
    ],
    benefits: [
      "Tuition fee support",
      "Maintenance charges",
      "Hostel fees (if applicable)"
    ],
    amount: "Up to ₹50,000 per year",
    deadline: "Check MahaDBT for updates",
    applicationProcess: "Online via MahaDBT portal",
    website: "https://mahadbt.maharashtra.gov.in",
    documents: [
      "OBC certificate",
      "Non-Creamy Layer certificate",
      "Income certificate",
      "Previous year marksheet"
    ]
  },
  {
    id: 7,
    name: "SBC (Special Backward Class) Scholarship",
    authority: "Maharashtra Government",
    eligibility: [
      "Special Backward Class category",
      "Income limit as per government norms",
      "Regular student in recognized institution"
    ],
    benefits: [
      "Educational fee support",
      "Study material allowance",
      "Accommodation support (hostel students)"
    ],
    amount: "Varies by course and class",
    deadline: "Annual - check MahaDBT",
    applicationProcess: "Apply through MahaDBT",
    website: "https://mahadbt.maharashtra.gov.in",
    documents: [
      "SBC certificate",
      "Income certificate",
      "Admission receipt",
      "Bank account details"
    ]
  },
  {
    id: 8,
    name: "DHE Post Graduate Scholarship",
    authority: "Directorate of Higher Education, Maharashtra",
    eligibility: [
      "Merit-based for PG courses",
      "Good academic record in graduation",
      "Preference to economically weaker students"
    ],
    benefits: [
      "Monthly scholarship amount",
      "Fee concession",
      "Research support (for research students)"
    ],
    amount: "₹8,000 - ₹15,000 per month",
    deadline: "Usually after PG admission",
    applicationProcess: "Through college or DHE portal",
    website: "https://dhe.maharashtra.gov.in",
    documents: [
      "Graduation marksheet",
      "PG admission proof",
      "Income certificate",
      "Research proposal (if applicable)"
    ]
  }
];

export const importantLinks = {
  official: [
    {
      id: 1,
      title: "CET Cell Official Website",
      description: "Main portal for MHT CET examinations",
      url: "https://cetcell.mahacet.org",
      category: "Official Portal"
    },
    {
      id: 2,
      title: "Engineering Admissions Portal (CAP)",
      description: "Centralized Admission Process for engineering",
      url: "https://fe2025.mahacet.org",
      category: "Admission Portal"
    },
    {
      id: 3,
      title: "MahaDBT Scholarship Portal",
      description: "Apply for various government scholarships",
      url: "https://mahadbt.maharashtra.gov.in",
      category: "Scholarship"
    },
    {
      id: 4,
      title: "DTE Maharashtra",
      description: "Directorate of Technical Education",
      url: "https://dte.maharashtra.gov.in",
      category: "Official Portal"
    }
  ],
  application: [
    {
      id: 5,
      title: "MHT CET Application Form 2025",
      description: "Apply for MHT CET exam",
      url: "https://cetcell.mahacet.org/",
      category: "Application"
    },
    {
      id: 6,
      title: "Download Admit Card",
      description: "Get your MHT CET hall ticket",
      url: "https://cetcell.mahacet.org/",
      category: "Application"
    },
    {
      id: 7,
      title: "Check Result/Score",
      description: "View your MHT CET results and scorecard",
      url: "https://cetcell.mahacet.org/",
      category: "Results"
    }
  ],
  counselling: [
    {
      id: 8,
      title: "CAP Round 1 Registration",
      description: "First round of counselling registration",
      url: "https://fe2025.mahacet.org",
      category: "Counselling"
    },
    {
      id: 9,
      title: "Choice Filling",
      description: "Fill your college and branch preferences",
      url: "https://fe2025.mahacet.org",
      category: "Counselling"
    },
    {
      id: 10,
      title: "Seat Allotment Result",
      description: "Check your allotted college and branch",
      url: "https://fe2025.mahacet.org",
      category: "Counselling"
    }
  ],
  useful: [
    {
      id: 11,
      title: "College Directory",
      description: "List of all participating engineering colleges",
      url: "https://dte.maharashtra.gov.in",
      category: "Information"
    },
    {
      id: 12,
      title: "Previous Year Cutoffs",
      description: "Branch-wise cutoff ranks",
      url: "https://fe2025.mahacet.org",
      category: "Information"
    },
    {
      id: 13,
      title: "Fee Structure",
      description: "College-wise fee information",
      url: "https://dte.maharashtra.gov.in",
      category: "Information"
    }
  ]
};

export const contactsData = {
  helplines: [
    {
      id: 1,
      title: "CET Examination Helpline",
      phones: ["07969134401", "07969134402"],
      email: "[email protected]",
      timings: "10:00 AM - 6:00 PM (Mon-Sat)",
      purpose: "Exam-related queries, admit card issues"
    },
    {
      id: 2,
      title: "CAP Admission Helpline",
      phones: ["18002129422", "+918068636170"],
      email: "[email protected]",
      timings: "9:00 AM - 7:00 PM (All days during CAP)",
      purpose: "Counselling, seat allotment, admission queries"
    },
    {
      id: 3,
      title: "Technical Support",
      phones: ["18002129422"],
      email: "[email protected]",
      timings: "9:00 AM - 6:00 PM (Mon-Fri)",
      purpose: "Website issues, login problems, payment issues"
    }
  ],
  offices: [
    {
      id: 4,
      title: "State CET Cell Office",
      address: "8th Floor, New Excelsior Building, A.K. Nayak Marg, Fort, Mumbai - 400 001, Maharashtra",
      phone: "022-22620583",
      email: "[email protected]",
      mapLink: "https://maps.google.com/?q=CET+Cell+Mumbai"
    }
  ]
};

export const importantDates = {
  application: [
    {
      id: 1,
      event: "Application Start Date",
      date: "December 30, 2024",
      status: "completed",
      description: "MHT CET 2025 application portal opens"
    },
    {
      id: 2,
      event: "Application Last Date (Without Late Fee)",
      date: "February 7, 2025",
      status: "upcoming",
      description: "Last date to apply without additional charges"
    },
    {
      id: 3,
      event: "Application Last Date (With Late Fee)",
      date: "February 27, 2025",
      status: "upcoming",
      description: "Final deadline with late fee of ₹500"
    },
    {
      id: 4,
      event: "Correction Window",
      date: "March 5-10, 2025 (tentative)",
      status: "upcoming",
      description: "Edit application details (limited fields)"
    }
  ],
  exam: [
    {
      id: 5,
      event: "PCB Admit Card Release",
      date: "April 3, 2025",
      status: "upcoming",
      description: "Download hall ticket for PCB paper"
    },
    {
      id: 6,
      event: "PCB Exam Date",
      date: "April 9-17, 2025",
      status: "upcoming",
      description: "MHT CET PCB examination"
    },
    {
      id: 7,
      event: "PCM Admit Card Release",
      date: "April 9, 2025",
      status: "upcoming",
      description: "Download hall ticket for PCM paper"
    },
    {
      id: 8,
      event: "PCM Exam Date",
      date: "April 19-27, 2025",
      status: "upcoming",
      description: "MHT CET PCM examination"
    },
    {
      id: 9,
      event: "PCM Re-exam",
      date: "May 5, 2025",
      status: "upcoming",
      description: "Re-examination for affected candidates"
    }
  ],
  results: [
    {
      id: 10,
      event: "Result Declaration",
      date: "May 2025 (tentative)",
      status: "upcoming",
      description: "MHT CET 2025 results and scorecards"
    },
    {
      id: 11,
      event: "Scorecard Download",
      date: "After Result (tentative)",
      status: "upcoming",
      description: "Download official scorecard from website"
    }
  ],
  counselling: [
    {
      id: 12,
      event: "CAP Round 1 Registration",
      date: "June 2025 (tentative)",
      status: "upcoming",
      description: "First round counselling registration opens"
    },
    {
      id: 13,
      event: "CAP Round 1 Choice Filling",
      date: "June 2025 (tentative)",
      status: "upcoming",
      description: "Submit college and branch preferences"
    },
    {
      id: 14,
      event: "CAP Round 1 Allotment",
      date: "June 2025 (tentative)",
      status: "upcoming",
      description: "First round seat allotment result"
    },
    {
      id: 15,
      event: "Document Verification & Fee Payment",
      date: "June-July 2025 (tentative)",
      status: "upcoming",
      description: "Submit documents and pay fees"
    },
    {
      id: 16,
      event: "CAP Round 2",
      date: "July 2025 (tentative)",
      status: "upcoming",
      description: "Second round of counselling"
    },
    {
      id: 17,
      event: "CAP Round 3",
      date: "July 2025 (tentative)",
      status: "upcoming",
      description: "Third round of counselling"
    },
    {
      id: 18,
      event: "College Reporting",
      date: "August 2025 (tentative)",
      status: "upcoming",
      description: "Report to allotted college"
    }
  ]
};

export const tipsData = [
  {
    id: 1,
    category: "Application",
    title: "Double-check Application Details",
    description: "Verify name, date of birth, and other details match exactly with your 10th marksheet. Errors can cause issues during admission.",
    icon: "alert"
  },
  {
    id: 2,
    category: "Application",
    title: "Keep Payment Receipt Safe",
    description: "Download and save multiple copies of payment receipt. You'll need it throughout the admission process.",
    icon: "check"
  },
  {
    id: 3,
    category: "Documents",
    title: "Get Documents Verified Early",
    description: "Get caste, income, and domicile certificates verified from competent authority well before counselling starts.",
    icon: "file"
  },
  {
    id: 4,
    category: "Documents",
    title: "Make Multiple Photocopies",
    description: "Keep at least 3-4 photocopies of all documents. You'll need them at multiple stages.",
    icon: "copy"
  },
  {
    id: 5,
    category: "Counselling",
    title: "Research Colleges Thoroughly",
    description: "Visit college websites, check placements, faculty, and infrastructure before choice filling.",
    icon: "search"
  },
  {
    id: 6,
    category: "Counselling",
    title: "Fill Maximum Choices",
    description: "Fill 100+ choices in CAP to maximize your chances of getting a seat. Don't limit yourself.",
    icon: "list"
  },
  {
    id: 7,
    category: "Counselling",
    title: "Check Previous Year Cutoffs",
    description: "Analyze last 2-3 years' cutoffs to make realistic choices. Don't rely only on current year predictions.",
    icon: "chart"
  },
  {
    id: 8,
    category: "Fees",
    title: "Pay Fees Within Deadline",
    description: "Missing fee payment deadline means losing your seat. Set reminders and pay 1-2 days early.",
    icon: "clock"
  },
  {
    id: 9,
    category: "General",
    title: "Check Official Website Daily",
    description: "During CAP season, check official website twice daily for updates and notifications.",
    icon: "bell"
  },
  {
    id: 10,
    category: "General",
    title: "Keep Contact Numbers Active",
    description: "Ensure mobile number and email used in application are active. You'll receive important updates on them.",
    icon: "phone"
  }
];