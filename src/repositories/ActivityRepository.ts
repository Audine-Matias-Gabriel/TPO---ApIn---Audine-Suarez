import AppDataSource from '../db/data-source';
import { Project } from '../entities/Project.entity';
import { Task } from '../entities/Task.entity';
import { User } from '../entities/User.entity';

export interface ActivityEvent {
  id: string;
  type: string;
  action: string;
  entityName: string;
  createdAt: Date;
}

export class ActivityRepository {
  static async getRecentActivity(limit: number = 15): Promise<ActivityEvent[]> {
    const [projects, tasks, users] = await Promise.all([
      AppDataSource.getRepository(Project)
        .createQueryBuilder('p')
        .orderBy('p.createdAt', 'DESC')
        .take(limit)
        .getMany(),
      AppDataSource.getRepository(Task)
        .createQueryBuilder('t')
        .orderBy('t.createdAt', 'DESC')
        .take(limit)
        .getMany(),
      AppDataSource.getRepository(User)
        .createQueryBuilder('u')
        .orderBy('u.createdAt', 'DESC')
        .take(limit)
        .getMany(),
    ]);

    const events: ActivityEvent[] = [
      ...projects.map(p => ({
        id: p.id,
        type: 'project',
        action: 'created',
        entityName: p.name,
        createdAt: p.createdAt,
      })),
      ...tasks.map(t => ({
        id: t.id,
        type: 'task',
        action: 'created',
        entityName: t.title,
        createdAt: t.createdAt,
      })),
      ...users.map(u => ({
        id: u.id,
        type: 'user',
        action: 'created',
        entityName: u.name,
        createdAt: u.createdAt,
      })),
    ];

    // Sort by most recent
    return events.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, limit);
  }
}
