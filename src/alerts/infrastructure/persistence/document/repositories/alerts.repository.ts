import { Injectable } from "@nestjs/common";
import { NullableType } from "../../../../../utils/types/nullable.type";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AlertsSchemaClass } from "../entities/alerts.schema";
import { AlertsRepository } from "../../alerts.repository";
import { Alerts } from "../../../../domain/alerts";
import { AlertsMapper } from "../mappers/alerts.mapper";
import { IPaginationOptions } from "../../../../../utils/types/pagination-options";

@Injectable()
export class AlertsDocumentRepository implements AlertsRepository {
  constructor(
    @InjectModel(AlertsSchemaClass.name)
    private readonly alertsModel: Model<AlertsSchemaClass>,
  ) {}

  async create(data: Alerts): Promise<Alerts> {
    const persistenceModel = AlertsMapper.toPersistence(data);
    const createdEntity = new this.alertsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AlertsMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Alerts[]> {
    const entityObjects = await this.alertsModel
      .find()
      .sort({ createdAt: -1 })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AlertsMapper.toDomain(entityObject),
    );
  }

  async findAllWithFilterAndPagination({
    filter,
    paginationOptions,
  }: {
    filter: any;
    paginationOptions: IPaginationOptions;
  }): Promise<Alerts[]> {

    if(filter.from_date || filter.to_date){
      filter.timestamp = {};
    }
    if (filter.from_date) {
      filter.timestamp.$gte = new Date(filter.from_date);
      delete filter.from_date;
    }
    if (filter.to_date) {
      filter.timestamp.$lte = new Date(filter.to_date);
      delete filter.to_date;
    }
    const entityObjects = await this.alertsModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AlertsMapper.toDomain(entityObject),
    );
  }

  async countWithFilter(filter: any): Promise<number> {
    if(filter.from_date || filter.to_date){
      filter.timestamp = {};
    }
    if (filter.from_date) {
      filter.timestamp.$gte = new Date(filter.from_date);
      delete filter.from_date;
    }
    if (filter.to_date) {
      filter.timestamp.$lte = new Date(filter.to_date);
      delete filter.to_date;
    }
    return this.alertsModel.countDocuments(filter);
  }

  async findById(id: Alerts["id"]): Promise<NullableType<Alerts>> {
    const entityObject = await this.alertsModel.findById(id);
    return entityObject ? AlertsMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Alerts["id"][]): Promise<Alerts[]> {
    const entityObjects = await this.alertsModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      AlertsMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Alerts["id"],
    payload: Partial<Alerts>,
  ): Promise<NullableType<Alerts>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.alertsModel.findOne(filter);

    if (!entity) {
      throw new Error("Record not found");
    }

    const entityObject = await this.alertsModel.findOneAndUpdate(
      filter,
      AlertsMapper.toPersistence({
        ...AlertsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AlertsMapper.toDomain(entityObject) : null;
  }

  async remove(id: Alerts["id"]): Promise<void> {
    await this.alertsModel.deleteOne({ _id: id });
  }

  async getBreachAlertSummary(level: string, id?: string[]) {
    let baseFilter = {};

    if (level === "site" || level === "province") {
      baseFilter = {
        site_id: { $in: id },
        alert_type: "breach_event",
      };
    } else if (level === "admin") {
      baseFilter = {
        alert_type: "breach_event",
      };
    }

    const [
      totalAlerts,
      criticalAlerts,
      highConfidenceAlerts,
      acknowledgedResolved,
    ] = await Promise.all([
      // Total alerts
      this.alertsModel.countDocuments(baseFilter),

      // Critical alerts
      this.alertsModel.countDocuments({
        ...baseFilter,
        severity: "critical",
      }),

      // High confidence alerts (confidence >= 80)
      this.alertsModel.countDocuments({
        ...baseFilter,
        confidence: { $gte: 80 },
      }),

      // Acknowledged and resolved
      this.alertsModel.countDocuments({
        ...baseFilter,
        status: { $in: ["acknowledged", "resolved"] },
      }),
    ]);

    return {
      total_alerts: totalAlerts,
      critical_alerts: criticalAlerts,
      high_confidence_alerts: highConfidenceAlerts,
      acknowledged_resolved: acknowledgedResolved,
    };
  }

  async getTruckActivitiesSummary(level: string, id?: string[]) {
    let baseFilter = {};

    if (level === "site" || level === "province") {
      baseFilter = {
        site_id: { $in: id },
        alert_type: "truck_activity",
      };
    } else if (level === "admin") {
      baseFilter = {
        alert_type: "truck_activity",
      };
    }

    const [trucksIn, trucksOut, truckInActivities, truckOverloaded] =
      await Promise.all([
        // Trucks entering (direction: 'in')
        this.alertsModel.countDocuments({
          ...baseFilter,
          direction: "in",
        }),

        // Trucks leaving (direction: 'out')
        this.alertsModel.countDocuments({
          ...baseFilter,
          direction: "out",
        }),

        // Truck in activities (direction: 'in' and status: 'new' or 'under_review')
        this.alertsModel.countDocuments({
          ...baseFilter,
          direction: "in",
          status: { $in: ["new", "under_review"] },
        }),

        // Overloaded trucks
        this.alertsModel.countDocuments({
          ...baseFilter,
          overloaded: true,
        }),
      ]);

    return {
      trucks_in: trucksIn,
      trucks_out: trucksOut,
      truck_in_activities: truckInActivities,
      truck_overloaded: truckOverloaded,
    };
  }
}
