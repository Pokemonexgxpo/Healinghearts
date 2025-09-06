import Header from "@/components/header";
import FaqSection from "@/components/faq-section";
import BlogSection from "@/components/blog-section";
import GamesSection from "@/components/games-section";
import QuizzesSection from "@/components/quizzes-section";
import QuotesSection from "@/components/quotes-section";
import ChatSection from "@/components/chat-section";
import ResourcesSection from "@/components/resources-section";
import Footer from "@/components/footer";
import { useAdmin } from "@/hooks/use-admin";

export default function Home() {
  const { isAdmin } = useAdmin();
  
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg py-16 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-primary-foreground">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">You're Not Alone</h2>
            <p className="text-xl mb-8 opacity-90">
              A safe space for mental health support, coping tools, and community connection. 
              Your wellbeing matters, and help is always available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#faq" 
                className="bg-card text-card-foreground px-6 py-3 rounded-lg font-medium hover:bg-card/90 transition-colors"
                data-testid="button-get-support"
              >
                Get Support Now
              </a>
              <a 
                href="#resources" 
                className="border border-primary-foreground/30 text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
                data-testid="button-crisis-resources"
              >
                Crisis Resources
              </a>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
      {isAdmin && <BlogSection />}
      <GamesSection />
      <QuizzesSection />
      <QuotesSection />
      <ChatSection />
      <ResourcesSection />
      <Footer />
    </div>
  );
}
