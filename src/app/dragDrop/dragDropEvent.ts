export class DragDropEvent {
    public src: Object;
    public drops: Array<{type: string,
                         dst: Object
                        }>   = [];
}
