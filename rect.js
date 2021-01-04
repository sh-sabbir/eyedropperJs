var Rect = /** @class */ (function () {
    function Rect(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.right = left + width;
        this.bottom = top + height;
        this.width = width;
        this.height = height;
    }
    Rect.prototype.transposed = function () {
        return new Rect(this.top, this.left, this.height, this.width);
    };
    Rect.prototype.contains = function (other) {
        return (other.left >= this.left &&
            other.right <= this.right &&
            other.top >= this.top &&
            other.bottom <= this.bottom);
    };
    Rect.prototype.horizontalMerge = function (other) {
        var A = this.transposed();
        var B = other.transposed();
        var X = A.verticalMerge(B);
        if (X === null) {
            return null;
        }
        return X.transposed();
    };
    Rect.prototype.verticalMerge = function (other) {
        var _a;
        var A = this;
        var B = other;
        // swap A and B if A is not on top
        if (this.top > other.top) {
            ;
            _a = [B, A], A = _a[0], B = _a[1];
        }
        // if A is overlapping with B
        if (A.bottom >= B.top && A.bottom <= B.bottom) {
            return new Rect(A.left, A.top, A.right - A.left, B.bottom - A.top);
        }
        else {
            return null;
        }
    };
    Rect.prototype.merge = function (other) {
        var x, y, w, h;
        // same left and right
        if (this.left == other.left && this.right == other.right) {
            return this.verticalMerge(other);
            // same top and bottom
        }
        else if (this.top == other.top && this.bottom == other.bottom) {
            return this.horizontalMerge(other);
        }
        return null;
    };
    Rect.prototype.toString = function () {
        return "Rect(" + this.width + "x" + this.height + ")@" + this.left + "," + this.top;
    };
    return Rect;
}());
export default Rect;
