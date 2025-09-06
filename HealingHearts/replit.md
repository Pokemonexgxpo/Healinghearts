# HealingHearts

## Overview

HealingHearts is a mental health support platform designed to provide a safe space for users seeking emotional support and mental health resources. The application offers an interactive FAQ system with expandable questions and answers, a coping tools wheel that suggests random activities, an inspirational quotes section, real-time chat functionality for peer support, and comprehensive crisis resources with emergency contact information.

The platform addresses the need for accessible mental health support by combining educational content, interactive tools, and community features. It serves as a first-line resource for individuals seeking immediate coping strategies while emphasizing the importance of professional mental health care when needed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application uses React with TypeScript, built with Vite for fast development and bundling. The UI is constructed using shadcn/ui components based on Radix UI primitives, providing accessible and customizable interface elements. Styling is handled through Tailwind CSS with custom CSS variables for theming and design consistency.

The application follows a component-based architecture with dedicated sections for each major feature (FAQ, coping wheel, quotes, chat, resources). State management utilizes React's built-in hooks combined with TanStack Query for server state management and caching. The routing is handled by Wouter for lightweight client-side navigation.

### Backend Architecture
The server is built with Express.js and TypeScript, providing a REST API for data operations and WebSocket support for real-time chat functionality. The architecture follows a modular approach with separate route handlers and storage abstraction layers.

The backend implements a storage interface that currently uses an in-memory implementation (MemStorage) for development, allowing easy transition to database-backed storage in production. This abstraction supports user management, quotes, chat messages, and FAQ questions with full CRUD operations.

### Real-time Communication
WebSocket functionality is implemented using the 'ws' library, enabling real-time chat features. The system broadcasts new messages to all connected clients, maintains user count tracking, and provides message history for newly connected users. Basic content filtering and rate limiting are implemented to maintain a safe chat environment.

### Data Models
The application uses Drizzle ORM with PostgreSQL schema definitions for structured data management. Core entities include users (with authentication), quotes (content and attribution), chat messages (username and content with timestamps), and FAQ questions (questions with answers). Zod schemas provide runtime validation and type safety.

### Styling and Design System
The UI implements a comprehensive design system using Tailwind CSS with custom CSS variables for consistent theming. The design supports both light and dark modes through CSS custom properties. Typography uses Google Fonts (Inter) for modern, readable interface text.

Component styling follows the shadcn/ui pattern with variant-based designs using class-variance-authority for consistent component APIs. The design emphasizes accessibility with proper ARIA labels, keyboard navigation support, and screen reader compatibility.

### Development Workflow
The development setup uses TypeScript strict mode for type safety across the entire codebase. Vite provides hot module replacement for rapid development feedback. The project includes development-specific plugins for error handling and debugging when running in Replit environments.

Build process involves bundling the client-side application with Vite and server-side code with esbuild for optimized production deployments. The configuration supports both development and production environments with appropriate optimizations.

## External Dependencies

### Database Infrastructure
- **Drizzle ORM**: Type-safe database access layer with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database provider via @neondatabase/serverless
- **PostgreSQL**: Primary database system for persistent data storage

### UI Component Libraries
- **Radix UI**: Comprehensive collection of accessible UI primitives for dialogs, dropdowns, navigation, and form controls
- **shadcn/ui**: Pre-built component library built on Radix UI with consistent styling patterns
- **Tailwind CSS**: Utility-first CSS framework for responsive design and theming

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Form state management with validation support
- **Hookform Resolvers**: Integration layer for validation schemas

### Real-time Communication
- **WebSocket (ws)**: Native WebSocket implementation for real-time chat functionality
- **HTTP Server**: Express.js-based REST API for data operations

### Development and Build Tools
- **Vite**: Build tool with hot module replacement for frontend development
- **TypeScript**: Static type checking across client and server code
- **ESBuild**: Fast JavaScript bundler for server-side code compilation

### Validation and Schema Management
- **Zod**: Runtime type validation and schema definition
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod for consistent validation

### Styling and Theming
- **Class Variance Authority**: Utility for creating component variants with consistent APIs
- **clsx/tailwind-merge**: Conditional className utilities for dynamic styling

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions (prepared for future authentication)

### Date and Time Handling
- **date-fns**: Utility library for date manipulation and formatting in chat timestamps and content dates