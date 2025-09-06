import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Brain, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    category: 'stress' | 'anxiety' | 'depression' | 'physical' | 'social';
  }[];
}

const copingToolsByCategory = {
  stress: ['Take 5 or more deep breaths', 'Take a walk', 'Journal your feelings', 'Exercise'],
  anxiety: ['Look around your room and count things', 'Take 5 or more deep breaths', 'Talk to a friend', 'Hug a loved one'],
  depression: ['Exercise', 'Talk to a friend', 'Write 5 positive things about yourself', 'Plan a sleepover'],
  physical: ['Take a walk', 'Exercise', 'Bike outside', 'Hug a loved one'],
  social: ['Talk to a friend', 'Plan a sleepover', 'Hug a loved one', 'Play a board game']
};

const questions: Question[] = [
  {
    id: 1,
    question: "How do you typically feel when facing a challenging situation?",
    options: [
      { text: "My heart races and I feel overwhelmed", category: 'anxiety' },
      { text: "I feel physically tense and restless", category: 'stress' },
      { text: "I feel hopeless and want to withdraw", category: 'depression' },
      { text: "I prefer to handle it alone", category: 'physical' }
    ]
  },
  {
    id: 2,
    question: "What time of day do you struggle the most?",
    options: [
      { text: "Late at night when trying to sleep", category: 'anxiety' },
      { text: "During busy, high-pressure moments", category: 'stress' },
      { text: "In the morning, getting started", category: 'depression' },
      { text: "When I'm around lots of people", category: 'social' }
    ]
  },
  {
    id: 3,
    question: "Which of these best describes your energy levels lately?",
    options: [
      { text: "High but scattered, hard to focus", category: 'anxiety' },
      { text: "Constantly drained from overthinking", category: 'stress' },
      { text: "Very low, everything feels difficult", category: 'depression' },
      { text: "Fine mentally, but physically exhausted", category: 'physical' }
    ]
  },
  {
    id: 4,
    question: "How do you prefer to spend your free time?",
    options: [
      { text: "Somewhere quiet and safe", category: 'anxiety' },
      { text: "Doing something productive to stay busy", category: 'stress' },
      { text: "Alone, away from others", category: 'depression' },
      { text: "With close friends or family", category: 'social' }
    ]
  },
  {
    id: 5,
    question: "What would help you feel better right now?",
    options: [
      { text: "Feeling more calm and centered", category: 'anxiety' },
      { text: "Having less on my plate", category: 'stress' },
      { text: "Feeling more positive about myself", category: 'depression' },
      { text: "Having someone to talk to", category: 'social' }
    ]
  }
];

export default function QuizzesSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [recommendedTool, setRecommendedTool] = useState<string>('');
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setRecommendedTool('');
  };

  const handleAnswer = (category: string) => {
    const newAnswers = [...answers, category];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const categoryCount: Record<string, number> = {};
      newAnswers.forEach(answer => {
        categoryCount[answer] = (categoryCount[answer] || 0) + 1;
      });

      // Find most common category
      const dominantCategory = Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b
      ) as keyof typeof copingToolsByCategory;

      // Pick random tool from that category
      const tools = copingToolsByCategory[dominantCategory];
      const randomTool = tools[Math.floor(Math.random() * tools.length)];
      setRecommendedTool(randomTool);
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setRecommendedTool('');
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <section id="quizzes" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Coping Tool Quiz</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take our personalized quiz to discover which coping tools might work best for you based on how you're feeling.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!quizStarted && !showResult && (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold text-card-foreground mb-4">
                  Discover Your Perfect Coping Tool
                </h4>
                <p className="text-muted-foreground mb-6">
                  Answer 5 quick questions and we'll recommend a coping strategy that's tailored to how you're feeling right now.
                </p>
                <Button 
                  onClick={startQuiz}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-start-quiz"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          )}

          {quizStarted && !showResult && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-card-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </h4>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </CardHeader>
              <CardContent>
                <h5 className="text-lg font-medium text-card-foreground mb-6">
                  {questions[currentQuestion].question}
                </h5>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleAnswer(option.category)}
                      data-testid={`quiz-option-${index}`}
                    >
                      <div className="flex items-center">
                        <ArrowRight className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span>{option.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {showResult && (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-card-foreground mb-4">
                  Your Recommended Coping Tool
                </h4>
                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 mb-6">
                  <p className="text-2xl font-bold text-secondary mb-2" data-testid="text-quiz-result">
                    {recommendedTool}
                  </p>
                  <p className="text-muted-foreground">
                    This coping tool has been selected based on your responses. Give it a try and see how it works for you!
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={resetQuiz}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-retake-quiz"
                  >
                    Take Quiz Again
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <p>Remember: Different tools work for different situations. Feel free to try multiple approaches!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}