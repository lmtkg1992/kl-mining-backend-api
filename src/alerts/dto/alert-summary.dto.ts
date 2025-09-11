export class BreachAlertSummaryDto {
  total_alerts: number;
  critical_alerts: number;
  high_confidence_alerts: number;
  acknowledged_resolved: number;
}

export class TruckActivitiesSummaryDto {
  trucks_in: number;
  trucks_out: number;
  truck_in_activities: number;
  truck_overloaded: number;
}

export class AlertSummaryDto {
  breach_alert_summary: BreachAlertSummaryDto;

  truck_activity_summary: TruckActivitiesSummaryDto;
}
