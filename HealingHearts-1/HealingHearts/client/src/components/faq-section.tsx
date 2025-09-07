import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FaqQuestion } from "@shared/schema";

export default function FaqSection() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [newQuestion, setNewQuestion] = useState("");
  const { toast } = useToast();

  const { data: faqQuestions = [], isLoading } = useQuery<FaqQuestion[]>({
    queryKey: ["/api/faq"],
  });

  const submitQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/faq", { question });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq"] });
      setNewQuestion("");
      toast({
        title: "Question submitted!",
        description: "Thank you for your question. We'll review it and provide an answer soon.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    submitQuestionMutation.mutate(newQuestion.trim());
  };

  if (isLoading) {
    return (
      <section id="faq" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common mental health questions. Click on any question to expand the answer.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqQuestions.map((item) => (
            <Card 
              key={item.id} 
              className="faq-item h-fit hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleExpanded(item.id)}
              data-testid={`faq-item-${item.id}`}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-semibold text-card-foreground mb-4 text-lg">{item.question}</h4>
                  <div className={`text-muted-foreground text-sm leading-relaxed transition-all duration-300 ${expandedItems.has(item.id) ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    <p className="mb-3">{item.answer}</p>
                    {item.answer.includes("Reachanya@09.gmail.com") && (
                      <div className="bg-secondary/10 border border-secondary/20 p-3 rounded-lg mt-4">
                        <p className="text-secondary font-medium flex items-center justify-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email: Reachanya@09.gmail.com
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Custom Question Form */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold text-card-foreground mb-4">Have a different question?</h4>
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <Textarea 
                  placeholder="Type your question here..." 
                  className="resize-none"
                  rows={3}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  data-testid="textarea-new-question"
                />
                <Button 
                  type="submit" 
                  disabled={!newQuestion.trim() || submitQuestionMutation.isPending}
                  data-testid="button-submit-question"
                >
                  {submitQuestionMutation.isPending ? "Submitting..." : "Submit Question"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
