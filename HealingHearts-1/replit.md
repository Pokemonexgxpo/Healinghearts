# HealingHearts Mental Health Support Platform

## Overview

HealingHearts is a comprehensive mental health support platform designed to provide a safe space for individuals seeking emotional support and wellness resources. The application combines educational content, interactive coping tools, community features, and crisis resources to create an accessible first-line mental health support system.

The platform addresses the critical need for mental health awareness and support by offering multiple touchpoints including an interactive FAQ system, personalized coping tool recommendations, community-driven content sharing, real-time peer support, and immediate access to crisis resources. The application emphasizes accessibility and user safety while maintaining a supportive, non-judgmental environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript using Vite as the build tool for optimal development experience and performance. The UI framework leverages shadcn/ui components built on Radix UI primitives, providing accessible and consistent design patterns throughout the application.

The application follows a component-based architecture with dedicated sections for each major feature: FAQ system with expandable content, blog platform for story sharing, interactive games including coping wheel and guessing games, personalized quizzes for coping tool recommendations, inspirational quotes management, real-time chat functionality, and crisis resource directories.

State management utilizes React's built-in hooks combined with TanStack Query for server state management, providing efficient data fetching, caching, and synchronization. The routing is handled by Wouter for lightweight client-side navigation.

### Backend Architecture
The server is implemented using Express.js with TypeScript, providing RESTful API endpoints for data operations and WebSocket support for real-time chat functionality. The architecture follows a modular approach with separated concerns for authentication, routing, storage, and WebSocket management.

The backend implements a flexible storage abstraction layer that currently uses an in-memory implementation (MemStorage) for development, allowing seamless transition to database-backed storage in production. This design pattern ensures scalability and maintainable code separation.

Session management is handled through express-session with configurable security settings for development and production environments. Admin authentication provides protected endpoints for content moderation and management tasks.

### Real-time Communication
WebSocket functionality is implemented using the 'ws' library, enabling real-time chat features for peer support. The system maintains connected client tracking, broadcasts new messages to all participants, provides user count updates, and includes message history for new connections.

The chat system includes basic content filtering for safety, supports anonymous usernames with friendly random generation, and handles connection management with automatic reconnection capabilities.

### Data Models and Storage
The application uses Drizzle ORM with PostgreSQL schema definitions for structured data management. Core entities include users with authentication capabilities, quotes with approval workflows, chat messages with timestamps, FAQ questions and answers, blog posts for story sharing, and video resources for additional support content.

The current implementation provides both in-memory storage for development and database-ready schemas for production deployment. All data models include proper TypeScript typing and validation using Zod schemas.

### Styling and Design System
The UI implements a comprehensive design system using Tailwind CSS with custom CSS variables for consistent theming. The design supports extensible color schemes and maintains accessibility standards with proper contrast ratios and focus indicators.

The styling system includes animated heart backgrounds for visual appeal, gradient backgrounds for hero sections, responsive design patterns for mobile and desktop experiences, and hover effects for interactive elements. Component styling follows shadcn/ui patterns with variant-based designs using class-variance-authority.

### Development and Deployment
The development workflow uses TypeScript strict mode for type safety across the entire codebase. The project includes hot module replacement through Vite for rapid development feedback and comprehensive build optimization for production.

Deployment configuration supports multiple platforms including Railway (recommended), Render, and other free hosting services. The build process involves client-side bundling with Vite and server-side compilation with esbuild for optimized production deployments.

## External Dependencies

### Database Infrastructure
- **Drizzle ORM**: Type-safe database access layer with PostgreSQL dialect support
- **Neon Database**: Serverless PostgreSQL database provider via @neondatabase/serverless
- **PostgreSQL**: Primary database system configured for structured data persistence

### UI Component Libraries
- **Radix UI**: Comprehensive collection of accessible UI primitives including dialogs, dropdowns, navigation menus, form controls, and interactive elements
- **shadcn/ui**: Pre-built component library providing consistent styling patterns and design system implementation
- **Lucide React**: Icon library for consistent iconography throughout the application

### Real-time and State Management
- **TanStack React Query**: Server state management for efficient data fetching, caching, and synchronization
- **WebSocket (ws)**: Real-time bidirectional communication for chat functionality
- **Wouter**: Lightweight client-side routing solution

### Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **ESBuild**: JavaScript bundler for optimized production builds

### Form Handling and Validation
- **React Hook Form**: Performant form library with validation support
- **Zod**: TypeScript-first schema validation for data integrity
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries