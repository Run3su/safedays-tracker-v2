import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Heart, Shield, Baby } from 'lucide-react';
import { Card } from '../components/UIComponents';
import { CycleData, CyclePhase } from '../types';
import { getPhaseForDate, calculateDueDate } from '../services/dateUtils';

interface CalendarViewProps {
  data: CycleData;
  onUpdatePeriod: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ data, onUpdatePeriod }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [animatingDate, setAnimatingDate] = useState<Date | null>(null);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  // Ensure we consistently use Sunday as start of week to match the header
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Pregnancy calculations if active
  const dueDate = data.isPregnant && data.pregnancyStart ? calculateDueDate(data.pregnancyStart) : null;

  const handleDateClick = (day: Date) => {
    // Disable period setting if in pregnancy mode
    if (data.isPregnant) return;

    setAnimatingDate(day);
    // Visual feedback delay
    setTimeout(() => {
      onUpdatePeriod(day);
      setAnimatingDate(null);
    }, 400);
  };

  const getDayStyle = (date: Date, phase: CyclePhase) => {
    let style = "h-10 w-10 rounded-full flex items-center justify-center text-sm relative transition-all duration-300 transform ";
    
    // --- PREGNANCY MODE STYLING ---
    if (data.isPregnant) {
      style += "text-gray-700 dark:text-gray-200 ";
      
      if (isToday(date)) {
        style += "bg-purple-600 text-white font-bold shadow-lg shadow-purple-200 dark:shadow-purple-900/50 ";
      } else if (dueDate && isSameDay(date, dueDate)) {
        style += "bg-pink-400 text-white font-bold ring-2 ring-pink-200 dark:ring-pink-900 ";
      } else {
         style += "hover:bg-purple-50 dark:hover:bg-purple-900/20 ";
      }
      return style;
    }

    // --- CYCLE MODE STYLING ---
    // Animation state
    if (animatingDate && isSameDay(date, animatingDate)) {
      style += "scale-110 bg-brand-600 text-white shadow-lg ring-4 ring-brand-200 dark:ring-brand-800 z-10 ";
      return style; // Return early to override other styles during animation
    } else {
      style += "hover:scale-105 active:scale-95 ";
    }
    
    // Default text color
    style += "text-gray-700 dark:text-gray-200 font-medium ";

    // Phase coloring
    if (phase === CyclePhase.PERIOD) {
      style += "bg-rose-100 dark:bg-rose-900/30 ";
    } else if (phase === CyclePhase.FERTILE) {
      style += "bg-amber-100 dark:bg-amber-900/30 ";
    } else if (phase === CyclePhase.OVULATION) {
      style += "bg-indigo-100 dark:bg-indigo-900/30 ";
    } else {
      style += "bg-emerald-50 dark:bg-emerald-900/10 ";
    }

    // Today highlight (Pink ring)
    if (isToday(date)) {
      style += "ring-2 ring-brand-400 dark:ring-brand-500 ring-offset-2 dark:ring-offset-gray-800 ";
    }

    // Selected Period Start highlight (Red filled ring)
    if (isSameDay(date, data.lastPeriodDate)) {
      style += "border-2 border-red-500 dark:border-red-400 font-bold ";
    }

    return style;
  };

  const getDotColor = (phase: CyclePhase) => {
    switch(phase) {
      case CyclePhase.PERIOD: return "bg-rose-600 dark:bg-rose-500";
      case CyclePhase.FERTILE: return "bg-amber-400 dark:bg-amber-500";
      case CyclePhase.OVULATION: return "bg-indigo-600 dark:bg-indigo-500";
      case CyclePhase.SAFE: return "bg-emerald-500 dark:bg-emerald-600";
    }
  }

  const getIntimacyIcon = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const log = data.logs?.[dateKey];
    if (!log?.intimacy) return null;

    if (log.intimacy === 'protected') {
      return <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400 absolute -bottom-1 -right-1" strokeWidth={3} />;
    } else {
      return <Heart className="w-3 h-3 text-rose-500 fill-rose-500 absolute -bottom-1 -right-1" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-brand-900 dark:text-brand-100">
          {data.isPregnant ? 'Pregnancy Calendar' : 'Cycle Calendar'}
        </h2>
        <p className="text-brand-600 dark:text-brand-300 text-sm">
           {data.isPregnant ? 'Track your journey week by week' : 'Track your cycle visually'}
        </p>
        {!data.isPregnant && (
          <p className="text-xs text-brand-400 dark:text-brand-500">Tap any date to set as period start</p>
        )}
      </div>

      <Card className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-3 justify-items-center">
          {calendarDays.map((day, idx) => {
            // If day is not in current month, render empty placeholder
            if (!isSameMonth(day, currentMonth)) {
              return <div key={day.toString()} className="h-10 w-10" />;
            }

            const phase = getPhaseForDate(day, data);
            return (
              <button 
                key={day.toString()} 
                onClick={() => handleDateClick(day)}
                className={getDayStyle(day, phase)}
                disabled={data.isPregnant}
              >
                {format(day, 'd')}
                {/* Status Dot (Only in Cycle Mode) */}
                {!data.isPregnant && (!animatingDate || !isSameDay(day, animatingDate)) && (
                   <span className={`absolute top-1 right-1 h-2 w-2 rounded-full ${getDotColor(phase)}`} />
                )}
                {/* Due Date Icon */}
                {data.isPregnant && dueDate && isSameDay(day, dueDate) && (
                   <Baby className="w-3 h-3 text-white absolute -bottom-1 -right-1" />
                )}
                {/* Intimacy Icon */}
                {getIntimacyIcon(day)}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Legend</h3>
        {data.isPregnant ? (
          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Due Date</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Period Days</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Fertile Window</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Ovulation Day</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Safe Days</span>
            </div>
             <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Unprotected</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Protected</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CalendarView;