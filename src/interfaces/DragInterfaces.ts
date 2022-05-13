export interface Draggable {
       //handleDragStart(event: Event): void;
       handleDragEnd(event: Event): void;
}

export interface DragTarget {
       handleDragOver(event: Event): void;
       handleDrop(event: Event): void;
       handleDragLeave(event: Event): void;
}