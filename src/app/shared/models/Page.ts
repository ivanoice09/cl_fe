export class Page<T> {
  constructor(
    public currentPage: number,
    public pageSize: number,
    public totalItems: number,
    public totalPages: number,
    public hasPrevious: boolean,
    public hasNext: boolean,
    public items: T[]
  ) {}
}
