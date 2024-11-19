"use client"

import * as React from "react"
import {AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "数据管理",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "数值数据",
                    url: "#",
                },
                {
                    title: "模型数据",
                    url: "#",
                },
                {
                    title: "时序图数据",
                    url: "#",
                },
                {
                    title: "视频数据",
                    url: "#",
                },
                {
                    title: "音频数据",
                    url: "#",
                },
                {
                    title: "文本数据",
                    url: "#",
                },
                {
                    title: "向量数据",
                    url: "#",
                }, {
                    title: "图片数据",
                    url: "#",
                },
                {
                    title: "图谱数据",
                    url: "#",
                },
                {
                    title: "表数据",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "数据查询",
            url: "/DataDashboard",
            icon: Frame,
        },
        {
            name: "数据治理",
            url: "/DataGovernance",
            icon: PieChart,
        },
        {
            name: "模型管理",
            url: "/DataManagement",
            icon: Map,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavProjects projects={data.projects}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
