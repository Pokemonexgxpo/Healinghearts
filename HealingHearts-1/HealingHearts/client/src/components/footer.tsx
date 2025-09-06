import { Heart, Info, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-card-foreground mb-4">Get in Touch</h4>
            <p className="text-muted-foreground mb-2">
              Have questions or need support? Email us at:
            </p>
            <a 
              href="mailto:Reachanya@09.gmail.com" 
              className="text-primary hover:underline font-medium flex items-center justify-center gap-2"
              data-testid="link-contact-email"
            >
              <Mail className="h-4 w-4" />
              Reachanya@09.gmail.com
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              I will try to get to all emails in the time I can, but I could be busy from school and stuff.
            </p>
          </div>
          
          {/* Important Disclaimer */}
          <div className="max-w-3xl mx-auto">
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-accent-foreground mb-3 flex items-center justify-center gap-2">
                  <Info className="h-5 w-5" />
                  Important Disclaimer
                </h4>
                <p className="text-accent-foreground/80 text-sm leading-relaxed">
                  This website is NOT a substitute for professional mental health care. If you are seriously suffering or in crisis, 
                  please seek professional help immediately. This is just a tool to help people connect and find basic support resources. 
                  Always consult with qualified mental health professionals for proper diagnosis and treatment.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Site Info */}
          <div className="border-t border-border pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">HealingHearts</span>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">
                  Created with ❤️ by JB Poetry
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supporting mental health, one conversation at a time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
