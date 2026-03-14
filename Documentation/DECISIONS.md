Architecture Decision Records (ADR) - Sara7a Project

Decision 001: Project Folder Structure (Monolithic Layered)

Context
We need a clean, maintainable folder structure that separates database logic, business logic, and API routing.

Decision
We adopted a layered architecture:

src/database: For Models and DB connection.

src/modules: For Services and Controllers (grouped by feature).

src/common: For reusable Utilities, Security, and Middlewares.

Reason
Scalability: Easier to add new features (like Messages) without cluttering files.

Separation of Concerns: Controllers only handle requests, Services handle logic.

Consequences
Requires clear Export/Import management (using index.js barrels).

Decision 002: Using Redis for OTP Storage

Context
User password resets require temporary codes that must expire and be verified quickly.

Decision
We implemented Redis as an in-memory store for OTPs using the SETEX (Set with Expiry) command.

Reason
Automatic Expiration: No need for manual cleanup or Cron jobs.

Performance: Extremely fast read/write compared to MongoDB.

Security: OTPs are hashed before being stored in Redis.

Consequences
Adds Redis as a project dependency.

Decision 003: JWT with Registered Claims (iss & aud)

Context
We need a stateless authentication method that identifies both the sender and the intended role of the user.

Decision
We use JWT with:

issuer (iss): Set to "sara7a-app".

audience (aud): Set to "Admin" or "User" based on database role.

Reason
Future-Proofing: The iss claim identifies our service.

Role Isolation: The aud claim prevents "User" tokens from accessing "Admin" routes even if the signature is valid.

Consequences
Verification middleware must explicitly check these claims.

Decision 004: Standardized Response & Exception Handling

Context
API responses and errors need to be consistent across all endpoints.

Decision
We created a set of utility functions (SuccessResponse) and custom Exception classes (ConflictException, NotFoundException, etc.).

Reason
Consistency: Frontend developers always receive the same JSON structure.

Maintainability: Changing an error message or status code happens in one place.

Consequences
All service logic must use these utility classes for throwing errors.

Decision 005: Role-Based Access Control (RBAC) Middleware
Context
The application has different user roles (Admin vs User) and requires a way to protect routes dynamically.

Decision
We implemented a two-step middleware chain:

verifyToken: Validates the token's integrity and signature.

allowedTo(...roles): A higher-order function that checks the aud claim against an array of permitted roles.

Reason
Security: Ensures a "Zero Trust" policy on sensitive routes (e.g., deleting users).

Flexibility: Supports routes that are accessible by multiple roles (e.g., allowedTo("Admin", "User")).

Consequences
verifyToken must always be placed before allowedTo in the route chain.

Decision 006: Secure Session Management with Refresh Token Rotation

Context
.We need a secure way to keep users logged in without making the Access Token long-lived, which would increase the risk of token theft

Decision
:We implemented a dual-token system with the following rules

Refresh Token Type: A cryptographically secure random string (using crypto.randomBytes).

Storage: Stored in Redis with a 30-day Time-To-Live (TTL).

Rotation Policy: Every time a new Access Token is requested, the old Refresh Token is deleted and a new one is issued.

Helper Strategy: Centralized session creation logic in a private createSession helper within the Auth Service.

Reason

Security (Replay Protection): Rotation ensures that if a Refresh Token is leaked, it can only be used once. Subsequent attempts with the same token will fail, signaling a potential breach.

Control (Revocation): Using a random string in Redis allows us to instantly revoke a user's session (e.g., on Logout) by deleting the key.

Performance: Redis handles session lookups and deletions in sub-millisecond time.

Code Quality (DRY): The createSession helper ensures consistent token structure between Login and Refresh-token flows.

Consequences

Clients must store and send two different tokens.

The system relies on Redis availability for all authentication renewals.

Decision 007: Centralized Request Validation using Joi

Context
We need a robust way to validate incoming request data (body, params, query) to ensure it meets our business rules and prevent malformed data from reaching the service layer.

Decision
We implemented a centralized validation system using the Joi library and a custom higher-order middleware:

Validation Schemas: Created specific schemas for each endpoint (e.g., signUpSchema, updateLoginDataSchema).

Generic Middleware: Developed a validateRequest middleware that takes a Joi schema and validates the req.body against it.

Strict Sanitization: Used stripUnknown: true to automatically remove any fields not defined in the schema (preventing Mass Assignment Attacks).

Comprehensive Feedback: Used abortEarly: false to return all validation errors at once to the client.

Reason

Security: Acts as the first line of defense against injection and invalid data.

Cleaner Controllers: Controllers no longer need to check for field existence or data types; they receive "clean" data.

Single Source of Truth: Business rules (like password length or allowed gender enums) are defined in one place per module.

Improved UX: Providing all errors in one response helps frontend developers debug faster.

Consequences

Every new endpoint must have an associated Joi schema.

Changes to the database schema must be reflected in the corresponding Joi schemas