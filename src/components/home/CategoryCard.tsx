import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Mountain, UtensilsCrossed, Baby, LucideIcon } from 'lucide-react';
import { Category } from '../../types';

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Mountain,
  UtensilsCrossed,
  Baby,
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Mountain;

  return (
    <Link
      to={category.href}
      className="card p-8 group hover:scale-[1.02] transition-transform duration-200 flex flex-col"
    >
      <div
        className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-3 font-heading">
        {category.name}
      </h3>
      <p className="text-gray-600 mb-6 flex-grow">
        {category.description}
      </p>

      <div className="flex items-center text-forest font-medium group-hover:gap-2 transition-all">
        Explore {category.name}
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
