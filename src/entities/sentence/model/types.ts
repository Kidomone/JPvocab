import type { WordDetail } from '../../word';

export interface ParsedToken {
  id: string;
  text: string;
  reading?: string;
  isClickable: boolean;
  detail?: WordDetail;
}
