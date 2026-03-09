import { CheckCircle } from 'lucide-react';

const StatusBadge = () => {
  return (
    <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/15">
      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
      Operational
    </div>
  );
};

export default StatusBadge;
