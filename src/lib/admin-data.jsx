export const mockDoctors = [
    { id: "DOC-001", name: "Dr. Robert Smith", specialty: "Cardiology", experience: "15 Yrs", status: "Active" },
    { id: "DOC-002", name: "Dr. Lisa Wong", specialty: "Dermatology", experience: "8 Yrs", status: "Active" },
    { id: "DOC-003", name: "Dr. Michael Chen", specialty: "Pediatrics", experience: "12 Yrs", status: "Inactive" },
    { id: "DOC-004", name: "Dr. Sarah Miller", specialty: "Neurology", experience: "10 Yrs", status: "Active" },
];

export const mockSpecialties = [
    { name: "Cardiology", slug: "cardiology", doctors: 12, services: 8, status: "Active" },
    { name: "Dermatology", slug: "dermatology", doctors: 8, services: 12, status: "Active" },
    { name: "Pediatrics", slug: "pediatrics", doctors: 15, services: 10, status: "Active" },
    { name: "Neurology", slug: "neurology", doctors: 5, services: 6, status: "Active" },
    { name: "Dentistry", slug: "dentistry", doctors: 6, services: 14, status: "Inactive" },
];

export const mockServices = [
    { name: "Heart Checkup", category: "Cardiology", duration: "45 mins", price: "$120", status: "Active" },
    { name: "Skin Consultation", category: "Dermatology", duration: "30 mins", price: "$80", status: "Active" },
    { name: "Child Vaccination", category: "Pediatrics", duration: "20 mins", price: "$50", status: "Active" },
    { name: "Brain MRI Analysis", category: "Neurology", duration: "1 hour", price: "$450", status: "Draft" },
];
