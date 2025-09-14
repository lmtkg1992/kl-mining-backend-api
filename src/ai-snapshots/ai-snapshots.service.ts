import {
  // common
  Injectable,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { CreateAiSnapshotsDto } from "./dto/create-ai-snapshots.dto";
import { UpdateAiSnapshotsDto } from "./dto/update-ai-snapshots.dto";
import { AiSnapshotsRepository } from "./infrastructure/persistence/ai-snapshots.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { AiSnapshots } from "./domain/ai-snapshots";
import { FindAllAiSnapshotsDto } from "./dto/find-all-ai-snapshots.dto";
import { AiCameras } from "src/ai-cameras/domain/ai-cameras";
import { AiCamerasService } from "src/ai-cameras/ai-cameras.service";
import { UnprocessableEntityException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { Types } from "mongoose";
import { AiCamerasRepository } from "src/ai-cameras/infrastructure/persistence/ai-cameras.repository";

@Injectable()
export class AiSnapshotsService {
  constructor(
      @Inject(forwardRef(() => AiCamerasService))
      private readonly aiCamerasService: AiCamerasService,
    // Dependencies here
      private readonly aiSnapshotsRepository: AiSnapshotsRepository,
      private readonly aiCameraRepository: AiCamerasRepository,
  ) {}

  async create(createAiSnapshotsDto: CreateAiSnapshotsDto) {
    let camera_id: AiCameras | null | undefined = undefined;

    if (createAiSnapshotsDto.camera_id) {
      const camera_idObject = await this.aiCamerasService.findById(
        createAiSnapshotsDto.camera_id,
      );
      if (!camera_idObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            camera_id: 'notExists',
          },
        });
      }
      camera_id = camera_idObject;
    } else if (createAiSnapshotsDto.camera_id === null) {
      camera_id = null;
    }
    return this.aiSnapshotsRepository.create({
      camera_id,
      event_type: createAiSnapshotsDto.event_type,
      image_url: createAiSnapshotsDto.image_url,
      truck_type: createAiSnapshotsDto.truck_type,
      fill_level: createAiSnapshotsDto.fill_level,
      confidence_score: createAiSnapshotsDto.confidence_score,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.aiSnapshotsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllAiSnapshotsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter: any = {};
    if (query.camera_id) {
      filter.camera_id = new Types.ObjectId(query.camera_id) as any;
    }
    if (query.site_id) {
      const cameras = await this.aiCameraRepository.findAllWithFilterAndPagination({
        filter: { site_id: query.site_id},
        paginationOptions: { page: 1, limit: 10000 },
      });
      const cameraIds = cameras.map((camera) => camera.id);
      filter.camera_id = { $in: cameraIds };
    }

    const [entites, total] = await Promise.all([
      this.aiSnapshotsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.aiSnapshotsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: AiSnapshots["id"]) {
    return this.aiSnapshotsRepository.findById(id);
  }

  findByIds(ids: AiSnapshots["id"][]) {
    return this.aiSnapshotsRepository.findByIds(ids);
  }

  async update(
    id: AiSnapshots["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAiSnapshotsDto: UpdateAiSnapshotsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
      let camera_id: AiCameras  | null | undefined = undefined;

      if (updateAiSnapshotsDto.camera_id) {
        const camera_idObject = await this.aiCamerasService.findById(
          updateAiSnapshotsDto.camera_id,
        );
        if (!camera_idObject) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              camera_id: 'notExists',
            },
          });
        }
        camera_id = camera_idObject;
      }else if (updateAiSnapshotsDto.camera_id === null) {
        camera_id = null;
      }
      

    return this.aiSnapshotsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      camera_id
    });
  }

  remove(id: AiSnapshots["id"]) {
    return this.aiSnapshotsRepository.remove(id);
  }
}
