"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundImage = void 0;
const image_1 = require("../../scene/image");
class BackgroundImage {
    constructor() {
        this._image = document.createElement('img');
        this.loadedSynchronously = true;
        this.left = undefined;
        this.top = undefined;
        this.right = undefined;
        this.bottom = undefined;
        this.width = undefined;
        this.height = undefined;
        this.opacity = 1;
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.onload = undefined;
        this.onImageLoad = () => {
            if (this.loadedSynchronously) {
                return;
            }
            this.node.visible = false; // Ensure marked dirty.
            this.performLayout(this.containerWidth, this.containerHeight);
            if (this.onload) {
                this.onload();
            }
        };
        this.node = new image_1.Image(this._image);
        this._image.onload = this.onImageLoad;
    }
    get url() {
        return this._image.src;
    }
    set url(value) {
        this._image.src = value;
        this.loadedSynchronously = this.complete;
    }
    get complete() {
        // In tests image is nodejs-canvas Image, which doesn't report its status in the 'complete' method correctly.
        return this._image.width > 0 && this._image.height > 0;
    }
    performLayout(containerWidth, containerHeight) {
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        if (!this.complete) {
            this.node.visible = false;
            return;
        }
        const position = this.calculatePosition(this._image.width, this._image.height);
        Object.assign(this.node, position);
        this.node.visible = true;
        this.node.opacity = this.opacity;
    }
    calculatePosition(naturalWidth, naturalHeight) {
        let left = this.left;
        let right = this.right;
        let width = this.width;
        let top = this.top;
        let bottom = this.bottom;
        let height = this.height;
        if (left != null) {
            if (right != null) {
                width = this.containerWidth - left - right;
            }
            else if (width != null) {
                right = this.containerWidth - left + width;
            }
        }
        else if (right != null) {
            if (width != null) {
                left = this.containerWidth - right - width;
            }
        }
        if (top != null) {
            if (bottom != null) {
                height = this.containerHeight - bottom - top;
            }
            else if (height != null) {
                bottom = this.containerHeight - top - height;
            }
        }
        else if (bottom != null) {
            if (height != null) {
                top = this.containerHeight - bottom - height;
            }
        }
        // If width and height still undetermined, derive them from natural size.
        if (width == null) {
            if (height == null) {
                width = naturalWidth;
                height = naturalHeight;
            }
            else {
                width = Math.ceil((naturalWidth * height) / naturalHeight);
            }
        }
        else if (height == null) {
            height = Math.ceil((naturalHeight * width) / naturalWidth);
        }
        if (left == null) {
            if (right == null) {
                left = Math.floor((this.containerWidth - width) / 2);
            }
            else {
                left = this.containerWidth - right - width;
            }
        }
        if (top == null) {
            if (bottom == null) {
                top = Math.floor((this.containerHeight - height) / 2);
            }
            else {
                top = this.containerHeight - height - bottom;
            }
        }
        return { x: left, y: top, width, height };
    }
}
exports.BackgroundImage = BackgroundImage;
