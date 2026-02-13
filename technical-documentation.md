# MyMealAgent – Technical Documentation

## 1. Overview

MyMealAgent is a mobile-first AI-powered cooking assistant that converts saved recipe content into structured, actionable cooking plans.

The system consists of:

- A React Native mobile application (Expo)
- A FastAPI backend service
- Asynchronous task processing with Celery
- Media processing with OCR and video/audio extraction
- Cloud deployment using Docker and Azure
- Subscription management using RevenueCat

---

# 2. Tech Stack

## Mobile Application

- **Framework:** React Native (Expo)
- **Navigation:** Expo Router
- **State Management:** React Context + custom hooks
- **Secure Storage:** Expo SecureStore
- **Billing:** RevenueCat (react-native-purchases, react-native-purchases-ui)
- **Build & Distribution:** EAS Build + TestFlight

---

## Backend API

- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL (Azure)
- **Authentication:** JWT-based auth
- **Task Queue:** Celery
- **Broker:** Redis (Azure Cache for Redis)
- **OCR Processing:** Tesseract
- **Video/Audio Extraction:** yt-dlp (YoutubeDL)
- **AI Processing:** OpenAI API (transcription + summarization)
- **Containerization:** Docker
- **Hosting:** Azure App Service + Azure Container Apps (Celery worker)

---

# 3. System Architecture

## High-Level Architecture

# MyMealAgent – Technical Documentation

## 1. Overview

MyMealAgent is a mobile-first AI-powered cooking assistant that converts saved recipe content into structured, actionable cooking plans.

The system consists of:

- A React Native mobile application (Expo)
- A FastAPI backend service
- Asynchronous task processing with Celery
- Media processing with OCR and video/audio extraction
- Cloud deployment using Docker and Azure
- Subscription management using RevenueCat

---

# 2. Tech Stack

## Mobile Application

- **Framework:** React Native (Expo)
- **Navigation:** Expo Router
- **State Management:** React Context + custom hooks
- **Secure Storage:** Expo SecureStore
- **Billing:** RevenueCat (react-native-purchases, react-native-purchases-ui)
- **Build & Distribution:** EAS Build + TestFlight

---

## Backend API

- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL (Azure)
- **Authentication:** JWT-based auth
- **Task Queue:** Celery
- **Broker:** Redis (Azure Cache for Redis)
- **OCR Processing:** Tesseract
- **Video/Audio Extraction:** yt-dlp (YoutubeDL)
- **AI Processing:** OpenAI API (transcription + summarization)
- **Containerization:** Docker
- **Hosting:** Azure App Service + Azure Container Apps (Celery worker)

---

# 3. System Architecture

## High-Level Architecture

```
Mobile App (Expo)
│
▼
FastAPI REST API (Azure App Service)
│
├── PostgreSQL (User, Recipe, Import Data)
│
├── Redis (Message Broker)
│
▼
Celery Worker (Azure Container App)
│
├── Tesseract OCR (image text extraction)
│
├── yt-dlp (audio extraction from TikTok/Dailymotion URLs)
│
└── OpenAI API (transcription + summarization)
```

---

# 4. Import Processing Pipeline

MyMealAgent supports two primary import types:

## A. Image-Based Recipes

1. User uploads image
2. Image stored temporarily in Azure Blob Storage
3. Celery task triggered
4. Worker:
   - Uses **Tesseract OCR** to extract raw text
   - Sends extracted text to OpenAI API
   - AI structures ingredients & cooking steps
5. Recipe saved to database

---

## B. Video URL Recipes (TikTok / Dailymotion)

1. User submits supported video URL
2. Celery task triggered
3. Worker:
   - Uses **yt-dlp** to download audio stream from video URL
   - Converts audio to compatible format (mp3/wav)
   - Sends audio to OpenAI API for transcription
   - Summarizes transcript into structured recipe format
4. Recipe saved to database

This asynchronous design prevents long-running media processing from blocking API responses.

---

# 5. Media Processing Components

## yt-dlp (YoutubeDL)

Used to:
- Download audio from TikTok and Dailymotion URLs
- Extract audio streams without full video storage
- Handle format normalization

Runs inside Docker container with:
- ffmpeg
- ffprobe
- Required dependencies for media processing

---

## Tesseract OCR

Used for:
- Extracting text from uploaded recipe images
- Preprocessing images for improved OCR accuracy
- Passing cleaned text to AI summarization layer

---

## OpenAI Integration

Used for:
- Audio transcription (speech-to-text)
- Converting unstructured text into structured recipe data
- Generating ingredient lists and cooking steps

---

# 6. RevenueCat Implementation

## Subscription Model

### Free Plan
- Maximum 10 recipes

### Premium Plan (My Meal Agent Pro)
- Unlimited recipe imports
- Priority processing
- Advanced AI summarization

---

## Product Configuration

### App Store Products

- `monthly` – Auto-renewable subscription
- `yearly` – Auto-renewable subscription
- `lifetime` – Non-consumable

### Entitlement

- `My Meal Agent Pro`

---

## Paywall Flow

```ts
await RevenueCatUI.presentPaywall();
```

---

# 7. Scalability & Deployment

- API and Celery workers run in separate containers
- Redis acts as message broker only
- Media processing isolated from API layer
- Docker ensures consistent environment for:
  - Tesseract
  - ffmpeg
  - yt-dlp

This architecture supports horizontal scaling of workers for heavy media workloads.

---

# 8. Conclusion

MyMealAgent combines:
- Mobile-first UX
- AI-powered text processing
- OCR image extraction
- Audio extraction via yt-dlp
- Cloud-native async processing
- Subscription-based monetization

The system is modular, scalable, and built to support increasing media complexity and user growth.
