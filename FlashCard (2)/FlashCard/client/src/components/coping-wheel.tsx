import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Loader2 } from "lucide-react";

const copingTools = [
  'Take a walk',
  'Take 5 or more deep breaths',
  'Look around your room and count things',
  'Journal your feelings',
  'Hug a loved one',
  'Bike outside',
  'Exercise',
  'Talk to a friend',
  'Write 5 positive things about yourself',
  'Play a board game',
  'Plan a sleepover',
  'Make a craft'
];

export default function CopingWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const spinWheel = () => {
    setIsSpinning(true);
    setSelectedTool(null);
    
    setTimeout(() => {
      const randomTool = copingTools[Math.floor(Math.random() * copingTools.length)];
      setSelectedTool(randomTool);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <section id="coping-wheel" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Coping Tools Wheel</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not sure what coping strategy to try? Spin the wheel for a random suggestion!
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          {/* Wheel Container */}
          <div className="relative mb-8">
            <div className="wheel-container relative mx-auto w-80 h-80">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
              </div>
              
              {/* Wheel */}
              <div 
                className={`wheel w-80 h-80 border-8 border-primary rounded-full relative shadow-lg ${isSpinning ? 'spinning' : ''}`}
                data-testid="coping-wheel"
              >
                {/* Wheel segments with gradient background */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(
                    from 0deg,
                    hsl(262.1, 83.3%, 57.8%) 0deg 30deg,
                    hsl(158.1, 64.4%, 51.6%) 30deg 60deg,
                    hsl(43.2, 96.4%, 56.3%) 60deg 90deg,
                    hsl(0, 84.2%, 60.2%) 90deg 120deg,
                    hsl(270, 95%, 60%) 120deg 150deg,
                    hsl(120, 60%, 50%) 150deg 180deg,
                    hsl(30, 100%, 50%) 180deg 210deg,
                    hsl(200, 80%, 50%) 210deg 240deg,
                    hsl(300, 70%, 60%) 240deg 270deg,
                    hsl(60, 80%, 50%) 270deg 300deg,
                    hsl(330, 70%, 60%) 300deg 330deg,
                    hsl(180, 60%, 50%) 330deg 360deg
                  )`
                }}>
                </div>
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-primary font-bold text-xs text-center">Coping Tools</span>
                </div>
              </div>
            </div>
            
            {/* Spin Button */}
            <Button 
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
              data-testid="button-spin-wheel"
            >
              {isSpinning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {selectedTool ? 'Spin Again' : 'Spin the Wheel'}
                </>
              )}
            </Button>
          </div>
          
          {/* Result Display */}
          {selectedTool && (
            <div className="mt-8" data-testid="wheel-result">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">Your Coping Tool:</h4>
                  <p className="text-2xl font-bold text-primary" data-testid="text-selected-tool">{selectedTool}</p>
                  <p className="text-muted-foreground mt-2">Give this a try and see how you feel!</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
