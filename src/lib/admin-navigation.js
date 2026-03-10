import {
    LayoutDashboard,
    CalendarDays,
    Stethoscope,
    Shapes,
    BriefcaseMedical,
    MapPin,
    MessageSquareMore,
    LifeBuoy,
    Mail,
    Bell,
    FileText,
    PanelsTopLeft,
    Newspaper,
    CircleHelp,
    ShieldCheck,
    Image,
    Users,
    KeyRound,
    Settings,
    BarChart3,
    History,
    Route,
    ShieldPlus,
} from "lucide-react";

export const adminNavigation = [
    {
        group: "Overview",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ],
    },
    {
        group: "Clinic Operations",
        items: [
            { name: "Appointments", href: "/admin/appointments", icon: CalendarDays, badge: 12 },
            { name: "Doctors", href: "/admin/doctors", icon: Stethoscope },
            { name: "Specialties", href: "/admin/specialties", icon: Shapes },
            { name: "Services", href: "/admin/services", icon: BriefcaseMedical },
            { name: "Insurance", href: "/admin/insurance", icon: ShieldPlus },
            { name: "Locations", href: "/admin/locations", icon: MapPin },
        ],
    },
    {
        group: "Support and Communication",
        items: [
            { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquareMore, badge: 5 },
            { name: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
            { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
            { name: "Notifications", href: "/admin/notifications", icon: Bell },
        ],
    },
    {
        group: "Website Content",
        items: [
            { name: "Pages", href: "/admin/pages", icon: FileText },
            { name: "Homepage Sections", href: "/admin/homepage-sections", icon: PanelsTopLeft },
            { name: "Blog", href: "/admin/blog", icon: Newspaper },
            { name: "FAQ", href: "/admin/faq", icon: CircleHelp },
            { name: "Legal Documents", href: "/admin/legal", icon: ShieldCheck },
            { name: "Media Library", href: "/admin/media", icon: Image },
        ],
    },
    {
        group: "Administration",
        items: [
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Roles & Permissions", href: "/admin/roles", icon: KeyRound },
            { name: "Settings", href: "/admin/settings", icon: Settings },
            { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
            { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
            { name: "Route Registry", href: "/admin/routes", icon: Route },
        ],
    },
];
