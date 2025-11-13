import { ActivityRepository } from '../repositories/ActivityRepository';
import type { ActivityEvent } from '../repositories/ActivityRepository';

export class ActivityService {
  async getRecentActivity(): Promise<ActivityEvent[]> {
    const events = await ActivityRepository.getRecentActivity();

    function mapType(t: string): "user" | "project" | "task" {
      if (t === "user" || t === "project" || t === "task") return t;
      throw new Error(`Invalid activity type: ${t}`);
    }
    
    return events.map(e => ({
      id: e.id,
      type: mapType(e.type as "user" | "project" | "task"),
      action: e.action,
      entityName: e.entityName,
      createdAt: e.createdAt,
    }));
  }
}