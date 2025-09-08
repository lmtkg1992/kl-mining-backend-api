import { FaqsService } from "../faqs/faqs.service";
import { Faqs } from "../faqs/domain/faqs";

import {
  // common
  Injectable,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { CreateFaqCategoriesDto } from "./dto/create-faq-categories.dto";
import { UpdateFaqCategoriesDto } from "./dto/update-faq-categories.dto";
import { FaqCategoriesRepository } from "./infrastructure/persistence/faq-categories.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { FaqCategories } from "./domain/faq-categories";
import { FindAllFaqCategoriesDto } from "./dto/find-all-faq-categories.dto";
import { UnprocessableEntityException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class FaqCategoriesService {
  constructor(
    @Inject(forwardRef(() => FaqsService))
    private readonly faqsService: FaqsService,
    private readonly faqCategoriesRepository: FaqCategoriesRepository,
  ) {}

  async create(createFaqCategoriesDto: CreateFaqCategoriesDto) {
    // Do not remove comment below.
    // <creating-property />
    let faqs: Faqs[] | null | undefined = undefined;

    if (createFaqCategoriesDto.faqs) {
      const faqsObjects = await this.faqsService.findByIds(
        createFaqCategoriesDto.faqs.map((entity) => entity.id),
      );
      if (faqsObjects.length !== createFaqCategoriesDto.faqs.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            faqs: "notExists",
          },
        });
      }
      faqs = faqsObjects;
    } else if (createFaqCategoriesDto.faqs === null) {
      faqs = null;
    }

    return this.faqCategoriesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      faqs,

      position: createFaqCategoriesDto.position,

      is_active: createFaqCategoriesDto.is_active,

      description: createFaqCategoriesDto.description,

      title: createFaqCategoriesDto.title,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.faqCategoriesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllFaqCategoriesDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entites, total] = await Promise.all([
      this.faqCategoriesRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.faqCategoriesRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: FaqCategories["id"]) {
    return this.faqCategoriesRepository.findById(id);
  }

  findByIds(ids: FaqCategories["id"][]) {
    return this.faqCategoriesRepository.findByIds(ids);
  }

  async update(
    id: FaqCategories["id"],

    updateFaqCategoriesDto: UpdateFaqCategoriesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let faqs: Faqs[] | null | undefined = undefined;

    if (updateFaqCategoriesDto.faqs) {
      const faqsObjects = await this.faqsService.findByIds(
        updateFaqCategoriesDto.faqs.map((entity) => entity.id),
      );
      if (faqsObjects.length !== updateFaqCategoriesDto.faqs.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            faqs: "notExists",
          },
        });
      }
      faqs = faqsObjects;
    } else if (updateFaqCategoriesDto.faqs === null) {
      faqs = null;
    }

    return this.faqCategoriesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      faqs,

      position: updateFaqCategoriesDto.position,

      is_active: updateFaqCategoriesDto.is_active,

      description: updateFaqCategoriesDto.description,

      title: updateFaqCategoriesDto.title,
    });
  }

  remove(id: FaqCategories["id"]) {
    return this.faqCategoriesRepository.remove(id);
  }
}
