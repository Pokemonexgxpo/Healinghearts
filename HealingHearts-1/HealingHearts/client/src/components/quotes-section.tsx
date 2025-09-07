import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Quote as QuoteType } from "@shared/schema";

export default function QuotesSection() {
  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const { toast } = useToast();

  const { data: quotes = [], isLoading } = useQuery<QuoteType[]>({
    queryKey: ["/api/quotes"],
  });

  const addQuoteMutation = useMutation({
    mutationFn: async (quoteData: { content: string; author?: string }) => {
      const response = await apiRequest("POST", "/api/quotes", quoteData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      setNewQuote("");
      setNewAuthor("");
      toast({
        title: "Quote submitted!",
        description: "Your quote is pending admin approval before it appears on the site.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim()) return;
    
    addQuoteMutation.mutate({
      content: newQuote.trim(),
      author: newAuthor.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <section id="quotes" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Inspirational Quotes</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quotes" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Inspirational Quotes</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find inspiration in these mental health quotes, or share your own words of encouragement.
          </p>
        </div>
        
        {/* Quote Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow" data-testid={`quote-card-${quote.id}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Quote className="text-primary text-2xl mb-4 mx-auto" />
                  <p className="text-card-foreground font-medium mb-4" data-testid={`text-quote-content-${quote.id}`}>
                    "{quote.content}"
                  </p>
                  <p className="text-muted-foreground text-sm" data-testid={`text-quote-author-${quote.id}`}>
                    - {quote.author}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Add Quote Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold text-card-foreground mb-4">Share Your Inspirational Quote</h4>
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <Label htmlFor="quote-content" className="block text-sm font-medium text-card-foreground mb-2">
                    Quote
                  </Label>
                  <Textarea 
                    id="quote-content"
                    placeholder="Enter your inspirational quote..." 
                    className="resize-none"
                    rows={3}
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    data-testid="textarea-new-quote"
                  />
                </div>
                <div>
                  <Label htmlFor="quote-author" className="block text-sm font-medium text-card-foreground mb-2">
                    Author (optional)
                  </Label>
                  <Input 
                    id="quote-author"
                    type="text" 
                    placeholder="Author name or leave blank for 'Unknown'" 
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    data-testid="input-quote-author"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!newQuote.trim() || addQuoteMutation.isPending}
                  data-testid="button-submit-quote"
                >
                  {addQuoteMutation.isPending ? "Sharing..." : "Share Quote"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
