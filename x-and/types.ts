import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface FeatureCard {
  title: string;
  description: string;
  className?: string;
  content?: React.ReactNode;
}

export interface RoleCardData {
  role: string;
  description: string;
  visual: React.ReactNode;
}

export interface TemplateItem {
  category: string;
  icon: LucideIcon;
  image: string; // Placeholder color or gradient
  title: string;
  color: string;
}