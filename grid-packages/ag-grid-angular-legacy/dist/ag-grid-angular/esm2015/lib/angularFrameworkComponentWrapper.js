import { Injectable } from "@angular/core";
import { BaseComponentWrapper } from 'ag-grid-community';
export class AngularFrameworkComponentWrapper extends BaseComponentWrapper {
    setViewContainerRef(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    setComponentFactoryResolver(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }
    createWrapper(OriginalConstructor) {
        let that = this;
        class DynamicAgNg2Component extends BaseGuiComponent {
            init(params) {
                super.init(params);
                this._componentRef.changeDetectorRef.detectChanges();
            }
            createComponent() {
                return that.createComponent(OriginalConstructor);
            }
            hasMethod(name) {
                return wrapper.getFrameworkComponentInstance()[name] != null;
            }
            callMethod(name, args) {
                const componentRef = this.getFrameworkComponentInstance();
                return wrapper.getFrameworkComponentInstance()[name].apply(componentRef, args);
            }
            addMethod(name, callback) {
                wrapper[name] = callback;
            }
        }
        let wrapper = new DynamicAgNg2Component();
        return wrapper;
    }
    createComponent(componentType) {
        // used to cache the factory, but this a) caused issues when used with either webpack/angularcli with --prod
        // but more significantly, the underlying implementation of resolveComponentFactory uses a map too, so us
        // caching the factory here yields no performance benefits
        let factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        return this.viewContainerRef.createComponent(factory);
    }
}
AngularFrameworkComponentWrapper.decorators = [
    { type: Injectable }
];
class BaseGuiComponent {
    init(params) {
        this._params = params;
        this._componentRef = this.createComponent();
        this._agAwareComponent = this._componentRef.instance;
        this._frameworkComponentInstance = this._componentRef.instance;
        this._eGui = this._componentRef.location.nativeElement;
        this._agAwareComponent.agInit(this._params);
    }
    getGui() {
        return this._eGui;
    }
    destroy() {
        if (this._frameworkComponentInstance && typeof this._frameworkComponentInstance.destroy === 'function') {
            this._frameworkComponentInstance.destroy();
        }
        if (this._componentRef) {
            this._componentRef.destroy();
        }
    }
    getFrameworkComponentInstance() {
        return this._frameworkComponentInstance;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhckZyYW1ld29ya0NvbXBvbmVudFdyYXBwZXIuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3NlYW5sYW5kc21hbi9kZXYvYWctZ3JpZC8yOS4zLjAvZ3JpZC1wYWNrYWdlcy9hZy1ncmlkLWFuZ3VsYXItbGVnYWN5L3Byb2plY3RzL2FnLWdyaWQtYW5ndWxhci9zcmMvIiwic291cmNlcyI6WyJsaWIvYW5ndWxhckZyYW1ld29ya0NvbXBvbmVudFdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF5QyxVQUFVLEVBQW1CLE1BQU0sZUFBZSxDQUFDO0FBQ25HLE9BQU8sRUFBQyxvQkFBb0IsRUFBZ0QsTUFBTSxtQkFBbUIsQ0FBQztBQUl0RyxNQUFNLE9BQU8sZ0NBQWlDLFNBQVEsb0JBQXdDO0lBSW5GLG1CQUFtQixDQUFDLGdCQUFrQztRQUN6RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7SUFDN0MsQ0FBQztJQUVNLDJCQUEyQixDQUFDLHdCQUFrRDtRQUNqRixJQUFJLENBQUMsd0JBQXdCLEdBQUcsd0JBQXdCLENBQUM7SUFDN0QsQ0FBQztJQUVELGFBQWEsQ0FBQyxtQkFBbUM7UUFDN0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWhCLE1BQU0scUJBQXNCLFNBQVEsZ0JBQWdEO1lBQ2hGLElBQUksQ0FBQyxNQUFXO2dCQUNaLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekQsQ0FBQztZQUVTLGVBQWU7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFFRCxTQUFTLENBQUMsSUFBWTtnQkFDbEIsT0FBTyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUM7WUFDakUsQ0FBQztZQUVELFVBQVUsQ0FBQyxJQUFZLEVBQUUsSUFBZ0I7Z0JBQ3JDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO2dCQUMxRCxPQUFPLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFbEYsQ0FBQztZQUVELFNBQVMsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7Z0JBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUE7WUFDNUIsQ0FBQztTQUNKO1FBRUQsSUFBSSxPQUFPLEdBQTBCLElBQUkscUJBQXFCLEVBQUUsQ0FBQztRQUNqRSxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRU0sZUFBZSxDQUFJLGFBQTBDO1FBQ2hFLDRHQUE0RztRQUM1Ryx5R0FBeUc7UUFDekcsMERBQTBEO1FBQzFELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7O1lBbkRKLFVBQVU7O0FBc0RYLE1BQWUsZ0JBQWdCO0lBT2pCLElBQUksQ0FBQyxNQUFTO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztRQUNyRCxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDL0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFFdkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVNLE9BQU87UUFDVixJQUFHLElBQUksQ0FBQywyQkFBMkIsSUFBSSxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQ25HLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUM5QztRQUNELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztJQUVNLDZCQUE2QjtRQUNoQyxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUM1QyxDQUFDO0NBR0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgQ29tcG9uZW50UmVmLCBJbmplY3RhYmxlLCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtCYXNlQ29tcG9uZW50V3JhcHBlciwgRnJhbWV3b3JrQ29tcG9uZW50V3JhcHBlciwgV3JhcHBhYmxlSW50ZXJmYWNlfSBmcm9tICdhZy1ncmlkLWNvbW11bml0eSc7XG5pbXBvcnQge0FnRnJhbWV3b3JrQ29tcG9uZW50fSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRnJhbWV3b3JrQ29tcG9uZW50V3JhcHBlciBleHRlbmRzIEJhc2VDb21wb25lbnRXcmFwcGVyPFdyYXBwYWJsZUludGVyZmFjZT4gaW1wbGVtZW50cyBGcmFtZXdvcmtDb21wb25lbnRXcmFwcGVyIHtcbiAgICBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG4gICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjtcblxuICAgIHB1YmxpYyBzZXRWaWV3Q29udGFpbmVyUmVmKHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmID0gdmlld0NvbnRhaW5lclJlZjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q29tcG9uZW50RmFjdG9yeVJlc29sdmVyKGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyID0gY29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuICAgIH1cblxuICAgIGNyZWF0ZVdyYXBwZXIoT3JpZ2luYWxDb25zdHJ1Y3RvcjogeyBuZXcoKTogYW55IH0pOiBXcmFwcGFibGVJbnRlcmZhY2Uge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgY2xhc3MgRHluYW1pY0FnTmcyQ29tcG9uZW50IGV4dGVuZHMgQmFzZUd1aUNvbXBvbmVudDxhbnksIEFnRnJhbWV3b3JrQ29tcG9uZW50PGFueT4+IGltcGxlbWVudHMgV3JhcHBhYmxlSW50ZXJmYWNlIHtcbiAgICAgICAgICAgIGluaXQocGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgICAgICAgICBzdXBlci5pbml0KHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZUNvbXBvbmVudCgpOiBDb21wb25lbnRSZWY8QWdGcmFtZXdvcmtDb21wb25lbnQ8YW55Pj4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGF0LmNyZWF0ZUNvbXBvbmVudChPcmlnaW5hbENvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGFzTWV0aG9kKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmdldEZyYW1ld29ya0NvbXBvbmVudEluc3RhbmNlKClbbmFtZV0gIT0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FsbE1ldGhvZChuYW1lOiBzdHJpbmcsIGFyZ3M6IElBcmd1bWVudHMpOiB2b2lkIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLmdldEZyYW1ld29ya0NvbXBvbmVudEluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXIuZ2V0RnJhbWV3b3JrQ29tcG9uZW50SW5zdGFuY2UoKVtuYW1lXS5hcHBseShjb21wb25lbnRSZWYsIGFyZ3MpXG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWRkTWV0aG9kKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgICAgICAgICAgd3JhcHBlcltuYW1lXSA9IGNhbGxiYWNrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgd3JhcHBlcjogRHluYW1pY0FnTmcyQ29tcG9uZW50ID0gbmV3IER5bmFtaWNBZ05nMkNvbXBvbmVudCgpO1xuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlQ29tcG9uZW50PFQ+KGNvbXBvbmVudFR5cGU6IHsgbmV3KC4uLmFyZ3M6IGFueVtdKTogVDsgfSk6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgICAgIC8vIHVzZWQgdG8gY2FjaGUgdGhlIGZhY3RvcnksIGJ1dCB0aGlzIGEpIGNhdXNlZCBpc3N1ZXMgd2hlbiB1c2VkIHdpdGggZWl0aGVyIHdlYnBhY2svYW5ndWxhcmNsaSB3aXRoIC0tcHJvZFxuICAgICAgICAvLyBidXQgbW9yZSBzaWduaWZpY2FudGx5LCB0aGUgdW5kZXJseWluZyBpbXBsZW1lbnRhdGlvbiBvZiByZXNvbHZlQ29tcG9uZW50RmFjdG9yeSB1c2VzIGEgbWFwIHRvbywgc28gdXNcbiAgICAgICAgLy8gY2FjaGluZyB0aGUgZmFjdG9yeSBoZXJlIHlpZWxkcyBubyBwZXJmb3JtYW5jZSBiZW5lZml0c1xuICAgICAgICBsZXQgZmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGNvbXBvbmVudFR5cGUpO1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcbiAgICB9XG59XG5cbmFic3RyYWN0IGNsYXNzIEJhc2VHdWlDb21wb25lbnQ8UCwgVCBleHRlbmRzIEFnRnJhbWV3b3JrQ29tcG9uZW50PFA+PiB7XG4gICAgcHJvdGVjdGVkIF9wYXJhbXM6IFA7XG4gICAgcHJvdGVjdGVkIF9lR3VpOiBIVE1MRWxlbWVudDtcbiAgICBwcm90ZWN0ZWQgX2NvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPFQ+O1xuICAgIHByb3RlY3RlZCBfYWdBd2FyZUNvbXBvbmVudDogVDtcbiAgICBwcm90ZWN0ZWQgX2ZyYW1ld29ya0NvbXBvbmVudEluc3RhbmNlOiBhbnk7ICAvLyB0aGUgdXNlcnMgY29tcG9uZW50IC0gZm9yIGFjY2Vzc2luZyBtZXRob2RzIHRoZXkgY3JlYXRlXG5cbiAgICBwcm90ZWN0ZWQgaW5pdChwYXJhbXM6IFApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcGFyYW1zID0gcGFyYW1zO1xuXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IHRoaXMuY3JlYXRlQ29tcG9uZW50KCk7XG4gICAgICAgIHRoaXMuX2FnQXdhcmVDb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuX2ZyYW1ld29ya0NvbXBvbmVudEluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgICB0aGlzLl9lR3VpID0gdGhpcy5fY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5fYWdBd2FyZUNvbXBvbmVudC5hZ0luaXQodGhpcy5fcGFyYW1zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0R3VpKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VHdWk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuX2ZyYW1ld29ya0NvbXBvbmVudEluc3RhbmNlICYmIHR5cGVvZiB0aGlzLl9mcmFtZXdvcmtDb21wb25lbnRJbnN0YW5jZS5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZXdvcmtDb21wb25lbnRJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2NvbXBvbmVudFJlZikge1xuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50UmVmLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGcmFtZXdvcmtDb21wb25lbnRJbnN0YW5jZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJhbWV3b3JrQ29tcG9uZW50SW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGNyZWF0ZUNvbXBvbmVudCgpOiBDb21wb25lbnRSZWY8VD47XG59XG4iXX0=