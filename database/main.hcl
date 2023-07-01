schema "student-life" {
  charset = "utf8mb4"
  collate = "utf8mb4_0900_ai_ci"
}

table "journal" {
  schema = schema["student-life"]

  column "id" {
    type = int
    auto_increment = true
  }

  column "journal_date" {
    type = date
  }

  column "created_at" {
    type = datetime
  }

  column "updated_at" {
    type = datetime
  }

  primary_key {
    columns = [column.id]
  }

  index "ix_journal_journal_date" {
    columns = [column.journal_date]
  }
}