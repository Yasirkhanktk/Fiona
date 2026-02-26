import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  gradient?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  gradient = 'from-slate-500 to-slate-600'
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-dashed">
        <CardContent className="pt-16 pb-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 flex items-center justify-center mx-auto mb-6`}
          >
            <Icon className="w-10 h-10 text-slate-400" />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-2 text-slate-800">{title}</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              className={`gap-2 bg-gradient-to-r ${gradient} shadow-lg`}
              size="lg"
            >
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
