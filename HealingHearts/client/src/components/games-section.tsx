import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RotateCcw, Loader2, Gamepad2, Trophy } from "lucide-react";

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

export default function GamesSection() {
  const [activeGame, setActiveGame] = useState<'wheel' | 'cups' | null>(null);
  
  // Wheel game state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  // Cup game state
  const [isShuffling, setIsShuffling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCup, setSelectedCup] = useState<number | null>(null);
  const [correctCup, setCorrectCup] = useState<number>(1);
  const [cupResult, setCupResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const spinWheel = () => {
    setIsSpinning(true);
    setWheelResult(null);
    
    setTimeout(() => {
      const randomTool = copingTools[Math.floor(Math.random() * copingTools.length)];
      setWheelResult(randomTool);
      setIsSpinning(false);
    }, 3000);
  };

  const startCupGame = () => {
    setGameStarted(false);
    setSelectedCup(null);
    setCupResult(null);
    setShowResult(false);
    setIsShuffling(true);
    
    // Set random correct cup and coping tool
    const randomCup = Math.floor(Math.random() * 3) + 1;
    const randomTool = copingTools[Math.floor(Math.random() * copingTools.length)];
    setCorrectCup(randomCup);
    setCupResult(randomTool);
    
    setTimeout(() => {
      setIsShuffling(false);
      setGameStarted(true);
    }, 2000);
  };

  const selectCup = (cupNumber: number) => {
    if (!gameStarted || selectedCup !== null) return;
    setSelectedCup(cupNumber);
    setShowResult(true);
  };

  const resetCupGame = () => {
    setGameStarted(false);
    setSelectedCup(null);
    setCupResult(null);
    setShowResult(false);
    setIsShuffling(false);
  };

  return (
    <section id="games" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Coping Games</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Play fun games to discover new coping strategies! Choose a game below to get started.
          </p>
        </div>

        {!activeGame && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Spinning Wheel Game */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveGame('wheel')}>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold text-card-foreground mb-2">Spinning Wheel</h4>
                <p className="text-muted-foreground mb-4">
                  Spin the colorful wheel to get a random coping tool suggestion.
                </p>
                <Button data-testid="button-play-wheel">Play Spinning Wheel</Button>
              </CardContent>
            </Card>

            {/* Cup Game */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveGame('cups')}>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h4 className="text-xl font-semibold text-card-foreground mb-2">Find the Coping Tool</h4>
                <p className="text-muted-foreground mb-4">
                  Follow the cups and find where the coping tool is hidden!
                </p>
                <Button data-testid="button-play-cups">Play Cup Game</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Spinning Wheel Game */}
        {activeGame === 'wheel' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold text-card-foreground">Spinning Wheel Game</h4>
                  <Button variant="outline" onClick={() => setActiveGame(null)}>Back</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-8">
                  <div className="wheel-container relative mx-auto w-80 h-80">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
                    </div>
                    
                    {/* Wheel */}
                    <div 
                      className={`wheel w-80 h-80 border-8 border-primary rounded-full relative shadow-lg ${isSpinning ? 'spinning' : ''}`}
                      data-testid="coping-wheel-game"
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
                    data-testid="button-spin-wheel-game"
                  >
                    {isSpinning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Spinning...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {wheelResult ? 'Spin Again' : 'Spin the Wheel'}
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Result Display */}
                {wheelResult && (
                  <div className="mt-8" data-testid="wheel-game-result">
                    <Card className="bg-secondary/10 border-secondary/20">
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold text-card-foreground mb-2">Your Coping Tool:</h4>
                        <p className="text-2xl font-bold text-secondary" data-testid="text-selected-tool-game">{wheelResult}</p>
                        <p className="text-muted-foreground mt-2">Give this a try and see how you feel!</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cup Game */}
        {activeGame === 'cups' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold text-card-foreground">Find the Coping Tool</h4>
                  <Button variant="outline" onClick={() => setActiveGame(null)}>Back</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">
                  Watch the cups shuffle, then click on the cup you think contains the coping tool!
                </p>
                
                {!gameStarted && !isShuffling && (
                  <Button 
                    onClick={startCupGame}
                    className="mb-8"
                    data-testid="button-start-cup-game"
                  >
                    Start Game
                  </Button>
                )}

                {isShuffling && (
                  <div className="mb-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Shuffling cups...</p>
                  </div>
                )}

                <div className="flex justify-center space-x-8 mb-8">
                  {[1, 2, 3].map((cupNumber) => (
                    <div
                      key={cupNumber}
                      className={`cup relative cursor-pointer transition-transform ${
                        isShuffling ? 'animate-pulse' : ''
                      } ${
                        gameStarted && selectedCup === null ? 'hover:scale-110' : ''
                      }`}
                      onClick={() => selectCup(cupNumber)}
                      data-testid={`cup-${cupNumber}`}
                    >
                      <div 
                        className={`w-20 h-24 ${
                          selectedCup === cupNumber 
                            ? correctCup === cupNumber 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                            : 'bg-amber-600'
                        } rounded-b-full relative shadow-lg`}
                      >
                        {/* Cup Handle */}
                        <div className="absolute -right-2 top-4 w-3 h-6 border-2 border-amber-600 rounded-r-full"></div>
                        
                        {/* Show coping tool if this is the correct cup and game is revealed */}
                        {showResult && correctCup === cupNumber && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg border">
                            <Trophy className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
                            <span className="text-xs font-semibold text-center block">{cupResult}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {showResult && (
                  <div className="space-y-4" data-testid="cup-game-result">
                    <Card className={selectedCup === correctCup ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold mb-2">
                          {selectedCup === correctCup ? "Congratulations!" : "Good Try!"}
                        </h4>
                        <p className="text-muted-foreground mb-2">
                          {selectedCup === correctCup 
                            ? "You found the coping tool!" 
                            : `The coping tool was under cup ${correctCup}.`
                          }
                        </p>
                        <p className="text-xl font-bold text-primary mb-4" data-testid="text-cup-result">
                          {cupResult}
                        </p>
                        <Button 
                          onClick={resetCupGame}
                          data-testid="button-play-again-cups"
                        >
                          Play Again
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {gameStarted && !showResult && (
                  <p className="text-muted-foreground">
                    Click on a cup to reveal what's underneath!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}