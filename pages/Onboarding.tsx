import React, { useState } from 'react';
import { Button, Card, Header, Select } from '../components/UIComponents';
import { ArrowRight, Calendar as CalendarIcon, Check } from 'lucide-react';
import { format } from 'date-fns';

interface OnboardingProps {
  onComplete: (date: Date, length: number, periodLength: number) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<string>('');
  const [length, setLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);

  const handleNext = () => {
    if (step === 1 && date) {
      setStep(2);
    } else if (step === 2) {
      // Mock saving to Supabase
      onComplete(new Date(date), length, periodLength);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md p-8 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-100 dark:bg-gray-700">
          <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="mt-4">
          <div className="text-brand-600 dark:text-brand-400 font-semibold text-sm mb-2 uppercase tracking-wider">Step {step} of 2</div>
          
          {step === 1 ? (
            <div className="animate-fade-in">
              <Header 
                title="When did your last period start?" 
                subtitle="This helps us calculate your cycle phases accurately."
              />
              
              <div className="my-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <Button 
                fullWidth 
                onClick={handleNext} 
                disabled={!date}
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
             <div className="animate-fade-in">
              <Header 
                title="Cycle Details" 
                subtitle="Customize your cycle and period duration."
              />
              
              <div className="my-8 space-y-5">
                <Select 
                  value={length} 
                  onChange={(e) => setLength(Number(e.target.value))}
                  label="Average Cycle Length"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 21).map((day) => (
                    <option key={day} value={day}>{day} days</option>
                  ))}
                </Select>

                <Select 
                  value={periodLength} 
                  onChange={(e) => setPeriodLength(Number(e.target.value))}
                  label="Period Duration"
                >
                  {Array.from({ length: 8 }, (_, i) => i + 2).map((day) => (
                    <option key={day} value={day}>{day} days</option>
                  ))}
                </Select>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Standard cycles are 28 days with a 5-day period. Adjust these if yours differ.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button fullWidth onClick={handleNext}>
                  Complete Setup <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;