import { Injectable } from '@nestjs/common';
import { PagesRepository } from '@pages/repository/pages.repository';
import { PaginationInput, SortInput } from '@shared/utils/resource.utils';

@Injectable()
export class PagesService {
  constructor(private readonly pagesRepository: PagesRepository) {}

  getPagesByChapterId(
    chapterId: string,
    pagination?: PaginationInput,
    sort?: SortInput,
  ) {
    return this.pagesRepository.getPagesByChapterId(
      chapterId,
      pagination,
      sort,
    );
  }
}
