'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import MenuSection from './MenuSection';

interface InteractiveMenuProps {
  categories: Array<{
    key: string;
    label: string;
    icon: string;
    color: string;
  }>;
  menuItems: MenuItem[];
}

export default function InteractiveMenu({ categories, menuItems }: InteractiveMenuProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {categories.map((category) => {
        const items = menuItems.filter((item) => item.category === category.key);
        return (
          <MenuSection
            key={category.key}
            category={category}
            items={items}
            isOpen={openCategories.has(category.key)}
            onToggle={() => toggleCategory(category.key)}
          />
        );
      })}
    </div>
  );
}
