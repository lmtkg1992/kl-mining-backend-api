import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateNotificationsDto } from "./dto/create-notifications.dto";
import { UpdateNotificationsDto } from "./dto/update-notifications.dto";
import { NotificationsRepository } from "./infrastructure/persistence/notifications.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Notifications } from "./domain/notifications";
import { FindAllNotificationsDto } from "./dto/find-all-notifications.dto";

@Injectable()
export class NotificationsService {
  constructor(
    // Dependencies here
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createNotificationsDto: CreateNotificationsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.notificationsRepository.create({
      event_type: createNotificationsDto.event_type,
      event_id: createNotificationsDto.event_id,
      event_link: createNotificationsDto.event_link,
      type: createNotificationsDto.type,
      title: createNotificationsDto.title,
      message: createNotificationsDto.message,
      site_id: createNotificationsDto.site_id,
      camera_id: createNotificationsDto.camera_id,
      priority: createNotificationsDto.priority,
      is_read: createNotificationsDto.is_read ?? false,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.notificationsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllNotificationsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.notificationsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.notificationsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Notifications["id"]) {
    return this.notificationsRepository.findById(id);
  }

  findByIds(ids: Notifications["id"][]) {
    return this.notificationsRepository.findByIds(ids);
  }

  async update(
    id: Notifications["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateNotificationsDto: UpdateNotificationsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.notificationsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Notifications["id"]) {
    return this.notificationsRepository.remove(id);
  }
}
