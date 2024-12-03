export type ZT = { readonly type: "zero" };
export type AT = { readonly type: "plus", readonly add: PT[] };
export type PT = { readonly type: "sub", readonly arr: T[] };
export type T = ZT | AT | PT;

export const Z: ZT = { type: "zero" };
export const ONE_S: PT = { type: "sub", arr: [Z] };
export const OMEGA_S: PT = { type: "sub", arr: [ONE_S] };
export const LOMEGA_S: PT = { type: "sub", arr: [Z, ONE_S] };
export const IOTA_S: PT = { type: "sub", arr: [Z, Z, ONE_S] };

export function subs(arr: T[]): PT {
    return { type: "sub", arr: arr };
}

// 要素が1個の配列は潰してから返す
export function sanitize_plus_term(add: PT[]): PT | AT {
    if (add.length === 1) {
        return add[0];
    } else {
        return { type: "plus", add: add };
    }
}

// オブジェクトの相等判定
function equal(s: T, t: T): boolean {
    if (s.type === "zero") {
        return t.type === "zero";
    } else if (s.type === "plus") {
        if (t.type !== "plus") return false;
        if (t.add.length !== s.add.length) return false;
        for (let i = 0; i < t.add.length; i++) {
            if (!equal(s.add[i], t.add[i])) return false;
        }
        return true;
    } else {
        if (t.type !== "sub") return false;
        let alpha = [...s.arr];
        let beta = [...t.arr];
        const fillZ = (a: T[],b: T[]) => a.concat(new Array<T>(b.length-a.length).fill(Z));
        if (alpha.length < beta.length) {
            alpha = fillZ(alpha, beta);
        } else if (alpha.length > beta.length) {
            beta = fillZ(beta, alpha);
        }
        for (let k = alpha.length-1; k > -1; k--) {
            if (!equal(alpha[k], beta[k])) return false;
        }
        return true;
    }
}

// s < t を判定
export function lt(s: T, t: T): boolean {
    if (s.type === "zero") {
        return t.type !== "zero";
    } else if (s.type === "sub") {
        if (t.type === "zero") {
            return false;
        } else if (t.type === "sub") {
            let alpha = [...s.arr];
            let beta = [...t.arr];
            const fillZ = (a: T[],b: T[]) => a.concat(new Array<T>(b.length-a.length).fill(Z));
            if (alpha.length < beta.length) {
                alpha = fillZ(alpha, beta);
            } else if (alpha.length > beta.length) {
                beta = fillZ(beta, alpha);
            }
            for (let k = alpha.length-1; k > -1; k--) {
                if (!equal(alpha[k], beta[k])) return lt(alpha[k], beta[k]);
            }
            return false;
        } else {
            return equal(s, t.add[0]) || lt(s, t.add[0]);
        }
    } else {
        if (t.type === "zero") {
            return false;
        } else if (t.type === "sub") {
            return lt(s.add[0], t)
        } else {
            const s2 = sanitize_plus_term(s.add.slice(1));
            const t2 = sanitize_plus_term(t.add.slice(1));
            return lt(s.add[0], t.add[0]) ||
                (equal(s.add[0], t.add[0]) && lt(s2, t2));
        }
    }
}

export function triangle(s: T,t: T): boolean {
    if (s.type === "zero") return true;
    else if (s.type === "plus") {
        const a = s.add[0];
        const b = sanitize_plus_term(s.add.slice(1));
        return triangle(a, t) && triangle(b,t);
    } else {
        for (let i = 0; i < s.arr.length; i++) {
            if (!(lt(s.arr[i], t) && triangle(s.arr[i], t))) return false;
        }
        return true;
    }
}

export function stand(s: T): boolean {
    if (s.type === "zero") return true;
    else if (s.type === "plus") {
        const [s0, s1] = [s.add[0], sanitize_plus_term(s.add.slice(1))];
        if (s1.type === "plus") {
            const s10 = s1.add[0];
            return stand(s0) && stand(s1) && (equal(s10, s0) || lt(s10, s0));
        }
        return stand(s0) && stand(s1) && (equal(s1, s0) || lt(s1, s0));
    } else {
        for (let i = 0; i < s.arr.length; i++) {
            if (!(stand(s.arr[i]) && triangle(s.arr[i], s.arr[i]))) return false;
        }
        return true;
    }
}