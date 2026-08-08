# Part 1, GitHub Portfolio Walkthrough

**GitHub profile:** https://github.com/utkarsh636-developer

## Repository 1: API Monitoring System

**Repo:** https://github.com/utkarsh636-developer/api-monitoring-system

**Problem it solves:**
Most backend teams only discover that an API is being misused, overloaded, or silently failing after damage has been done. The database may crash from too many direct connection attempts, or nobody notices a spike in errors until a customer complains. This project is an event-driven logging and analytics pipeline that sits in front of an API. It validates and limits requests using Redis, queues every hit through RabbitMQ instead of writing to the database synchronously, and processes those events in the background. This approach ensures that the client receives a fast response, the database is protected from connection overload under load, and no requests are lost even if the database is temporarily struggling. Unprocessable events go to a dead-letter queue instead of disappearing.

**What I specifically built (solo project):**
- The complete ingestion pipeline: Express API server, Redis-backed API key validation and four-tier rate limiting, RabbitMQ (with confirm channels for guaranteed delivery), and a background consumer that writes to PostgreSQL via Prisma.
- Resilience layer: retry logic with exponential backoff and jitter for database errors and a dead-letter queue for any requests that still fail after retries.
- Circuit breaker logic and role-based access control on top of the ingestion API.
- Performance validation: k6 load tests comparing the system with and without Redis caching at 150 concurrent virtual users. With Redis enabled, average latency dropped from around 70.9 ms to 15.6 ms and p95 latency from around 167.6 ms to 25.3 ms, while maintaining a 0% error rate in both configurations.
- Identified and fixed a memory leak in the RabbitMQ consumer caused by an EventEmitter drain-listener that wasn't cleaned up between connections.
- Most recently: expanded the system with a Redis Pub/Sub real-time dashboard and an exponentially weighted moving average anomaly detector running as a second subscriber on the same channel as the dashboard.

**One design decision I'd make differently:**
I would add integration tests after every feature as I built it instead of mainly relying on manual testing and load testing at the end. The system has real concurrency and failure-mode logic (retries, dead-letter queue routing, rate-limit edge cases) that are easy to unintentionally break while adding a new feature. This might go unnoticed until a later load test reveals the issue. Writing integration tests gradually feature by feature would have caught regressions earlier and given me more confidence in extending the system, such as when adding the Redis Pub/Sub dashboard and anomaly detector, without needing to manually verify the entire pipeline each time.

---

## Repository 2: BookKaro (Event Booking Platform)

**Backend repo:** https://github.com/utkarsh636-developer/bookkaro-backend-project  
**Frontend repo:** https://github.com/utkarsh636-developer/bookkaro-frontend

**Problem it solves:**
BookKaro is a MERN-stack event booking platform. It allows users to browse events, view details and pricing, book tickets, and pay through Razorpay, while providing admins a separate method to manage events and bookings. It covers the entire booking lifecycle: authentication, event listings, ticket booking, and actual payment processing, rather than just being a CRUD demo.

**What I specifically built (solo project):**
- Backend: REST APIs for authentication, events, bookings, and payments; JWT-based authentication with role-based access control (user/admin); Razorpay payment integration; secure password hashing; file upload support; MongoDB/Mongoose data layer.
- Frontend: the complete React user-facing app includes a responsive landing page, event listing and filtering, event detail pages, ticket booking flow, Razorpay checkout, protected routes requiring login, and animations with Framer Motion.
- The admin functionality is currently server-rendered with EJS views in the backend repo instead of being part of the React frontend.

**One design decision I'd make differently:**
Honestly, three things:
1. I would build the admin panel as React pages that access the same API used by the user-facing frontend. Right now, there are effectively two different rendering methods in one project, which adds maintenance challenges and inconsistencies without any real advantage.
2. I would revisit the Razorpay integration and improve its design. It works, but it was built in a "don’t touch it, it’s fragile" manner rather than as a clean, well-tested integration that I would confidently extend or debug today.
3. I would reorganize the backend folder structure. Some of the current organization mirrors how the project evolved over time rather than a structure I would deliberately choose if starting from scratch today.
