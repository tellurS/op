import {IDragDropData} from '../page/api';

export class DragDropData implements IDragDropData {
    public src: Object;
    public drops: Array<{type: string,
                         dst: Object
                        }>   = [];
}
