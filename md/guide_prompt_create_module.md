# 🚀 Guide Prompt: Generate New NestJS Module (Based on `admin-users`)

You are an expert NestJS Boilerplate developer.  
Follow the **exact structure and coding style** used in the `admin-users` module.  

## 📦 Module to Generate
**Module Name:** `<EntityName>`  
**Entity Class:** `<EntityClass>`  
**Collection/Table:** `<CollectionName>`  
**Fields:**  
- id (string | ObjectId)  
- createdAt (Date)  
- updatedAt (Date)  
- deletedAt (Date | null)  
- plus additional entity-specific fields  

---

## ✅ Requirements

1. **Domain Layer**
   - Create `src/<entity>/domain/<entity>.ts` defining the domain model with `@ApiProperty` decorators.

2. **DTOs**
   - `dto/create-<entity>.dto.ts` → use `class-validator` and `@ApiProperty`.
   - `dto/update-<entity>.dto.ts` → extend `PartialType(Create<Entity>Dto)`.
   - `dto/find-all-<entity>.dto.ts` → pagination query (page, limit).
   - `dto/<entity>.dto.ts` → minimal DTO with just `id`.

3. **Persistence Layer**
   - **Document Persistence (MongoDB)**  
     - `infrastructure/persistence/document/entities/<entity>.schema.ts`  
     - `infrastructure/persistence/document/mappers/<entity>.mapper.ts`  
     - `infrastructure/persistence/document/repositories/<entity>.repository.ts`  
     - `infrastructure/persistence/document/document-persistence.module.ts`
   - **Abstract Repository**  
     - `infrastructure/persistence/<entity>.repository.ts`  
     - Include CRUD + pagination methods.

4. **Service Layer**
   - `src/<entity>/<entity>.service.ts`  
   - Use repository dependency.  
   - Implement `create`, `findAllWithPagination`, `findAllWithFilterAndPagination`, `findById`, `findByIds`, `update`, `remove`.

5. **Controller**
   - `src/<entity>/<entity>.controller.ts`  
   - Expose REST endpoints:
     - `POST /<entity>` → create
     - `GET /<entity>/list` → paginated list
     - `GET /<entity>/detail/:id` → get detail
     - `PATCH /<entity>/update/:id` → update
     - `DELETE /<entity>/delete/:id` → remove
   - Use `@ApiTags`, `@ApiBearerAuth`, `AuthGuard('jwt')`, and `PermissionsGuard`.
   - Protect endpoints with `@RequirePermissions("<entity>::action")`.

6. **Module**
   - `src/<entity>/<entity>.module.ts`  
   - Import `Document<Entity>PersistenceModule`, `PermissionsModule`, `AdminUsersModule` (forwardRef if needed).
   - Export service + persistence module.

7. **Conventions**
   - Keep placeholder comments:  
     - `// <creating-property />`  
     - `// <creating-property-payload />`  
     - `// <updating-property />`  
     - `// <updating-property-payload />`  
   - Use `InfinityPaginationResponse`, `infinityPaginationWithMetadata`, and DTOs consistently.  
   - Apply `class-transformer` and `class-validator` decorators as in `admin-users`.

---

## 🎯 Example Prompt to Generate a New Module

```prompt
Please generate a new module named `stories` based on the `admin-users` module structure.  
- Entity: `Stories`  
- Collection: `stories`  
- Fields: `title` (string), `description` (string), `status` (string), `authorId` (ObjectId), `createdAt`, `updatedAt`.  
- All CRUD operations required.  
- Apply permissions: `stories::create`, `stories::list`, `stories::detail`, `stories::update`, `stories::delete`.  
