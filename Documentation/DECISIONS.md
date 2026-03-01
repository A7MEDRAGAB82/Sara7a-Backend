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