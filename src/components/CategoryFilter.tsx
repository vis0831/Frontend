import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  slug: string;
  name: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false
}: CategoryFilterProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-foreground whitespace-nowrap">
        Category:
      </span>
      <Select value={selectedCategory} onValueChange={onCategoryChange} disabled={isLoading}>
        <SelectTrigger className="w-[180px] sm:w-[200px]">
          <SelectValue placeholder="All Categories" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent className="bg-card border border-border shadow-hover">
          <SelectItem value="all" className="hover:bg-accent">
            All Categories
          </SelectItem>
          {categories.map((category) => (
            <SelectItem 
              key={category.slug} 
              value={category.slug}
              className="hover:bg-accent"
            >
              <div className="flex items-center justify-between w-full">
                <span>{category.name}</span>
                {category.count && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ({category.count})
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};