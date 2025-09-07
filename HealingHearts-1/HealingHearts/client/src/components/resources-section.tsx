import { Phone, MessageCircle, Heart, Shield, Users, Globe, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ResourcesSection() {
  const resources = [
    {
      icon: Phone,
      title: "Suicide Crisis Lifeline",
      number: "988",
      description: "Available 24/7 for crisis support and suicide prevention",
      color: "destructive",
    },
    {
      icon: MessageCircle,
      title: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis support via text message",
      color: "accent",
    },
    {
      icon: Heart,
      title: "Eating Disorder Helpline",
      number: "866-662-1235",
      description: "National Eating Disorders Association helpline",
      color: "primary",
    },
    {
      icon: Shield,
      title: "LGBTQ+ Support",
      number: "1-866-488-7386",
      description: "The Trevor Project crisis support for LGBTQ+ youth",
      color: "secondary",
    },
    {
      icon: Users,
      title: "SAMHSA Helpline",
      number: "1-800-662-4357",
      description: "Substance abuse and mental health services",
      color: "muted",
    },
  ];

  return (
    <section id="resources" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Crisis Resources & Help</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            If you're in crisis or need immediate help, these resources are available 24/7.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            const colorClasses = {
              destructive: "bg-destructive/10 border-destructive/20 text-destructive",
              accent: "bg-accent/10 border-accent/20 text-accent-foreground",
              primary: "bg-primary/10 border-primary/20 text-primary",
              secondary: "bg-secondary/10 border-secondary/20 text-secondary",
              muted: "bg-muted border-border text-foreground",
            };

            return (
              <Card 
                key={index} 
                className={colorClasses[resource.color as keyof typeof colorClasses]}
                data-testid={`resource-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`w-12 h-12 ${
                      resource.color === 'destructive' ? 'bg-destructive' :
                      resource.color === 'accent' ? 'bg-accent' :
                      resource.color === 'primary' ? 'bg-primary' :
                      resource.color === 'secondary' ? 'bg-secondary' :
                      'bg-muted-foreground'
                    } rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2" data-testid={`text-resource-title-${index}`}>
                      {resource.title}
                    </h4>
                    <p className="text-2xl font-bold mb-2" data-testid={`text-resource-number-${index}`}>
                      {resource.number}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-resource-description-${index}`}>
                      {resource.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Online Resources Card */}
          <Card data-testid="resource-card-online">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-card-foreground mb-2">Online Resources</h4>
                <div className="space-y-2 text-sm">
                  <a 
                    href="https://www.mentalhealth.gov" 
                    className="block text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-mentalhealth-gov"
                  >
                    MentalHealth.gov
                  </a>
                  <a 
                    href="https://www.nami.org" 
                    className="block text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-nami-org"
                  >
                    NAMI.org
                  </a>
                  <a 
                    href="https://www.crisistextline.org" 
                    className="block text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-crisis-text-line"
                  >
                    Crisis Text Line
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Emergency Notice */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="text-destructive text-2xl mb-4 mx-auto" />
              <h4 className="text-lg font-semibold text-destructive mb-2">Emergency Situations</h4>
              <p className="text-muted-foreground">
                If you or someone you know is in immediate danger, please call 911 or go to your nearest emergency room.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
