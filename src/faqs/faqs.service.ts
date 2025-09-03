import {
  // common
  Injectable,
} from "@nestjs/common";
import { CreateFaqsDto } from "./dto/create-faqs.dto";
import { UpdateFaqsDto } from "./dto/update-faqs.dto";
import { FaqsRepository } from "./infrastructure/persistence/faqs.repository";
import { IPaginationOptions } from "../utils/types/pagination-options";
import { Faqs } from "./domain/faqs";
import { FindAllFaqsDto } from "./dto/find-all-faqs.dto";

@Injectable()
export class FaqsService {
  constructor(
    // Dependencies here
    private readonly faqsRepository: FaqsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createFaqsDto: CreateFaqsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.faqsRepository.create({
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

    const [entites, total] = await Promise.all([
      this.faqsRepository.findAllWithFilterAndPagination({
        filter,
        paginationOptions,
      }),
      this.faqsRepository.countWithFilter(filter),
    ]);

    return { entites, total };
  }

  findById(id: Faqs["id"]) {
    return this.faqsRepository.findById(id);
  }

  findByIds(ids: Faqs["id"][]) {
    return this.faqsRepository.findByIds(ids);
  }

  async update(
    id: Faqs["id"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFaqsDto: UpdateFaqsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.faqsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Faqs["id"]) {
    return this.faqsRepository.remove(id);
  }
}
