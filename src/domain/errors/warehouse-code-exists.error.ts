import { DomainError } from "../entities";

export class WarehouseCodeAlreadyExistsError extends DomainError {
  constructor(code: string) {
    super(`A warehouse with code ${code} already exists.`);
  }
}
