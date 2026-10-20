import type { WordDetail } from '../../word';

export interface ParsedToken {
  id: string;
  text: string;
  isClickable: boolean;
  detail?: WordDetail;
}
