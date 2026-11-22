import type { DefeatViewDTO } from '../../value-objects/defeat.dto';

export interface IDefeatOutputPort {
  presentDefeat(view: DefeatViewDTO): void;
}
