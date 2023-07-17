export interface FilterInput {
  filters?: {
    [key: string]: any;
  };
  sort?: {
    // sort key can only be exactly one
    [key: string]: "asc" | "desc";
  };
}
