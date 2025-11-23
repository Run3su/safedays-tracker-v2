import React, { useState } from 'react';
import { Card, Badge, Modal, Button } from '../components/UIComponents';
import { CycleData, CyclePhase } from '../types';
import { getCycleOverview, getPhaseForDate, formatDate, getPregnancyProgress } from '../services/dateUtils';
import { Droplet, Sparkles, Baby, Heart, Shield, Plus, Calendar as CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardProps {
  data: CycleData;
  onLogIntimacy: (date: Date, type: 'protected' | 'unprotected' | null) => void;
}

const PhaseCard: React.FC<{ phase: CyclePhase, description: string, icon: React.ReactNode, subtext: string }> = ({ phase, description, icon, subtext }) => {
  const getStyles = () => {
    switch (phase) {
      case CyclePhase.PERIOD: return "bg-red-50 border-red-100 text-red-900 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-100";
      case CyclePhase.FERTILE: return "bg-amber-50 border-amber-100 text-amber-900 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-100";
      case CyclePhase.OVULATION: return "bg-indigo-50 border-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:border-indigo-900/50 dark:text-indigo-100";
      case CyclePhase.SAFE: return "bg-emerald-50 border-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-100";
    }
  };

  const getEmoji = () => {
    switch(phase) {
      case CyclePhase.PERIOD: return "🔴";
      case CyclePhase.FERTILE: return "🟡";
      case CyclePhase.OVULATION: return "🔵";
      case CyclePhase.SAFE: return "🟢";
    }
  }

  return (
    <div className={`p-6 rounded-2xl border ${getStyles()} flex flex-col items-center text-center shadow-sm`}>
      <div className="text-4xl mb-3 shadow-sm rounded-full p-2 bg-white/50 dark:bg-black/20">{getEmoji()}</div>
      <h2 className="text-lg font-bold mb-1">{description}</h2>
      <p className="text-sm opacity-80">{subtext}</p>
    </div>
  );
};

const PregnancyCard: React.FC<{ progress: any }> = ({ progress }) => {
  return (
    <div className="p-6 rounded-2xl border bg-purple-50 border-purple-100 text-purple-900 dark:bg-purple-900/20 dark:border-purple-900/50 dark:text-purple-100 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
       {/* Decorative Background blob */}
       <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl opacity-50"></div>
       <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-3xl opacity-50"></div>

      <div className="text-4xl mb-3 shadow-sm rounded-full p-3 bg-white/60 dark:bg-black/20 z-10">🤰</div>
      <h2 className="text-3xl font-bold mb-1 z-10">{progress.weeks} Weeks</h2>
      <p className="text-lg opacity-90 z-10 font-medium">+ {progress.days} Days</p>
      
      <div className="mt-4 w-full bg-white/50 dark:bg-black/30 rounded-full h-2.5 z-10">
        <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress.progressPercent}%` }}></div>
      </div>
      <p className="text-xs mt-2 opacity-70 z-10">Trimester {progress.trimester} • {progress.daysLeft} days to go</p>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ data, onLogIntimacy }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const today = new Date();
  const dateKey = format(today, 'yyyy-MM-dd');
  const currentLog = data.logs?.[dateKey]?.intimacy;

  // --- PREGNANCY MODE RENDER ---
  if (data.isPregnant && data.pregnancyStart) {
    const progress = getPregnancyProgress(data.pregnancyStart);

    return (
      <div className="space-y-6 pb-20 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pregnancy</h1>
          <span className="text-gray-500 dark:text-gray-400 font-medium">{formatDate(today, 'EEEE, MMM d')}</span>
        </div>

        {/* Main Pregnancy Status */}
        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <PregnancyCard progress={progress} />
        </Card>

        {/* Due Date Info */}
        <Card className="p-5 border-purple-100 dark:border-purple-900/50">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                <CalendarIcon className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Due Date</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatDate(progress.dueDate, 'MMMM d, yyyy')}</p>
             </div>
          </div>
        </Card>

        {/* Weekly Tips / Info (Mock data based on trimester) */}
        <Card className="p-5 border-purple-100 dark:border-purple-900/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-500" /> 
              Trimester {progress.trimester} Tips
            </h3>
          </div>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {progress.trimester === 1 && (
              <p>Your baby is developing rapidly. It's crucial to take prenatal vitamins with folic acid. You might experience morning sickness and fatigue.</p>
            )}
            {progress.trimester === 2 && (
              <p>Often called the "honeymoon phase". You might feel the baby move for the first time! Energy levels typically increase.</p>
            )}
            {progress.trimester === 3 && (
              <p>You're in the home stretch! The baby is gaining weight. Rest often and pack your hospital bag.</p>
            )}
          </div>
        </Card>

        {/* Legend for Pregnancy */}
         <div className="text-center text-xs text-purple-400 mt-4">
          <p>Tracking enabled. Switch to cycle mode in Settings.</p>
        </div>
      </div>
    );
  }

  // --- CYCLE MODE RENDER ---
  const currentPhase = getPhaseForDate(today, data);
  const overview = getCycleOverview(data);
  const info = ((phase: CyclePhase) => {
    switch (phase) {
      case CyclePhase.PERIOD: return { title: "Period", sub: "Menstruation phase", desc: "Take it easy today." };
      case CyclePhase.FERTILE: return { title: "Fertile", sub: "High chance of pregnancy", desc: "You are in your fertile window." };
      case CyclePhase.OVULATION: return { title: "Ovulation", sub: "Egg release day", desc: "Peak fertility today." };
      case CyclePhase.SAFE: return { title: "Safe", sub: "Lower chance of pregnancy", desc: "You are in a safe period." };
    }
  })(currentPhase);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today</h1>
        <span className="text-gray-500 dark:text-gray-400 font-medium">{formatDate(today, 'EEEE, MMM d')}</span>
      </div>

      {/* Main Status Card */}
      <Card className="overflow-hidden">
        <PhaseCard 
          phase={currentPhase}
          description={`You're in your ${info.title} phase`}
          subtext={info.desc}
          icon={null}
        />
      </Card>

      {/* Intimacy Tracking Card */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500/10" />
            <h3 className="font-bold text-gray-900 dark:text-white">Daily Log</h3>
          </div>
          {currentLog && (
             <Badge color="pink">{currentLog === 'protected' ? 'Protected' : 'Unprotected'}</Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {currentLog 
            ? "Activity logged for today. Tap to edit." 
            : "Track intimacy to monitor your fertility and conception attempts."}
        </p>

        <Button 
          variant={currentLog ? "outline" : "primary"} 
          fullWidth 
          onClick={() => setShowLogModal(true)}
          className="text-sm py-2"
        >
          {currentLog ? 'Edit Log' : 'Log Activity'}
          {!currentLog && <Plus className="w-4 h-4 ml-1" />}
        </Button>

        {currentLog === 'unprotected' && (currentPhase === CyclePhase.FERTILE || currentPhase === CyclePhase.OVULATION) && (
          <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/50 rounded-xl text-xs text-pink-800 dark:text-pink-200 flex items-start gap-2">
            <Baby className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Unprotected intimacy during your fertile window significantly increases chances of conception.</span>
          </div>
        )}
      </Card>

      {/* Cycle Overview */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Cycle Overview</h3>
        </div>
        
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Next Period</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{overview.daysUntilPeriod} days left</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(overview.nextPeriod)}</p>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">Expected</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-700" />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Ovulation</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {overview.isOvulationPassed ? 'Passed' : `in ${overview.daysUntilOvulation} days`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(overview.ovulation)}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-700" />

          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Fertile Window</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">High chance</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(overview.fertileStart, 'MMM d')} - {formatDate(overview.fertileEnd, 'MMM d')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">What do the colors mean?</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge color="red">Period</Badge>
            <span className="text-sm text-gray-600 dark:text-gray-300">Menstruation phase</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="yellow">Fertile</Badge>
            <span className="text-sm text-gray-600 dark:text-gray-300">High chance of pregnancy</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="blue">Ovulation</Badge>
            <span className="text-sm text-gray-600 dark:text-gray-300">Egg release day</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="green">Safe Days</Badge>
            <span className="text-sm text-gray-600 dark:text-gray-300">Lower chance of pregnancy</span>
          </div>
        </div>
      </Card>

      {/* Log Modal */}
      <Modal 
        isOpen={showLogModal} 
        onClose={() => setShowLogModal(false)}
        title="Log Activity"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Did you have intimate relations today? Logging this helps track fertility awareness.</p>
          
          <button 
            onClick={() => { onLogIntimacy(today, 'protected'); setShowLogModal(false); }}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${currentLog === 'protected' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-800'}`}
          >
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white">Protected</p>
              <p className="text-xs text-gray-500">Contraception used</p>
            </div>
          </button>

          <button 
            onClick={() => { onLogIntimacy(today, 'unprotected'); setShowLogModal(false); }}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${currentLog === 'unprotected' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-800'}`}
          >
             <div className="p-2 bg-rose-100 text-rose-600 rounded-full dark:bg-rose-900/30 dark:text-rose-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white">Unprotected</p>
              <p className="text-xs text-gray-500">Natural / No contraception</p>
            </div>
          </button>

           <button 
            onClick={() => { onLogIntimacy(today, null); setShowLogModal(false); }}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Clear Log
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;