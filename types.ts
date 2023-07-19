import type { Prisma } from "@prisma/client";

export interface FilterInput {
  filters?: {
    [key: string]: any;
  };
  sort?: {
    // sort key can only be exactly one
    [key: string]: "asc" | "desc";
  };
}

export interface MilestoneFilterInput extends FilterInput {
  filters?: {
    [key: string]: any;
    journalId?: string | number | undefined;
  };
}

export interface MilestoneTagInput {
  to:
    | {
        journalId: number | string | undefined;
        taskId: number | string | undefined;
      }
    | undefined;
  create:
    | {
        task: Prisma.TaskCreateInput | undefined;
      }
    | undefined;
}

export interface MilestoneCreateInput extends MilestoneTagInput {
  description: string;
}

export interface MilestoneUntagInput {
  from: {
    journalId: number | string | undefined;
    taskId: number | string | undefined;
  };
}
