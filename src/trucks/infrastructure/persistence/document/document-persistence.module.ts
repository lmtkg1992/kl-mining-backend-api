import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TrucksSchema, TrucksSchemaClass } from "./entities/trucks.schema";
import { TrucksRepository } from "../trucks.repository";
import { TrucksDocumentRepository } from "./repositories/trucks.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrucksSchemaClass.name, schema: TrucksSchema },
    ]),
  ],
  providers: [
    {
      provide: TrucksRepository,
      useClass: TrucksDocumentRepository,
    },
  ],
  exports: [TrucksRepository],
})
export class DocumentTrucksPersistenceModule {}
