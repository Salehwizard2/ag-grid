// Type definitions for @ag-grid-community/core v29.3.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IHeaderColumn } from "../interfaces/iHeaderColumn";
import { ColGroupDef } from "./colDef";
import { Column, ColumnPinnedType } from "./column";
import { AbstractColDef } from "./colDef";
import { ProvidedColumnGroup } from "./providedColumnGroup";
import { GridOptionsService } from "../gridOptionsService";
export declare type ColumnGroupShowType = 'open' | 'closed';
export declare class ColumnGroup implements IHeaderColumn {
    static EVENT_LEFT_CHANGED: string;
    static EVENT_DISPLAYED_CHILDREN_CHANGED: string;
    static createUniqueId(groupId: string, instanceId: number): string;
    gridOptionsService: GridOptionsService;
    private children;
    private displayedChildren;
    private readonly groupId;
    private readonly partId;
    private readonly providedColumnGroup;
    private readonly pinned;
    private left;
    private oldLeft;
    private localEventService;
    private parent;
    constructor(providedColumnGroup: ProvidedColumnGroup, groupId: string, partId: number, pinned: ColumnPinnedType);
    reset(): void;
    getParent(): ColumnGroup;
    setParent(parent: ColumnGroup): void;
    getUniqueId(): string;
    isEmptyGroup(): boolean;
    isMoving(): boolean;
    checkLeft(): void;
    getLeft(): number | null;
    getOldLeft(): number | null;
    setLeft(left: number | null): void;
    getPinned(): ColumnPinnedType;
    private createAgEvent;
    addEventListener(eventType: string, listener: Function): void;
    removeEventListener(eventType: string, listener: Function): void;
    getGroupId(): string;
    getPartId(): number;
    isChildInThisGroupDeepSearch(wantedChild: IHeaderColumn): boolean;
    getActualWidth(): number;
    isResizable(): boolean;
    getMinWidth(): number;
    addChild(child: IHeaderColumn): void;
    getDisplayedChildren(): IHeaderColumn[] | null;
    getLeafColumns(): Column[];
    getDisplayedLeafColumns(): Column[];
    getDefinition(): AbstractColDef | null;
    getColGroupDef(): ColGroupDef | null;
    isPadding(): boolean;
    isExpandable(): boolean;
    isExpanded(): boolean;
    setExpanded(expanded: boolean): void;
    private addDisplayedLeafColumns;
    private addLeafColumns;
    getChildren(): IHeaderColumn[] | null;
    getColumnGroupShow(): ColumnGroupShowType | undefined;
    getProvidedColumnGroup(): ProvidedColumnGroup;
    /** @deprecated v27 getOriginalColumnGroup is deprecated, use getProvidedColumnGroup. */
    getOriginalColumnGroup(): ProvidedColumnGroup;
    getPaddingLevel(): number;
    calculateDisplayedColumns(): void;
}
