import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Send, Info, Video, VideoOff, Mic, MicOff, PhoneOff, Phone } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import type { ChatMessage } from "@shared/schema";

export default function ChatSection() {
  const [messageText, setMessageText] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Video chat states
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnectedToPartner, setIsConnectedToPartner] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  
  const { 
    messages, 
    userCount, 
    isConnected, 
    sendMessage 
  } = useWebSocket();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Generate random username if not set
    if (!username) {
      const adjectives = ['Kind', 'Supportive', 'Caring', 'Helpful', 'Gentle', 'Understanding'];
      const nouns = ['Friend', 'Person', 'Soul', 'Heart', 'Helper', 'Listener'];
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      setUsername(`${randomAdjective} ${randomNoun}`);
    }
  }, [username]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !isConnected) return;
    
    sendMessage(username, messageText.trim());
    setMessageText("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getAvatarColor = (username: string) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-destructive', 'bg-muted-foreground'];
    const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Video chat functions
  const startVideoChat = async () => {
    try {
      setIsSearching(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      localStreamRef.current = stream;
      setIsVideoActive(true);
      setIsAudioActive(true);
      
      // Simulate finding a partner (in a real app, this would use WebRTC signaling)
      setTimeout(() => {
        setIsSearching(false);
        setIsConnectedToPartner(true);
      }, 2000);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsSearching(false);
    }
  };

  const stopVideoChat = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    setIsVideoActive(false);
    setIsAudioActive(false);
    setIsSearching(false);
    setIsConnectedToPartner(false);
    localStreamRef.current = null;
    peerConnectionRef.current = null;
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoActive(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioActive(audioTrack.enabled);
      }
    }
  };

  const nextPartner = () => {
    setIsSearching(true);
    setIsConnectedToPartner(false);
    
    // Simulate finding new partner
    setTimeout(() => {
      setIsSearching(false);
      setIsConnectedToPartner(true);
    }, 1500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVideoChat();
    };
  }, []);

  return (
    <section id="chat" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Peer Support Chat</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with others who understand what you're going through. Remember to be kind and supportive.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Chat Guidelines */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Chat Guidelines
            </h4>
            <ul className="text-sm text-accent-foreground/80 space-y-1">
              <li>• Be kind, respectful, and supportive</li>
              <li>• No sharing of personal information</li>
              <li>• Report inappropriate behavior</li>
              <li>• This is not a substitute for professional help</li>
            </ul>
          </div>
          
          <Tabs defaultValue="text" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Text Chat
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <Card className="overflow-hidden" data-testid="chat-interface">
            {/* Chat Header */}
            <CardHeader className="bg-primary text-primary-foreground px-6 py-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Support Chat Room</span>
                <span 
                  className="bg-primary-foreground/20 px-2 py-1 rounded text-xs"
                  data-testid="text-user-count"
                >
                  {userCount} online
                </span>
                {!isConnected && (
                  <span className="bg-destructive/20 px-2 py-1 rounded text-xs">
                    Disconnected
                  </span>
                )}
              </div>
              <button className="text-primary-foreground/80 hover:text-primary-foreground">
                <Settings className="h-4 w-4" />
              </button>
            </CardHeader>
            
            {/* Chat Messages */}
            <CardContent className="h-96 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="chat-message flex items-start space-x-3"
                  data-testid={`message-${message.id}`}
                >
                  <div className={`w-8 h-8 ${getAvatarColor(message.username)} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-medium">
                      {message.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span 
                        className="font-medium text-card-foreground text-sm"
                        data-testid={`text-username-${message.id}`}
                      >
                        {message.username}
                      </span>
                      <span 
                        className="text-muted-foreground text-xs"
                        data-testid={`text-timestamp-${message.id}`}
                      >
                        {formatTime(message.timestamp!.toString())}
                      </span>
                    </div>
                    <p 
                      className="text-card-foreground"
                      data-testid={`text-content-${message.id}`}
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Chat Input */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <Input 
                  type="text" 
                  placeholder="Type your message of support..." 
                  className="flex-1"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={!isConnected}
                  data-testid="input-chat-message"
                />
                <Button 
                  type="submit" 
                  disabled={!messageText.trim() || !isConnected}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Messages are moderated. Be kind and supportive.
              </p>
            </div>
              </Card>
            </TabsContent>

            <TabsContent value="video">
              <Card className="min-h-[500px]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Video Chat</h4>
                    <div className="text-sm text-muted-foreground">
                      Anonymous peer support
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {!isConnectedToPartner && !isSearching ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Video className="h-16 w-16 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">Connect with someone</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Start a video chat with another person seeking support. You'll be matched anonymously.
                      </p>
                      <Button onClick={startVideoChat} className="mt-4">
                        <Video className="h-4 w-4 mr-2" />
                        Start Video Chat
                      </Button>
                    </div>
                  ) : isSearching ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                      <h3 className="text-lg font-semibold">Looking for someone to chat with...</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Please wait while we connect you with another person.
                      </p>
                      <Button variant="outline" onClick={stopVideoChat}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                        <div className="relative bg-muted rounded-lg overflow-hidden">
                          <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Stranger
                          </div>
                        </div>
                        
                        <div className="relative bg-muted rounded-lg overflow-hidden">
                          <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            You
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant={isVideoActive ? "default" : "destructive"}
                          size="sm"
                          onClick={toggleVideo}
                        >
                          {isVideoActive ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant={isAudioActive ? "default" : "destructive"}
                          size="sm"
                          onClick={toggleAudio}
                        >
                          {isAudioActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={nextPartner}>
                          <Phone className="h-4 w-4 mr-2" />
                          Next
                        </Button>
                        
                        <Button variant="destructive" size="sm" onClick={stopVideoChat}>
                          <PhoneOff className="h-4 w-4 mr-2" />
                          End Call
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
