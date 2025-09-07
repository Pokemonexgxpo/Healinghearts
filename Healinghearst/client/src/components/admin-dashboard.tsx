import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Video, FileText, CheckCircle, Clock, Check } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [blogForm, setBlogForm] = useState({ title: '', content: '', author: '' });
  const [videoForm, setVideoForm] = useState({ title: '', url: '', description: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending quotes for approval
  const { data: pendingQuotes = [] } = useQuery({
    queryKey: ['/api/quotes/pending'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/quotes/pending');
      return response.json();
    },
  });

  const approveQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const response = await apiRequest('POST', `/api/quotes/${quoteId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setSuccessMessage('Quote approved successfully!');
    },
    onError: () => {
      setError('Failed to approve quote. Please try again.');
    },
  });

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogForm),
      });

      if (response.ok) {
        setBlogForm({ title: '', content: '', author: '' });
        setSuccessMessage('Blog post created successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create blog post');
      }
    } catch (err) {
      setError('Failed to create blog post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoForm),
      });

      if (response.ok) {
        setVideoForm({ title: '', url: '', description: '' });
        setSuccessMessage('Video added successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add video');
      }
    } catch (err) {
      setError('Failed to add video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Admin Dashboard</h2>
              <p className="text-muted-foreground">Manage your content and videos</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

      {successMessage && (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Quote Approvals
            {pendingQuotes.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingQuotes.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Quote Approvals
              </CardTitle>
              <CardDescription>
                Review and approve user-submitted quotes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingQuotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending quotes to review.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingQuotes.map((quote: any) => (
                    <Card key={quote.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <blockquote className="text-lg font-medium mb-2">
                              "{quote.content}"
                            </blockquote>
                            <p className="text-sm text-muted-foreground">
                              - {quote.author}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => approveQuoteMutation.mutate(quote.id)}
                            disabled={approveQuoteMutation.isPending}
                            className="ml-4"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {approveQuoteMutation.isPending ? 'Approving...' : 'Approve'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create New Blog Post
              </CardTitle>
              <CardDescription>
                Write inspiring content for mental health support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-title">Title</Label>
                  <Input
                    id="blog-title"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="Enter blog post title"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blog-author">Author (optional)</Label>
                  <Input
                    id="blog-author"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    placeholder="Your name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blog-content">Content</Label>
                  <Textarea
                    id="blog-content"
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="Write your blog content here..."
                    rows={8}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !blogForm.title || !blogForm.content}
                  className="w-full"
                >
                  {isLoading ? 'Creating...' : 'Create Blog Post'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Add New Video
              </CardTitle>
              <CardDescription>
                Share helpful videos for mental health support. Use YouTube, Vimeo, or other video platform URLs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-title">Title</Label>
                  <Input
                    id="video-title"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    placeholder="Enter video title"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video-url">Video URL</Label>
                  <Input
                    id="video-url"
                    value={videoForm.url}
                    onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supports YouTube, Vimeo, and other video platforms
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video-description">Description (optional)</Label>
                  <Textarea
                    id="video-description"
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    placeholder="Brief description of the video..."
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !videoForm.title || !videoForm.url}
                  className="w-full"
                >
                  {isLoading ? 'Adding...' : 'Add Video'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
}