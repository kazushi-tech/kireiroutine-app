export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface NavItem {
  label: string;
  href: string;
}