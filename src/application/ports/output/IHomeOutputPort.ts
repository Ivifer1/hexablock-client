import type { HomeViewDTO } from '../../value-objects/home.dto';

export interface IHomeOutputPort {
  presentHome(view: HomeViewDTO): void;
}
