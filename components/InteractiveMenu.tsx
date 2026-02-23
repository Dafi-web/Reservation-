'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import MenuSection from './MenuSection';

interface InteractiveMenuProps {
  categories: Array<{
    key: string;
    label: string;
    icon: string;
    iconImageUrl?: string;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }>;
  menuItems: MenuItem[];
}

export default function InteractiveMenu({ categories, menuItems }: InteractiveMenuProps) {
  const items = Array.isArray(menuItems) ? menuItems : [];
  // Start with all categories expanded
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(categories.map(cat => cat.key))
  );

  const toggleCategory = (categoryKey: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {categories.map((category, index) => {
        const categoryItems = items.filter((item) => item.category === category.key);
        return (
          <div
            key={category.key}
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: `${0.08 * index}s`, animationFillMode: 'both' }}
          >
            <MenuSection
              category={category}
              items={categoryItems}
              isOpen={openCategories.has(category.key)}
              onToggle={() => toggleCategory(category.key)}
            />
          </div>
        );
      })}
    </div>
  );
}
