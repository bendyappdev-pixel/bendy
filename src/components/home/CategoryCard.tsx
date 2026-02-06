import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Mountain, UtensilsCrossed, Baby, LucideIcon } from 'lucide-react';
import { Category } from '../../types';

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Mountain,
  UtensilsCrossed,
  Baby,
};

// Map category colors to new theme
const categoryColorMap: Record<string, { bg: string; button: string }> = {
  'bg-mountain': { bg: 'from-sunset-500 to-sunset-400', button: 'bg-sunset-500 hover:bg-sunset-400' },
  'bg-forest': { bg: 'from-pine-700 to-pine-600', button: 'bg-pine-600 hover:bg-pine-500' },
  'bg-earth': { bg: 'from-sunset-300 to-sunset-400', button: 'bg-sunset-300 hover:bg-sunset-400 text-navy-900' },
  'bg-purple-500': { bg: 'from-blue-600 to-blue-500', button: 'bg-blue-500 hover:bg-blue-400' },
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Mountain;
  const colors = categoryColorMap[category.color] || categoryColorMap['bg-forest'];

  return (
    <Link
      to={category.href}
      className="card card-hover overflow-hidden group flex flex-col"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${colors.bg} p-6`}>
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-white font-heading">
          {category.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-gray-400 mb-6 flex-grow">
          {category.description}
        </p>

        <div className={`w-full inline-flex items-center justify-center gap-2 ${colors.button} text-white font-medium px-4 py-3 rounded-xl transition-colors`}>
          Explore
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
