import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@shared/schema";

export default function BlogSection() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const { toast } = useToast();

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const addBlogMutation = useMutation({
    mutationFn: async (blogData: { title: string; content: string; author?: string }) => {
      const response = await apiRequest("POST", "/api/blog", blogData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setNewTitle("");
      setNewContent("");
      setNewAuthor("");
      setShowAddForm(false);
      toast({
        title: "Blog post published!",
        description: "Your blog post has been shared successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    
    addBlogMutation.mutate({
      title: newTitle.trim(),
      content: newContent.trim(),
      author: newAuthor.trim() || undefined,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <section id="blog" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Blog</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Blog</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read inspiring stories and share your own mental health journey.
          </p>
        </div>
        
        {/* Add Blog Post Button */}
        <div className="max-w-4xl mx-auto mb-8">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-add-blog"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showAddForm ? 'Cancel' : 'Write New Post'}
          </Button>
        </div>
        
        {/* Add Blog Form */}
        {showAddForm && (
          <div className="max-w-4xl mx-auto mb-12">
            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-card-foreground">Write New Blog Post</h4>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBlog} className="space-y-4">
                  <div>
                    <Label htmlFor="blog-title" className="block text-sm font-medium text-card-foreground mb-2">
                      Title
                    </Label>
                    <Input 
                      id="blog-title"
                      type="text" 
                      placeholder="Enter your blog post title..." 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      data-testid="input-blog-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-content" className="block text-sm font-medium text-card-foreground mb-2">
                      Content
                    </Label>
                    <Textarea 
                      id="blog-content"
                      placeholder="Share your story, thoughts, or advice..." 
                      className="resize-none"
                      rows={6}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      data-testid="textarea-blog-content"
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-author" className="block text-sm font-medium text-card-foreground mb-2">
                      Author (optional)
                    </Label>
                    <Input 
                      id="blog-author"
                      type="text" 
                      placeholder="Your name or leave blank for 'Anonymous'" 
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      data-testid="input-blog-author"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!newTitle.trim() || !newContent.trim() || addBlogMutation.isPending}
                    data-testid="button-publish-blog"
                  >
                    {addBlogMutation.isPending ? "Publishing..." : "Publish Post"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Blog Posts */}
        <div className="max-w-4xl mx-auto space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow" data-testid={`blog-post-${post.id}`}>
              <CardContent className="pt-6">
                <h4 className="text-xl font-bold text-card-foreground mb-3" data-testid={`text-blog-title-${post.id}`}>
                  {post.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.createdAt!.toString())}
                  </span>
                </div>
                <div 
                  className="text-card-foreground leading-relaxed whitespace-pre-line"
                  data-testid={`text-blog-content-${post.id}`}
                >
                  {post.content}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {blogPosts.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No blog posts yet. Be the first to share your story!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}