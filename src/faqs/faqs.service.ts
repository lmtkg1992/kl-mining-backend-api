import {
  // common
  Injectable,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { CreateFaqsDto } from "./dto/create-faqs.dto";
import { UpdateFaqsDto } from "./dto/update-faqs.dto";
import { FaqsRepository } from "./infrastructure/persistence/faqs.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Faqs } from "./domain/faqs";
import { FindAllFaqsDto } from "./dto/find-all-faqs.dto";
import { UnprocessableEntityException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { FaqCategoriesService } from "../faq-categories/faq-categories.service";
import { FaqCategories } from "../faq-categories/domain/faq-categories";

@Injectable()
export class FaqsService {
  constructor(
    @Inject(forwardRef(() => FaqCategoriesService))
    private readonly faqCategoriesService: FaqCategoriesService,
    private readonly faqsRepository: FaqsRepository,
  ) {}

  async create(createFaqsDto: CreateFaqsDto) {
    // Do not remove comment below.
    // <creating-property />
    const categoriesObject = await this.faqCategoriesService.findById(
      createFaqsDto.categories.id,
    );
    if (!categoriesObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          categories: "notExists",
        },
      });
    }
    const categories = categoriesObject;

    return this.faqsRepository.create({
      categories,
      question: createFaqsDto.question,
      answer: createFaqsDto.answer,
      image_url: createFaqsDto.image_url,
      order: createFaqsDto.order,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.faqsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findAllWithFilterAndPagination(
    query: FindAllFaqsDto,
    paginationOptions: IPaginationOptions,
  ) {
    const filter = {};

    const [entities, total] = await Promise.all([
      this.faqsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.faqsRepository.countWithFilter(filter),
    ]);

    return { entities, total };
  }

  findById(id: Faqs["id"]) {
    return this.faqsRepository.findById(id);
  }

  findByIds(ids: Faqs["id"][]) {
    return this.faqsRepository.findByIds(ids);
  }

  async update(
    id: Faqs["id"],

    updateFaqsDto: UpdateFaqsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let categories: FaqCategories | undefined = undefined;

    if (updateFaqsDto.categories) {
      const categoriesObject = await this.faqCategoriesService.findById(
        updateFaqsDto.categories.id,
      );
      if (!categoriesObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            categories: "notExists",
          },
        });
      }
      categories = categoriesObject;
    }

    return this.faqsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      categories,
    });
  }

  remove(id: Faqs["id"]) {
    return this.faqsRepository.remove(id);
  }
}
