var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e5) {
    throw err = [e5], e5;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
    if (decorator = decorators[i5])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/css-tag.js
var t, e, s, o, n, r, i, S, c;
var init_css_tag = __esm({
  "node_modules/@lit/reactive-element/css-tag.js"() {
    t = globalThis;
    e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
    s = /* @__PURE__ */ Symbol();
    o = /* @__PURE__ */ new WeakMap();
    n = class {
      constructor(t4, e5, o6) {
        if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t4, this.t = e5;
      }
      get styleSheet() {
        let t4 = this.o;
        const s4 = this.t;
        if (e && void 0 === t4) {
          const e5 = void 0 !== s4 && 1 === s4.length;
          e5 && (t4 = o.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
        }
        return t4;
      }
      toString() {
        return this.cssText;
      }
    };
    r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
    i = (t4, ...e5) => {
      const o6 = 1 === t4.length ? t4[0] : e5.reduce((e6, s4, o7) => e6 + ((t5) => {
        if (true === t5._$cssResult$) return t5.cssText;
        if ("number" == typeof t5) return t5;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(s4) + t4[o7 + 1], t4[0]);
      return new n(o6, t4, s);
    };
    S = (s4, o6) => {
      if (e) s4.adoptedStyleSheets = o6.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
      else for (const e5 of o6) {
        const o7 = document.createElement("style"), n5 = t.litNonce;
        void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e5.cssText, s4.appendChild(o7);
      }
    };
    c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
      let e5 = "";
      for (const s4 of t5.cssRules) e5 += s4.cssText;
      return r(e5);
    })(t4) : t4;
  }
});

// node_modules/@lit/reactive-element/reactive-element.js
var i2, e2, h, r2, o2, n2, a, c2, l, p, d, u, f, b, y;
var init_reactive_element = __esm({
  "node_modules/@lit/reactive-element/reactive-element.js"() {
    init_css_tag();
    init_css_tag();
    ({ is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object);
    a = globalThis;
    c2 = a.trustedTypes;
    l = c2 ? c2.emptyScript : "";
    p = a.reactiveElementPolyfillSupport;
    d = (t4, s4) => t4;
    u = { toAttribute(t4, s4) {
      switch (s4) {
        case Boolean:
          t4 = t4 ? l : null;
          break;
        case Object:
        case Array:
          t4 = null == t4 ? t4 : JSON.stringify(t4);
      }
      return t4;
    }, fromAttribute(t4, s4) {
      let i5 = t4;
      switch (s4) {
        case Boolean:
          i5 = null !== t4;
          break;
        case Number:
          i5 = null === t4 ? null : Number(t4);
          break;
        case Object:
        case Array:
          try {
            i5 = JSON.parse(t4);
          } catch (t5) {
            i5 = null;
          }
      }
      return i5;
    } };
    f = (t4, s4) => !i2(t4, s4);
    b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
    Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
    y = class extends HTMLElement {
      static addInitializer(t4) {
        this._$Ei(), (this.l ??= []).push(t4);
      }
      static get observedAttributes() {
        return this.finalize(), this._$Eh && [...this._$Eh.keys()];
      }
      static createProperty(t4, s4 = b) {
        if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t4) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t4, s4), !s4.noAccessor) {
          const i5 = /* @__PURE__ */ Symbol(), h3 = this.getPropertyDescriptor(t4, i5, s4);
          void 0 !== h3 && e2(this.prototype, t4, h3);
        }
      }
      static getPropertyDescriptor(t4, s4, i5) {
        const { get: e5, set: r6 } = h(this.prototype, t4) ?? { get() {
          return this[s4];
        }, set(t5) {
          this[s4] = t5;
        } };
        return { get: e5, set(s5) {
          const h3 = e5?.call(this);
          r6?.call(this, s5), this.requestUpdate(t4, h3, i5);
        }, configurable: true, enumerable: true };
      }
      static getPropertyOptions(t4) {
        return this.elementProperties.get(t4) ?? b;
      }
      static _$Ei() {
        if (this.hasOwnProperty(d("elementProperties"))) return;
        const t4 = n2(this);
        t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
      }
      static finalize() {
        if (this.hasOwnProperty(d("finalized"))) return;
        if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
          const t5 = this.properties, s4 = [...r2(t5), ...o2(t5)];
          for (const i5 of s4) this.createProperty(i5, t5[i5]);
        }
        const t4 = this[Symbol.metadata];
        if (null !== t4) {
          const s4 = litPropertyMetadata.get(t4);
          if (void 0 !== s4) for (const [t5, i5] of s4) this.elementProperties.set(t5, i5);
        }
        this._$Eh = /* @__PURE__ */ new Map();
        for (const [t5, s4] of this.elementProperties) {
          const i5 = this._$Eu(t5, s4);
          void 0 !== i5 && this._$Eh.set(i5, t5);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
      }
      static finalizeStyles(s4) {
        const i5 = [];
        if (Array.isArray(s4)) {
          const e5 = new Set(s4.flat(1 / 0).reverse());
          for (const s5 of e5) i5.unshift(c(s5));
        } else void 0 !== s4 && i5.push(c(s4));
        return i5;
      }
      static _$Eu(t4, s4) {
        const i5 = s4.attribute;
        return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
      }
      constructor() {
        super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
      }
      _$Ev() {
        this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
      }
      addController(t4) {
        (this._$EO ??= /* @__PURE__ */ new Set()).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
      }
      removeController(t4) {
        this._$EO?.delete(t4);
      }
      _$E_() {
        const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
        for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t4.set(i5, this[i5]), delete this[i5]);
        t4.size > 0 && (this._$Ep = t4);
      }
      createRenderRoot() {
        const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return S(t4, this.constructor.elementStyles), t4;
      }
      connectedCallback() {
        this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
      }
      enableUpdating(t4) {
      }
      disconnectedCallback() {
        this._$EO?.forEach((t4) => t4.hostDisconnected?.());
      }
      attributeChangedCallback(t4, s4, i5) {
        this._$AK(t4, i5);
      }
      _$ET(t4, s4) {
        const i5 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i5);
        if (void 0 !== e5 && true === i5.reflect) {
          const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
          this._$Em = t4, null == h3 ? this.removeAttribute(e5) : this.setAttribute(e5, h3), this._$Em = null;
        }
      }
      _$AK(t4, s4) {
        const i5 = this.constructor, e5 = i5._$Eh.get(t4);
        if (void 0 !== e5 && this._$Em !== e5) {
          const t5 = i5.getPropertyOptions(e5), h3 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
          this._$Em = e5;
          const r6 = h3.fromAttribute(s4, t5.type);
          this[e5] = r6 ?? this._$Ej?.get(e5) ?? r6, this._$Em = null;
        }
      }
      requestUpdate(t4, s4, i5, e5 = false, h3) {
        if (void 0 !== t4) {
          const r6 = this.constructor;
          if (false === e5 && (h3 = this[t4]), i5 ??= r6.getPropertyOptions(t4), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t4) && !this.hasAttribute(r6._$Eu(t4, i5)))) return;
          this.C(t4, s4, i5);
        }
        false === this.isUpdatePending && (this._$ES = this._$EP());
      }
      C(t4, s4, { useDefault: i5, reflect: e5, wrapped: h3 }, r6) {
        i5 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t4) && (this._$Ej.set(t4, r6 ?? s4 ?? this[t4]), true !== h3 || void 0 !== r6) || (this._$AL.has(t4) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t4, s4)), true === e5 && this._$Em !== t4 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t4));
      }
      async _$EP() {
        this.isUpdatePending = true;
        try {
          await this._$ES;
        } catch (t5) {
          Promise.reject(t5);
        }
        const t4 = this.scheduleUpdate();
        return null != t4 && await t4, !this.isUpdatePending;
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
          if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
            for (const [t6, s5] of this._$Ep) this[t6] = s5;
            this._$Ep = void 0;
          }
          const t5 = this.constructor.elementProperties;
          if (t5.size > 0) for (const [s5, i5] of t5) {
            const { wrapped: t6 } = i5, e5 = this[s5];
            true !== t6 || this._$AL.has(s5) || void 0 === e5 || this.C(s5, void 0, i5, e5);
          }
        }
        let t4 = false;
        const s4 = this._$AL;
        try {
          t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s4)) : this._$EM();
        } catch (s5) {
          throw t4 = false, this._$EM(), s5;
        }
        t4 && this._$AE(s4);
      }
      willUpdate(t4) {
      }
      _$AE(t4) {
        this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
      }
      _$EM() {
        this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
      }
      get updateComplete() {
        return this.getUpdateComplete();
      }
      getUpdateComplete() {
        return this._$ES;
      }
      shouldUpdate(t4) {
        return true;
      }
      update(t4) {
        this._$Eq &&= this._$Eq.forEach((t5) => this._$ET(t5, this[t5])), this._$EM();
      }
      updated(t4) {
      }
      firstUpdated(t4) {
      }
    };
    y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");
  }
});

// node_modules/lit-html/lit-html.js
function V(t4, i5) {
  if (!u2(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i5) : i5;
}
function M(t4, i5, s4 = t4, e5) {
  if (i5 === E) return i5;
  let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
  const o6 = a2(i5) ? void 0 : i5._$litDirective$;
  return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t4), h3._$AT(t4, s4, e5)), void 0 !== e5 ? (s4._$Co ??= [])[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = M(t4, h3._$AS(t4, i5.values), h3, e5)), i5;
}
var t2, i3, s2, e3, h2, o3, n3, r3, l2, c3, a2, u2, d2, f2, v, _, m, p2, g, $, y2, x, b2, w, T, E, A, C, P, N, S2, R, k, H, I, L, z, Z, B, D;
var init_lit_html = __esm({
  "node_modules/lit-html/lit-html.js"() {
    t2 = globalThis;
    i3 = (t4) => t4;
    s2 = t2.trustedTypes;
    e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
    h2 = "$lit$";
    o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
    n3 = "?" + o3;
    r3 = `<${n3}>`;
    l2 = document;
    c3 = () => l2.createComment("");
    a2 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
    u2 = Array.isArray;
    d2 = (t4) => u2(t4) || "function" == typeof t4?.[Symbol.iterator];
    f2 = "[ 	\n\f\r]";
    v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
    _ = /-->/g;
    m = />/g;
    p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
    g = /'/g;
    $ = /"/g;
    y2 = /^(?:script|style|textarea|title)$/i;
    x = (t4) => (i5, ...s4) => ({ _$litType$: t4, strings: i5, values: s4 });
    b2 = x(1);
    w = x(2);
    T = x(3);
    E = /* @__PURE__ */ Symbol.for("lit-noChange");
    A = /* @__PURE__ */ Symbol.for("lit-nothing");
    C = /* @__PURE__ */ new WeakMap();
    P = l2.createTreeWalker(l2, 129);
    N = (t4, i5) => {
      const s4 = t4.length - 1, e5 = [];
      let n5, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = v;
      for (let i6 = 0; i6 < s4; i6++) {
        const s5 = t4[i6];
        let a3, u3, d3 = -1, f3 = 0;
        for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
        const x2 = c4 === p2 && t4[i6 + 1].startsWith("/>") ? " " : "";
        l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e5.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i6 : x2);
      }
      return [V(t4, l3 + (t4[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), e5];
    };
    S2 = class _S {
      constructor({ strings: t4, _$litType$: i5 }, e5) {
        let r6;
        this.parts = [];
        let l3 = 0, a3 = 0;
        const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = N(t4, i5);
        if (this.el = _S.createElement(f3, e5), P.currentNode = this.el.content, 2 === i5 || 3 === i5) {
          const t5 = this.el.content.firstChild;
          t5.replaceWith(...t5.childNodes);
        }
        for (; null !== (r6 = P.nextNode()) && d3.length < u3; ) {
          if (1 === r6.nodeType) {
            if (r6.hasAttributes()) for (const t5 of r6.getAttributeNames()) if (t5.endsWith(h2)) {
              const i6 = v2[a3++], s4 = r6.getAttribute(t5).split(o3), e6 = /([.?@])?(.*)/.exec(i6);
              d3.push({ type: 1, index: l3, name: e6[2], strings: s4, ctor: "." === e6[1] ? I : "?" === e6[1] ? L : "@" === e6[1] ? z : H }), r6.removeAttribute(t5);
            } else t5.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t5));
            if (y2.test(r6.tagName)) {
              const t5 = r6.textContent.split(o3), i6 = t5.length - 1;
              if (i6 > 0) {
                r6.textContent = s2 ? s2.emptyScript : "";
                for (let s4 = 0; s4 < i6; s4++) r6.append(t5[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
                r6.append(t5[i6], c3());
              }
            }
          } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
          else {
            let t5 = -1;
            for (; -1 !== (t5 = r6.data.indexOf(o3, t5 + 1)); ) d3.push({ type: 7, index: l3 }), t5 += o3.length - 1;
          }
          l3++;
        }
      }
      static createElement(t4, i5) {
        const s4 = l2.createElement("template");
        return s4.innerHTML = t4, s4;
      }
    };
    R = class {
      constructor(t4, i5) {
        this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i5;
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      u(t4) {
        const { el: { content: i5 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? l2).importNode(i5, true);
        P.currentNode = e5;
        let h3 = P.nextNode(), o6 = 0, n5 = 0, r6 = s4[0];
        for (; void 0 !== r6; ) {
          if (o6 === r6.index) {
            let i6;
            2 === r6.type ? i6 = new k(h3, h3.nextSibling, this, t4) : 1 === r6.type ? i6 = new r6.ctor(h3, r6.name, r6.strings, this, t4) : 6 === r6.type && (i6 = new Z(h3, this, t4)), this._$AV.push(i6), r6 = s4[++n5];
          }
          o6 !== r6?.index && (h3 = P.nextNode(), o6++);
        }
        return P.currentNode = l2, e5;
      }
      p(t4) {
        let i5 = 0;
        for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t4, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t4[i5])), i5++;
      }
    };
    k = class _k {
      get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
      }
      constructor(t4, i5, s4, e5) {
        this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t4, this._$AB = i5, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
      }
      get parentNode() {
        let t4 = this._$AA.parentNode;
        const i5 = this._$AM;
        return void 0 !== i5 && 11 === t4?.nodeType && (t4 = i5.parentNode), t4;
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(t4, i5 = this) {
        t4 = M(this, t4, i5), a2(t4) ? t4 === A || null == t4 || "" === t4 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t4 !== this._$AH && t4 !== E && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : d2(t4) ? this.k(t4) : this._(t4);
      }
      O(t4) {
        return this._$AA.parentNode.insertBefore(t4, this._$AB);
      }
      T(t4) {
        this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
      }
      _(t4) {
        this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(l2.createTextNode(t4)), this._$AH = t4;
      }
      $(t4) {
        const { values: i5, _$litType$: s4 } = t4, e5 = "number" == typeof s4 ? this._$AC(t4) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
        if (this._$AH?._$AD === e5) this._$AH.p(i5);
        else {
          const t5 = new R(e5, this), s5 = t5.u(this.options);
          t5.p(i5), this.T(s5), this._$AH = t5;
        }
      }
      _$AC(t4) {
        let i5 = C.get(t4.strings);
        return void 0 === i5 && C.set(t4.strings, i5 = new S2(t4)), i5;
      }
      k(t4) {
        u2(this._$AH) || (this._$AH = [], this._$AR());
        const i5 = this._$AH;
        let s4, e5 = 0;
        for (const h3 of t4) e5 === i5.length ? i5.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i5[e5], s4._$AI(h3), e5++;
        e5 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i5.length = e5);
      }
      _$AR(t4 = this._$AA.nextSibling, s4) {
        for (this._$AP?.(false, true, s4); t4 !== this._$AB; ) {
          const s5 = i3(t4).nextSibling;
          i3(t4).remove(), t4 = s5;
        }
      }
      setConnected(t4) {
        void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
      }
    };
    H = class {
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      constructor(t4, i5, s4, e5, h3) {
        this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t4, this.name = i5, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
      }
      _$AI(t4, i5 = this, s4, e5) {
        const h3 = this.strings;
        let o6 = false;
        if (void 0 === h3) t4 = M(this, t4, i5, 0), o6 = !a2(t4) || t4 !== this._$AH && t4 !== E, o6 && (this._$AH = t4);
        else {
          const e6 = t4;
          let n5, r6;
          for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r6 = M(this, e6[s4 + n5], i5, n5), r6 === E && (r6 = this._$AH[n5]), o6 ||= !a2(r6) || r6 !== this._$AH[n5], r6 === A ? t4 = A : t4 !== A && (t4 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
        }
        o6 && !e5 && this.j(t4);
      }
      j(t4) {
        t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
      }
    };
    I = class extends H {
      constructor() {
        super(...arguments), this.type = 3;
      }
      j(t4) {
        this.element[this.name] = t4 === A ? void 0 : t4;
      }
    };
    L = class extends H {
      constructor() {
        super(...arguments), this.type = 4;
      }
      j(t4) {
        this.element.toggleAttribute(this.name, !!t4 && t4 !== A);
      }
    };
    z = class extends H {
      constructor(t4, i5, s4, e5, h3) {
        super(t4, i5, s4, e5, h3), this.type = 5;
      }
      _$AI(t4, i5 = this) {
        if ((t4 = M(this, t4, i5, 0) ?? A) === E) return;
        const s4 = this._$AH, e5 = t4 === A && s4 !== A || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== A && (s4 === A || e5);
        e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
      }
      handleEvent(t4) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
      }
    };
    Z = class {
      constructor(t4, i5, s4) {
        this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(t4) {
        M(this, t4);
      }
    };
    B = t2.litHtmlPolyfillSupport;
    B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
    D = (t4, i5, s4) => {
      const e5 = s4?.renderBefore ?? i5;
      let h3 = e5._$litPart$;
      if (void 0 === h3) {
        const t5 = s4?.renderBefore ?? null;
        e5._$litPart$ = h3 = new k(i5.insertBefore(c3(), t5), t5, void 0, s4 ?? {});
      }
      return h3._$AI(t4), h3;
    };
  }
});

// node_modules/lit-element/lit-element.js
var s3, i4, o4;
var init_lit_element = __esm({
  "node_modules/lit-element/lit-element.js"() {
    init_reactive_element();
    init_reactive_element();
    init_lit_html();
    init_lit_html();
    s3 = globalThis;
    i4 = class extends y {
      constructor() {
        super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
      }
      createRenderRoot() {
        const t4 = super.createRenderRoot();
        return this.renderOptions.renderBefore ??= t4.firstChild, t4;
      }
      update(t4) {
        const r6 = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = D(r6, this.renderRoot, this.renderOptions);
      }
      connectedCallback() {
        super.connectedCallback(), this._$Do?.setConnected(true);
      }
      disconnectedCallback() {
        super.disconnectedCallback(), this._$Do?.setConnected(false);
      }
      render() {
        return E;
      }
    };
    i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
    o4 = s3.litElementPolyfillSupport;
    o4?.({ LitElement: i4 });
    (s3.litElementVersions ??= []).push("4.2.2");
  }
});

// node_modules/lit-html/is-server.js
var init_is_server = __esm({
  "node_modules/lit-html/is-server.js"() {
  }
});

// node_modules/lit/index.js
var init_lit = __esm({
  "node_modules/lit/index.js"() {
    init_reactive_element();
    init_lit_html();
    init_lit_element();
    init_is_server();
  }
});

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3;
var init_custom_element = __esm({
  "node_modules/@lit/reactive-element/decorators/custom-element.js"() {
    t3 = (t4) => (e5, o6) => {
      void 0 !== o6 ? o6.addInitializer(() => {
        customElements.define(t4, e5);
      }) : customElements.define(t4, e5);
    };
  }
});

// node_modules/@lit/reactive-element/decorators/property.js
function n4(t4) {
  return (e5, o6) => "object" == typeof o6 ? r4(t4, e5, o6) : ((t5, e6, o7) => {
    const r6 = e6.hasOwnProperty(o7);
    return e6.constructor.createProperty(o7, t5), r6 ? Object.getOwnPropertyDescriptor(e6, o7) : void 0;
  })(t4, e5, o6);
}
var o5, r4;
var init_property = __esm({
  "node_modules/@lit/reactive-element/decorators/property.js"() {
    init_reactive_element();
    o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
    r4 = (t4 = o5, e5, r6) => {
      const { kind: n5, metadata: i5 } = r6;
      let s4 = globalThis.litPropertyMetadata.get(i5);
      if (void 0 === s4 && globalThis.litPropertyMetadata.set(i5, s4 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t4 = Object.create(t4)).wrapped = true), s4.set(r6.name, t4), "accessor" === n5) {
        const { name: o6 } = r6;
        return { set(r7) {
          const n6 = e5.get.call(this);
          e5.set.call(this, r7), this.requestUpdate(o6, n6, t4, true, r7);
        }, init(e6) {
          return void 0 !== e6 && this.C(o6, void 0, t4, e6), e6;
        } };
      }
      if ("setter" === n5) {
        const { name: o6 } = r6;
        return function(r7) {
          const n6 = this[o6];
          e5.call(this, r7), this.requestUpdate(o6, n6, t4, true, r7);
        };
      }
      throw Error("Unsupported decorator location: " + n5);
    };
  }
});

// node_modules/@lit/reactive-element/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}
var init_state = __esm({
  "node_modules/@lit/reactive-element/decorators/state.js"() {
    init_property();
  }
});

// node_modules/@lit/reactive-element/decorators/event-options.js
var init_event_options = __esm({
  "node_modules/@lit/reactive-element/decorators/event-options.js"() {
  }
});

// node_modules/@lit/reactive-element/decorators/base.js
var init_base = __esm({
  "node_modules/@lit/reactive-element/decorators/base.js"() {
  }
});

// node_modules/@lit/reactive-element/decorators/query.js
var init_query = __esm({
  "node_modules/@lit/reactive-element/decorators/query.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-all.js
var init_query_all = __esm({
  "node_modules/@lit/reactive-element/decorators/query-all.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-async.js
var init_query_async = __esm({
  "node_modules/@lit/reactive-element/decorators/query-async.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var init_query_assigned_elements = __esm({
  "node_modules/@lit/reactive-element/decorators/query-assigned-elements.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
var init_query_assigned_nodes = __esm({
  "node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js"() {
    init_base();
  }
});

// node_modules/lit/decorators.js
var init_decorators = __esm({
  "node_modules/lit/decorators.js"() {
    init_custom_element();
    init_property();
    init_state();
    init_event_options();
    init_query();
    init_query_all();
    init_query_async();
    init_query_assigned_elements();
    init_query_assigned_nodes();
  }
});

// src/config.ts
var DEFAULT_VIEWS, DEFAULT_CONFIG, normalizeConfig, THEME_PRESETS, monthGridDays, gridDaysForView, dateRangeForView;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    DEFAULT_VIEWS = [
      "day",
      "3day",
      "week",
      "work_week",
      "month",
      "agenda",
      "timeline"
    ];
    DEFAULT_CONFIG = {
      title: "Family Hub Calendar",
      default_view: "week",
      enabled_views: DEFAULT_VIEWS,
      grouped_by_calendar: false,
      weather_placement: "header",
      week_start_day: 1,
      time_format: "12h",
      font_size: "medium",
      show_header: true,
      show_sidebar: true,
      show_weather: true,
      show_tasks: true,
      show_meals: true,
      event_density: "comfortable",
      compact_mode: false,
      border_radius: 16,
      show_empty_days: true,
      theme_preset: "auto",
      layout_orientation: "vertical",
      theme_colors: {
        background: "var(--ha-card-background, #111827)",
        surface: "var(--card-background-color, #1f2937)",
        text: "var(--primary-text-color, #f9fafb)",
        accent: "var(--primary-color, #60a5fa)"
      },
      family_member_colors: {}
    };
    normalizeConfig = (config) => {
      if (!config.calendars || config.calendars.length === 0) {
        throw new Error("You need to define at least one calendar in calendars");
      }
      return {
        ...DEFAULT_CONFIG,
        ...config,
        enabled_views: config.enabled_views?.length ? config.enabled_views : DEFAULT_VIEWS,
        calendars: config.calendars.map((calendar) => ({
          ...calendar,
          enabled: calendar.enabled !== false
        }))
      };
    };
    THEME_PRESETS = [
      {
        id: "auto",
        label: "Home Assistant (auto)",
        colors: {
          background: "var(--ha-card-background, var(--card-background-color))",
          surface: "var(--card-background-color, #1f2937)",
          text: "var(--primary-text-color)",
          accent: "var(--primary-color)"
        }
      },
      {
        id: "midnight",
        label: "Midnight",
        colors: { background: "#0f172a", surface: "#1e293b", text: "#f8fafc", accent: "#60a5fa" }
      },
      {
        id: "light",
        label: "Light",
        colors: { background: "#ffffff", surface: "#f3f4f6", text: "#111827", accent: "#2563eb" }
      },
      {
        id: "sunset",
        label: "Sunset",
        colors: { background: "#1a1025", surface: "#2d1b3d", text: "#fde8ff", accent: "#fb7185" }
      },
      {
        id: "forest",
        label: "Forest",
        colors: { background: "#0f1f17", surface: "#173328", text: "#e6f4ea", accent: "#34d399" }
      },
      {
        id: "ocean",
        label: "Ocean",
        colors: { background: "#071a2b", surface: "#0f2a44", text: "#e0f2fe", accent: "#38bdf8" }
      }
    ];
    monthGridDays = (selectedDate, weekStartDay, includeAdjacentMonths = true) => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstOfMonth = new Date(year, month, 1);
      const lastOfMonth = new Date(year, month + 1, 0);
      const diffToStart = (firstOfMonth.getDay() - weekStartDay + 7) % 7;
      const gridStart = new Date(firstOfMonth);
      gridStart.setDate(firstOfMonth.getDate() - diffToStart);
      const weekEndDay = (weekStartDay + 6) % 7;
      const diffToEnd = (weekEndDay - lastOfMonth.getDay() + 7) % 7;
      const gridEnd = new Date(lastOfMonth);
      gridEnd.setDate(lastOfMonth.getDate() + diffToEnd);
      const days = [];
      const cursor = new Date(gridStart);
      cursor.setHours(0, 0, 0, 0);
      const last = new Date(gridEnd);
      last.setHours(0, 0, 0, 0);
      while (cursor <= last) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      return includeAdjacentMonths ? days : days.filter((day) => day.getMonth() === month);
    };
    gridDaysForView = (selectedDate, view, weekStartDay) => {
      const { start, end } = dateRangeForView(selectedDate, view, weekStartDay);
      const days = [];
      const cursor = new Date(start);
      cursor.setHours(0, 0, 0, 0);
      const last = new Date(end);
      last.setHours(0, 0, 0, 0);
      while (cursor <= last) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      return days;
    };
    dateRangeForView = (selectedDate, view, weekStartDay) => {
      const start = new Date(selectedDate);
      const end = new Date(selectedDate);
      if (view === "day" || view === "agenda" || view === "timeline") {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      if (view === "3day") {
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 2);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      if (view === "month") {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      const day = selectedDate.getDay();
      const diffToStart = (day - weekStartDay + 7) % 7;
      start.setDate(selectedDate.getDate() - diffToStart);
      start.setHours(0, 0, 0, 0);
      const length = view === "work_week" ? 4 : 6;
      end.setTime(start.getTime());
      end.setDate(start.getDate() + length);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };
  }
});

// src/family-hub-calendar-editor.ts
var family_hub_calendar_editor_exports = {};
__export(family_hub_calendar_editor_exports, {
  FamilyHubCalendarEditor: () => FamilyHubCalendarEditor
});
var VIEW_OPTIONS, LANGUAGE_OPTIONS, WEEK_START_OPTIONS, TIME_FORMAT_OPTIONS, FONT_SIZE_OPTIONS, DENSITY_OPTIONS, WEATHER_PLACEMENT_OPTIONS, ORIENTATION_OPTIONS, PALETTE, LABELS, MAIN_SCHEMA, THEME_FIELDS, familyMemberCounter, FamilyHubCalendarEditor;
var init_family_hub_calendar_editor = __esm({
  "src/family-hub-calendar-editor.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_config();
    VIEW_OPTIONS = [
      { value: "day", label: "Day" },
      { value: "3day", label: "3-Day" },
      { value: "week", label: "Week" },
      { value: "work_week", label: "Work Week" },
      { value: "month", label: "Month" },
      { value: "agenda", label: "Agenda" },
      { value: "timeline", label: "Timeline" }
    ];
    LANGUAGE_OPTIONS = [
      { value: "en", label: "English" },
      { value: "fr", label: "Fran\xE7ais" }
    ];
    WEEK_START_OPTIONS = [
      { value: "1", label: "Monday" },
      { value: "0", label: "Sunday" }
    ];
    TIME_FORMAT_OPTIONS = [
      { value: "12h", label: "12-hour" },
      { value: "24h", label: "24-hour" }
    ];
    FONT_SIZE_OPTIONS = [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" }
    ];
    DENSITY_OPTIONS = [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "large", label: "Large (big display)" },
      { value: "extra_large", label: "Extra large (big display)" }
    ];
    WEATHER_PLACEMENT_OPTIONS = [
      { value: "header", label: "Header" },
      { value: "sidebar", label: "Sidebar" },
      { value: "day_cell", label: "Day cell" },
      { value: "agenda", label: "Agenda" }
    ];
    ORIENTATION_OPTIONS = [
      { value: "vertical", label: "Vertical" },
      { value: "horizontal", label: "Horizontal" }
    ];
    PALETTE = ["#4F86F7", "#4CAF50", "#FF9800", "#7E57C2", "#F06292", "#26A69A", "#EF4444", "#FBBF24"];
    LABELS = {
      title: "Title",
      default_view: "Default view",
      enabled_views: "Enabled views",
      language: "Language",
      week_start_day: "Week starts on",
      time_format: "Time format",
      font_size: "Font size",
      font_family: "Font family",
      border_radius: "Corner radius",
      event_density: "Event density",
      weather_entity: "Weather entity",
      weather_placement: "Weather placement",
      task_entities: "Task (to-do) entities",
      meal_entities: "Meal plan entities",
      show_header: "Show header",
      show_sidebar: "Show sidebar",
      show_weather: "Show weather",
      show_tasks: "Show tasks",
      show_meals: "Show meals",
      compact_mode: "Compact mode",
      grouped_by_calendar: "Group events by calendar",
      show_empty_days: "Show adjacent month days in month grid",
      layout_orientation: "Default layout orientation"
    };
    MAIN_SCHEMA = [
      { name: "title", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "default_view", selector: { select: { mode: "dropdown", options: VIEW_OPTIONS } } },
          { name: "language", selector: { select: { mode: "dropdown", options: LANGUAGE_OPTIONS } } }
        ]
      },
      { name: "enabled_views", selector: { select: { multiple: true, mode: "list", options: VIEW_OPTIONS } } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "week_start_day", selector: { select: { mode: "dropdown", options: WEEK_START_OPTIONS } } },
          { name: "time_format", selector: { select: { mode: "dropdown", options: TIME_FORMAT_OPTIONS } } },
          { name: "font_size", selector: { select: { mode: "dropdown", options: FONT_SIZE_OPTIONS } } },
          { name: "event_density", selector: { select: { mode: "dropdown", options: DENSITY_OPTIONS } } },
          { name: "layout_orientation", selector: { select: { mode: "dropdown", options: ORIENTATION_OPTIONS } } }
        ]
      },
      { name: "font_family", selector: { text: {} } },
      { name: "border_radius", selector: { number: { min: 0, max: 32, step: 1, mode: "slider" } } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "show_header", selector: { boolean: {} } },
          { name: "show_sidebar", selector: { boolean: {} } },
          { name: "show_weather", selector: { boolean: {} } },
          { name: "show_tasks", selector: { boolean: {} } },
          { name: "show_meals", selector: { boolean: {} } },
          { name: "compact_mode", selector: { boolean: {} } },
          { name: "grouped_by_calendar", selector: { boolean: {} } },
          { name: "show_empty_days", selector: { boolean: {} } }
        ]
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "weather_entity", selector: { entity: { domain: "weather" } } },
          { name: "weather_placement", selector: { select: { mode: "dropdown", options: WEATHER_PLACEMENT_OPTIONS } } }
        ]
      },
      { name: "task_entities", selector: { entity: { multiple: true, domain: "todo" } } },
      { name: "meal_entities", selector: { entity: { multiple: true } } }
    ];
    THEME_FIELDS = [
      { key: "background", label: "Background" },
      { key: "surface", label: "Surface" },
      { key: "text", label: "Text" },
      { key: "accent", label: "Accent" }
    ];
    familyMemberCounter = 0;
    FamilyHubCalendarEditor = class extends i4 {
      constructor() {
        super(...arguments);
        this.newCalendarEntity = "";
        this.computeLabel = (schema) => LABELS[schema.name] ?? schema.name;
      }
      setConfig(config) {
        this.config = normalizeConfig(config);
      }
      updateValue(key, value) {
        if (!this.config) return;
        const next = {
          ...this.config,
          [key]: value
        };
        this.config = next;
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config: next },
            bubbles: true,
            composed: true
          })
        );
      }
      onFormChanged(event) {
        if (!this.config) return;
        const value = event.detail.value;
        const next = { ...this.config, ...value };
        this.config = next;
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config: next },
            bubbles: true,
            composed: true
          })
        );
      }
      formData() {
        if (!this.config) return {};
        const data = {};
        const collect = (schema) => {
          schema.forEach((entry) => {
            if (entry.type === "grid" && Array.isArray(entry.schema)) {
              collect(entry.schema);
              return;
            }
            const name = entry.name;
            if (!name) return;
            data[name] = this.config[name];
          });
        };
        collect(MAIN_SCHEMA);
        if (data.week_start_day !== void 0) data.week_start_day = String(data.week_start_day);
        return data;
      }
      // --- Calendars -----------------------------------------------------
      addCalendar(entity) {
        if (!this.config || !entity) return;
        if (this.config.calendars.some((calendar) => calendar.entity === entity)) return;
        const calendars = [...this.config.calendars, { entity, enabled: true }];
        this.updateValue("calendars", calendars);
        this.newCalendarEntity = "";
      }
      updateCalendar(index, patch) {
        if (!this.config) return;
        const calendars = this.config.calendars.map((calendar, i5) => i5 === index ? { ...calendar, ...patch } : calendar);
        this.updateValue("calendars", calendars);
      }
      removeCalendar(index) {
        if (!this.config) return;
        const calendars = this.config.calendars.filter((_2, i5) => i5 !== index);
        this.updateValue("calendars", calendars);
      }
      // --- Shared color picker -----------------------------------------------
      renderColorField(value, onChange) {
        return b2`<div class="color-field">
      <input type="color" class="swatch" .value=${value || "#4F86F7"} @input=${(e5) => onChange(e5.target.value)} />
      <div class="palette">
        ${PALETTE.map(
          (color) => b2`<button
            class="palette-swatch ${color.toLowerCase() === (value || "").toLowerCase() ? "selected" : ""}"
            style=${`background:${color}`}
            title=${color}
            @click=${() => onChange(color)}
          ></button>`
        )}
      </div>
    </div>`;
      }
      renderCalendarsSection() {
        if (!this.config) return A;
        return b2`<div class="section">
      <h3>Calendars</h3>
      <p class="hint">Choose which calendar entities appear on the card, and customize their name and color.</p>
      ${this.config.calendars.map(
          (calendar, index) => b2`<div class="row calendar-row">
          <div class="row-main">
            <span class="entity-id">${calendar.entity}</span>
            <input
              type="text"
              placeholder="Display name"
              .value=${calendar.name || ""}
              @input=${(e5) => this.updateCalendar(index, { name: e5.target.value })}
            />
            ${this.renderColorField(calendar.color || "#4F86F7", (color) => this.updateCalendar(index, { color }))}
          </div>
          <label class="enabled-toggle">
            <input
              type="checkbox"
              .checked=${calendar.enabled !== false}
              @change=${(e5) => this.updateCalendar(index, { enabled: e5.target.checked })}
            />
            Enabled
          </label>
          <button class="icon-btn" title="Remove" @click=${() => this.removeCalendar(index)}>✕</button>
        </div>`
        )}
      <div class="add-row">
        ${this.renderEntityPicker(
          this.newCalendarEntity,
          ["calendar"],
          "Add a calendar entity",
          (value) => this.addCalendar(value)
        )}
      </div>
    </div>`;
      }
      // --- Family members --------------------------------------------------
      updateFamilyMember(index, patch) {
        if (!this.config) return;
        const members = (this.config.family_members ?? []).map(
          (member, i5) => i5 === index ? { ...member, ...patch } : member
        );
        this.updateValue("family_members", members);
      }
      addFamilyMember() {
        if (!this.config) return;
        familyMemberCounter += 1;
        const member = { id: `member_${familyMemberCounter}`, name: "New member", color: "#60a5fa" };
        this.updateValue("family_members", [...this.config.family_members ?? [], member]);
      }
      removeFamilyMember(index) {
        if (!this.config) return;
        const members = (this.config.family_members ?? []).filter((_2, i5) => i5 !== index);
        this.updateValue("family_members", members);
      }
      renderFamilyMembersSection() {
        if (!this.config) return A;
        const members = this.config.family_members ?? [];
        return b2`<div class="section">
      <h3>Family members</h3>
      <p class="hint">Add household members to color-code assigned events and tasks.</p>
      ${members.map(
          (member, index) => b2`<div class="row member-row">
          <div class="row-main">
            <input
              type="text"
              placeholder="Name"
              .value=${member.name}
              @input=${(e5) => this.updateFamilyMember(index, { name: e5.target.value })}
            />
            <input
              type="text"
              placeholder="Avatar URL (optional)"
              .value=${member.avatar || ""}
              @input=${(e5) => this.updateFamilyMember(index, { avatar: e5.target.value })}
            />
            ${this.renderColorField(member.color || "#60a5fa", (color) => this.updateFamilyMember(index, { color }))}
          </div>
          <button class="icon-btn" title="Remove" @click=${() => this.removeFamilyMember(index)}>✕</button>
        </div>`
        )}
      <button class="add-btn" @click=${() => this.addFamilyMember()}>+ Add family member</button>
    </div>`;
      }
      // --- Theme colors ------------------------------------------------------
      updateThemeColor(key, value) {
        if (!this.config) return;
        this.updateValue("theme_colors", { ...this.config.theme_colors, [key]: value });
      }
      applyThemePreset(presetId) {
        if (!this.config) return;
        const preset = THEME_PRESETS.find((entry) => entry.id === presetId);
        if (!preset) return;
        this.config = { ...this.config, theme_preset: presetId, theme_colors: { ...preset.colors } };
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config: this.config },
            bubbles: true,
            composed: true
          })
        );
      }
      renderThemeSection() {
        if (!this.config) return A;
        const colors = this.config.theme_colors ?? {};
        const activePreset = this.config.theme_preset ?? "custom";
        return b2`<div class="section">
      <h3>Theme</h3>
      <p class="hint">Pick a starter theme, then fine-tune individual colors below.</p>
      <select
        class="theme-select"
        .value=${activePreset}
        @change=${(e5) => {
          const value = e5.target.value;
          if (value === "custom") {
            this.updateValue("theme_preset", "custom");
          } else {
            this.applyThemePreset(value);
          }
        }}
      >
        ${THEME_PRESETS.map((preset) => b2`<option value=${preset.id}>${preset.label}</option>`)}
        <option value="custom">Custom</option>
      </select>
      <div class="theme-grid">
        ${THEME_FIELDS.map(
          (field) => b2`<label class="theme-field">
            ${field.label}
            <input
              type="text"
              .value=${colors[field.key] || ""}
              @input=${(e5) => {
            this.updateValue("theme_preset", "custom");
            this.updateThemeColor(field.key, e5.target.value);
          }}
            />
            ${this.renderColorField(colors[field.key] || "#60a5fa", (color) => {
            this.updateValue("theme_preset", "custom");
            this.updateThemeColor(field.key, color);
          })}
          </label>`
        )}
      </div>
    </div>`;
      }
      // --- Entity picker helper -----------------------------------------------
      renderEntityPicker(value, includeDomains, label, onPick) {
        const picker = customElements.get("ha-entity-picker");
        if (picker && this.hass) {
          return b2`<ha-entity-picker
        .hass=${this.hass}
        .value=${value}
        .includeDomains=${includeDomains}
        .label=${label}
        allow-custom-entity
        @value-changed=${(e5) => {
            const id = e5.detail.value;
            if (id) onPick(id);
          }}
      ></ha-entity-picker>`;
        }
        return b2`<input
      type="text"
      placeholder=${label}
      .value=${value}
      @change=${(e5) => {
          const input = e5.target;
          onPick(input.value.trim());
          input.value = "";
        }}
    />`;
      }
      renderForm() {
        const formEl = customElements.get("ha-form");
        if (formEl && this.hass) {
          return b2`<ha-form
        .hass=${this.hass}
        .data=${this.formData()}
        .schema=${MAIN_SCHEMA}
        .computeLabel=${this.computeLabel}
        @value-changed=${(e5) => this.onFormChanged(e5)}
      ></ha-form>`;
        }
        return b2`<p class="hint">Full form controls require the Home Assistant frontend.</p>`;
      }
      render() {
        if (!this.config) return b2``;
        return b2`<div class="editor">
      <div class="section">${this.renderForm()}</div>
      ${this.renderCalendarsSection()} ${this.renderFamilyMembersSection()} ${this.renderThemeSection()}
    </div>`;
      }
    };
    FamilyHubCalendarEditor.styles = i`
    .editor {
      display: grid;
      gap: 16px;
      padding: 4px 0 12px;
    }
    .section {
      display: grid;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--divider-color, #374151);
      border-radius: 12px;
    }
    .section h3 {
      margin: 0;
      font-size: 1rem;
    }
    .hint {
      margin: 0;
      font-size: 0.85em;
      opacity: 0.7;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color, #374151);
    }
    .row:last-of-type {
      border-bottom: none;
    }
    .row-main {
      display: grid;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .entity-id {
      font-size: 0.75em;
      opacity: 0.65;
      font-family: monospace;
    }
    .swatch {
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 8px;
      background: none;
      cursor: pointer;
      flex-shrink: 0;
    }
    input[type="text"] {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #374151);
      background: var(--card-background-color, transparent);
      color: inherit;
    }
    .enabled-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85em;
      white-space: nowrap;
    }
    .icon-btn {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.6;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .icon-btn:hover {
      opacity: 1;
      background: color-mix(in srgb, currentColor 10%, transparent);
    }
    .add-row {
      margin-top: 4px;
    }
    .add-btn {
      justify-self: start;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px dashed var(--divider-color, #374151);
      background: none;
      cursor: pointer;
      color: var(--primary-color, inherit);
    }
    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 8px;
    }
    .theme-field {
      display: grid;
      gap: 4px;
      font-size: 0.85em;
    }
    .theme-select {
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #374151);
      background: var(--card-background-color, transparent);
      color: inherit;
      justify-self: start;
    }
    .color-field {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .palette {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .palette-swatch {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
    }
    .palette-swatch.selected {
      border-color: var(--primary-text-color, #111827);
    }
  `;
    __decorateClass([
      n4({ attribute: false })
    ], FamilyHubCalendarEditor.prototype, "hass", 2);
    __decorateClass([
      r5()
    ], FamilyHubCalendarEditor.prototype, "config", 2);
    __decorateClass([
      r5()
    ], FamilyHubCalendarEditor.prototype, "newCalendarEntity", 2);
    FamilyHubCalendarEditor = __decorateClass([
      t3("family-hub-calendar-editor")
    ], FamilyHubCalendarEditor);
  }
});

// src/family-hub-calendar-card.ts
init_lit();
init_decorators();
init_config();

// src/translations/en.json
var en_default = {
  today: "Today",
  day: "Day",
  "3day": "3-Day",
  week: "Week",
  work_week: "Work Week",
  month: "Month",
  agenda: "Agenda",
  timeline: "Timeline",
  previous: "Previous",
  next: "Next",
  jump_to_date: "Jump to date",
  details: "Event details",
  close: "Close",
  start: "Start",
  end: "End",
  duration: "Duration",
  calendar: "Calendar",
  location: "Location",
  organizer: "Organizer",
  attendees: "Attendees",
  links: "Links",
  edit: "Edit",
  delete: "Delete",
  copy: "Copy details",
  open_map: "Open map",
  weather: "Weather",
  tasks: "Tasks",
  meals: "Meals",
  daily_summary: "Daily Summary",
  no_events: "No events in range",
  more: "more",
  no_tasks: "No tasks",
  no_meals: "No meals planned",
  vertical: "Vertical",
  horizontal: "Horizontal",
  calendars: "Calendars",
  hide_calendar: "Hide this calendar",
  show_calendar: "Show this calendar",
  add_event: "Add event"
};

// src/translations/fr.json
var fr_default = {
  today: "Aujourd'hui",
  day: "Jour",
  "3day": "3 jours",
  week: "Semaine",
  work_week: "Semaine de travail",
  month: "Mois",
  agenda: "Agenda",
  timeline: "Chronologie",
  previous: "Pr\xE9c\xE9dent",
  next: "Suivant",
  jump_to_date: "Aller \xE0 une date",
  details: "D\xE9tails de l'\xE9v\xE9nement",
  close: "Fermer",
  start: "D\xE9but",
  end: "Fin",
  duration: "Dur\xE9e",
  calendar: "Calendrier",
  location: "Lieu",
  organizer: "Organisateur",
  attendees: "Participants",
  links: "Liens",
  edit: "Modifier",
  delete: "Supprimer",
  copy: "Copier les d\xE9tails",
  open_map: "Ouvrir la carte",
  weather: "M\xE9t\xE9o",
  tasks: "T\xE2ches",
  meals: "Repas",
  daily_summary: "R\xE9sum\xE9 du jour",
  no_events: "Aucun \xE9v\xE9nement sur cette p\xE9riode",
  more: "de plus",
  no_tasks: "Aucune t\xE2che",
  no_meals: "Aucun repas pr\xE9vu",
  vertical: "Vertical",
  horizontal: "Horizontal",
  calendars: "Calendriers",
  hide_calendar: "Masquer ce calendrier",
  show_calendar: "Afficher ce calendrier",
  add_event: "Ajouter un \xE9v\xE9nement"
};

// src/localize.ts
var dictionaries = { en: en_default, fr: fr_default };
var detectLanguage = (hass, configuredLanguage) => {
  if (configuredLanguage) return configuredLanguage;
  const locale = hass?.locale?.language?.toLowerCase();
  if (locale?.startsWith("fr")) return "fr";
  return "en";
};
var localize = (key, language) => dictionaries[language][key] || dictionaries.en[key] || key;

// src/models.ts
var DEFAULT_COLORS = ["#4F86F7", "#4CAF50", "#FF9800", "#7E57C2", "#F06292", "#26A69A"];
var parseDate = (value) => {
  if (typeof value !== "string") return void 0;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? /* @__PURE__ */ new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(parsed.getTime()) ? void 0 : parsed;
};
var stateEvents = (state) => {
  const events = state.attributes.events;
  if (Array.isArray(events)) return events;
  const start = parseDate(state.attributes.start_time);
  const end = parseDate(state.attributes.end_time);
  const message = typeof state.attributes.message === "string" ? state.attributes.message : void 0;
  if (start && end && message) {
    return [
      {
        id: `${state.entity_id}:${start.toISOString()}`,
        title: message,
        start,
        end,
        description: state.attributes.description,
        location: state.attributes.location,
        organizer: state.attributes.organizer,
        attendees: state.attributes.attendees,
        all_day: state.attributes.all_day,
        links: state.attributes.links
      }
    ];
  }
  return [];
};
var extractCalendarEvents = (hass, calendars) => {
  const events = [];
  calendars.filter((calendar) => calendar.enabled !== false).forEach((calendar, index) => {
    const state = hass.states[calendar.entity];
    if (!state) return;
    const calendarName = calendar.name || state.attributes.friendly_name || calendar.entity;
    const calendarColor = calendar.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    for (const event of stateEvents(state)) {
      const start = event.start instanceof Date ? event.start : parseDate(event.start);
      const end = event.end instanceof Date ? event.end : parseDate(event.end);
      if (!start || !end) continue;
      events.push({
        id: String(event.id ?? `${calendar.entity}:${start.toISOString()}`),
        title: String(event.title ?? "Untitled event"),
        description: typeof event.description === "string" ? event.description : void 0,
        start,
        end,
        allDay: Boolean(event.all_day),
        location: typeof event.location === "string" ? event.location : void 0,
        organizer: typeof event.organizer === "string" ? event.organizer : void 0,
        attendees: Array.isArray(event.attendees) ? event.attendees.map((attendee) => String(attendee)) : void 0,
        links: Array.isArray(event.links) ? event.links.map((link) => String(link)) : void 0,
        calendarEntity: calendar.entity,
        calendarName,
        calendarColor,
        sourceType: "calendar"
      });
    }
  });
  return events;
};
var extractTasks = (hass, taskEntities = [], itemsByEntity = {}) => {
  const tasks = [];
  taskEntities.forEach((entity) => {
    const state = hass.states[entity];
    if (!state) return;
    const items = itemsByEntity[entity] ?? [];
    items.forEach((item, index) => {
      const due = parseDate(item.due ?? item.due_date);
      if (!due) return;
      tasks.push({
        id: `${entity}:task:${index}`,
        title: String(item.summary ?? item.title ?? "Task"),
        description: typeof item.description === "string" ? item.description : void 0,
        start: due,
        end: due,
        calendarEntity: entity,
        calendarName: String(state.attributes.friendly_name ?? entity),
        calendarColor: "#FFB300",
        sourceType: "task",
        priority: typeof item.priority === "string" ? item.priority : void 0,
        assignedTo: typeof item.assignee === "string" ? item.assignee : void 0,
        category: typeof item.category === "string" ? item.category : void 0,
        completed: String(item.status ?? "") === "completed"
      });
    });
  });
  return tasks;
};
var extractMeals = (hass, mealEntities = []) => {
  const meals = [];
  mealEntities.forEach((entity) => {
    const state = hass.states[entity];
    if (!state) return;
    const entries = Array.isArray(state.attributes.meals) ? state.attributes.meals : [];
    entries.forEach((entry, index) => {
      const date = parseDate(entry.date);
      if (!date) return;
      const mealType = String(entry.type ?? "Meal");
      meals.push({
        id: `${entity}:meal:${index}`,
        title: `${mealType}: ${String(entry.name ?? "Unassigned")}`,
        description: typeof entry.notes === "string" ? entry.notes : void 0,
        start: date,
        end: date,
        allDay: true,
        calendarEntity: entity,
        calendarName: String(state.attributes.friendly_name ?? "Meals"),
        calendarColor: typeof entry.color === "string" ? entry.color : "#F06292",
        sourceType: "meal",
        category: mealType
      });
    });
  });
  return meals;
};
var sortEvents = (events) => [...events].sort((a3, b3) => a3.start.getTime() - b3.start.getTime());
var eventsOnDay = (events, day) => {
  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(day);
  dayEnd.setHours(23, 59, 59, 999);
  return events.filter((event) => event.end >= dayStart && event.start <= dayEnd);
};
var eventDuration = (event) => {
  const minutes = Math.max(0, Math.round((event.end.getTime() - event.start.getTime()) / 6e4));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${remainingMinutes}m`;
};

// src/family-hub-calendar-card.ts
var FamilyHubCalendarCard = class extends i4 {
  constructor() {
    super(...arguments);
    this.currentDate = /* @__PURE__ */ new Date();
    this.currentView = "week";
    this.activeLanguage = "en";
    this.todoItemsByEntity = {};
    this.activeSection = "calendar";
    this.orientation = "vertical";
    this.hiddenCalendarEntities = /* @__PURE__ */ new Set();
    this.dailyForecast = [];
    this.fetchedTodoEntities = "";
    this.fetchedForecastEntity = "";
  }
  setConfig(config) {
    this.config = normalizeConfig(config);
    this.currentView = this.config.default_view || "week";
    this.orientation = this.config.layout_orientation === "horizontal" ? "horizontal" : "vertical";
    this.lastDetectedLocale = this.hass?.locale?.language;
    this.activeLanguage = detectLanguage(this.hass, this.config.language);
  }
  getCardSize() {
    return this.config?.compact_mode ? 6 : 9;
  }
  static async getConfigElement() {
    await Promise.resolve().then(() => (init_family_hub_calendar_editor(), family_hub_calendar_editor_exports));
    return document.createElement("family-hub-calendar-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:family-hub-calendar",
      calendars: [{ entity: "calendar.family" }]
    };
  }
  updated(changedProps) {
    if (this.config && changedProps.has("hass")) {
      const hassLocale = this.hass?.locale?.language;
      if (hassLocale !== this.lastDetectedLocale) {
        this.lastDetectedLocale = hassLocale;
        this.activeLanguage = detectLanguage(this.hass, this.config.language);
      }
    }
    this.refreshTodoItems();
    this.refreshWeatherForecast();
    if (changedProps.has("selectedEvent")) {
      if (this.selectedEvent) {
        this.modalReturnFocusElement = document.activeElement ?? void 0;
        this.renderRoot.querySelector(".modal")?.focus();
      } else if (this.modalReturnFocusElement) {
        this.modalReturnFocusElement.focus();
        this.modalReturnFocusElement = void 0;
      }
    }
  }
  closeModal() {
    this.selectedEvent = void 0;
  }
  refreshTodoItems() {
    if (!this.hass || !this.config || this.config.show_tasks === false) return;
    const entities = this.config.task_entities ?? [];
    const key = entities.join(",");
    if (key === this.fetchedTodoEntities) return;
    this.fetchedTodoEntities = key;
    entities.forEach((entity) => {
      void this.fetchTodoItems(entity);
    });
  }
  async fetchTodoItems(entity) {
    if (!this.hass?.callWS) return;
    try {
      const response = await this.hass.callWS({
        type: "todo/item/list",
        entity_id: entity
      });
      this.todoItemsByEntity = { ...this.todoItemsByEntity, [entity]: response.items ?? [] };
    } catch {
    }
  }
  refreshWeatherForecast() {
    const entity = this.config?.weather_entity;
    if (!entity) {
      this.fetchedForecastEntity = "";
      this.dailyForecast = [];
      return;
    }
    if (entity === this.fetchedForecastEntity) return;
    this.fetchedForecastEntity = entity;
    void this.fetchWeatherForecast(entity);
  }
  async fetchWeatherForecast(entity) {
    if (!this.hass?.callWS) return;
    try {
      const response = await this.hass.callWS({
        type: "weather/get_forecasts",
        entity_id: [entity],
        forecast_type: "daily"
      });
      if (entity !== this.config?.weather_entity) return;
      this.dailyForecast = response?.[entity]?.forecast ?? [];
    } catch {
    }
  }
  t(key) {
    return localize(key, this.activeLanguage);
  }
  allEvents() {
    if (!this.hass || !this.config) return [];
    const calendarEvents = extractCalendarEvents(this.hass, this.config.calendars).filter(
      (event) => !this.hiddenCalendarEntities.has(event.calendarEntity)
    );
    const taskEvents = this.config.show_tasks === false ? [] : extractTasks(this.hass, this.config.task_entities, this.todoItemsByEntity);
    const mealEvents = this.config.show_meals === false ? [] : extractMeals(this.hass, this.config.meal_entities);
    return sortEvents([...calendarEvents, ...taskEvents, ...mealEvents]);
  }
  toggleCalendarVisibility(entity) {
    const next = new Set(this.hiddenCalendarEntities);
    if (next.has(entity)) next.delete(entity);
    else next.add(entity);
    this.hiddenCalendarEntities = next;
  }
  calendarEventCount(entity) {
    if (!this.hass || !this.config) return 0;
    const { start, end } = dateRangeForView(this.currentDate, this.currentView, this.config.week_start_day || 1);
    return extractCalendarEvents(this.hass, this.config.calendars).filter(
      (event) => event.calendarEntity === entity && event.end >= start && event.start <= end
    ).length;
  }
  visibleEvents() {
    if (!this.config) return [];
    const { start, end } = dateRangeForView(this.currentDate, this.currentView, this.config.week_start_day || 1);
    return this.allEvents().filter((event) => event.end >= start && event.start <= end);
  }
  periodLabel() {
    if (!this.config) return "";
    if (this.activeSection === "tasks") return this.t("tasks");
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    if (this.activeSection === "meals" || this.currentView === "week" || this.currentView === "work_week") {
      const weekStartDay = this.config.week_start_day ?? 1;
      const view = this.activeSection === "meals" ? "week" : this.currentView;
      const { start, end } = dateRangeForView(this.currentDate, view, weekStartDay);
      const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
      return `${fmt.format(start)} \u2013 ${fmt.format(end)}`;
    }
    if (this.currentView === "month") {
      return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(this.currentDate);
    }
    return this.formatDateTime(this.currentDate);
  }
  formatDateTime(value) {
    const language = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    const use24h = this.config?.time_format === "24h";
    return new Intl.DateTimeFormat(language, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: !use24h
    }).format(value);
  }
  movePeriod(direction) {
    const next = new Date(this.currentDate);
    if (this.activeSection === "meals") {
      next.setDate(next.getDate() + direction * 7);
      this.currentDate = next;
      return;
    }
    if (this.currentView === "month") next.setMonth(next.getMonth() + direction);
    else if (this.currentView === "week" || this.currentView === "work_week") next.setDate(next.getDate() + direction * 7);
    else if (this.currentView === "3day") next.setDate(next.getDate() + direction * 3);
    else next.setDate(next.getDate() + direction);
    this.currentDate = next;
  }
  onTouchStart(event) {
    this.swipeStartX = event.touches[0]?.clientX;
  }
  onTouchEnd(event) {
    if (this.swipeStartX === void 0) return;
    const diff = (event.changedTouches[0]?.clientX || 0) - this.swipeStartX;
    if (Math.abs(diff) > 30) this.movePeriod(diff < 0 ? 1 : -1);
    this.swipeStartX = void 0;
  }
  groupedEvents(events) {
    const groups = /* @__PURE__ */ new Map();
    events.forEach((event) => {
      const key = event.calendarName;
      const existing = groups.get(key) || [];
      existing.push(event);
      groups.set(key, existing);
    });
    return groups;
  }
  async copyEventDetails(event) {
    const lines = [
      event.title,
      `${this.t("start")}: ${this.formatDateTime(event.start)}`,
      `${this.t("end")}: ${this.formatDateTime(event.end)}`,
      `${this.t("calendar")}: ${event.calendarName}`,
      event.description || ""
    ].filter(Boolean).join("\n");
    await navigator.clipboard?.writeText(lines);
  }
  editEvent(event) {
    if (event.sourceType !== "calendar" || !event.calendarEntity) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: event.calendarEntity },
        bubbles: true,
        composed: true
      })
    );
    this.closeModal();
  }
  async deleteEvent(event) {
    if (event.sourceType !== "calendar" || !this.hass) return;
    await this.hass.callService("calendar", "delete_event", {
      entity_id: event.calendarEntity,
      event_id: event.id
    });
    this.closeModal();
  }
  weatherIcon(condition) {
    const icons = {
      "clear-night": "\u{1F319}",
      cloudy: "\u2601\uFE0F",
      exceptional: "\u26A0\uFE0F",
      fog: "\u{1F32B}\uFE0F",
      hail: "\u{1F328}\uFE0F",
      lightning: "\u26C8\uFE0F",
      "lightning-rainy": "\u26C8\uFE0F",
      partlycloudy: "\u26C5",
      pouring: "\u{1F327}\uFE0F",
      rainy: "\u{1F327}\uFE0F",
      snowy: "\u2744\uFE0F",
      "snowy-rainy": "\u{1F328}\uFE0F",
      sunny: "\u2600\uFE0F",
      windy: "\u{1F32C}\uFE0F",
      "windy-variant": "\u{1F32C}\uFE0F"
    };
    return icons[condition] || "\u{1F324}\uFE0F";
  }
  renderWeather() {
    if (!this.hass || !this.config?.weather_entity || this.config.show_weather === false) return A;
    const weather = this.hass.states[this.config.weather_entity];
    if (!weather) return A;
    const legacyForecast = Array.isArray(weather.attributes.forecast) ? weather.attributes.forecast : [];
    const forecast = (this.dailyForecast.length ? this.dailyForecast : legacyForecast).slice(0, 4);
    const unit = String(weather.attributes.temperature_unit ?? "\xB0");
    return b2`<section class="panel weather">
      <h3>${this.t("weather")}</h3>
      <div class="weather-current">
        <span class="weather-icon">${this.weatherIcon(weather.state)}</span>
        <span class="weather-temp">${String(weather.attributes.temperature ?? "-")}${unit}</span>
        <span class="weather-condition">${weather.state.replace(/-/g, " ")}</span>
      </div>
      <div class="forecast">
        ${forecast.map(
      (day) => b2`<div class="forecast-item">
            <span class="forecast-day">
              ${new Intl.DateTimeFormat(this.activeLanguage === "fr" ? "fr-FR" : "en-US", { weekday: "short" }).format(
        new Date(String(day.datetime ?? Date.now()))
      )}
            </span>
            <span class="forecast-icon">${this.weatherIcon(String(day.condition ?? ""))}</span>
            <span class="forecast-temps"
              ><b>${String(day.temperature ?? "-")}°</b>/${String(day.templow ?? "-")}°</span
            >
          </div>`
    )}
      </div>
    </section>`;
  }
  renderWeatherBadge() {
    if (!this.hass || !this.config?.weather_entity || this.config.show_weather === false) return A;
    const weather = this.hass.states[this.config.weather_entity];
    if (!weather) return A;
    const unit = String(weather.attributes.temperature_unit ?? "\xB0");
    return b2`<span class="weather-badge" title=${weather.state.replace(/-/g, " ")}>
      <span class="weather-badge-icon">${this.weatherIcon(weather.state)}</span>
      <span class="weather-badge-temp">${String(weather.attributes.temperature ?? "-")}${unit}</span>
    </span>`;
  }
  quickAddEvent() {
    if (!this.config?.calendars.length) return;
    const target = this.config.calendars.find(
      (calendar) => calendar.enabled !== false && !this.hiddenCalendarEntities.has(calendar.entity)
    ) || this.config.calendars[0];
    if (!target) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: target.entity },
        bubbles: true,
        composed: true
      })
    );
  }
  sourceIcon(event) {
    if (event.sourceType === "task") return "\u2713";
    if (event.sourceType === "meal") return "\u{1F37D}";
    return "\u{1F4C5}";
  }
  renderCalendarLegend() {
    if (!this.config) return A;
    const calendars = this.config.calendars.filter((calendar) => calendar.enabled !== false);
    if (!calendars.length) return A;
    return b2`<div class="legend">
      ${calendars.map((calendar) => {
      const visible = !this.hiddenCalendarEntities.has(calendar.entity);
      const count = this.calendarEventCount(calendar.entity);
      return b2`<button
          class="legend-item ${visible ? "" : "hidden"}"
          style=${`--event-color:${calendar.color || "var(--fhc-accent)"}`}
          title=${visible ? this.t("hide_calendar") : this.t("show_calendar")}
          @click=${() => this.toggleCalendarVisibility(calendar.entity)}
        >
          <span class="legend-dot" style=${`background:${calendar.color || "var(--fhc-accent)"}`}></span>
          <span class="legend-name">${calendar.name || calendar.entity}</span>
          <span class="legend-count">${count}</span>
        </button>`;
    })}
    </div>`;
  }
  renderSideNav() {
    if (!this.config) return A;
    const items = [
      { id: "calendar", icon: "\u{1F5D3}", label: this.t("calendar") }
    ];
    if (this.config.show_tasks !== false) items.push({ id: "tasks", icon: "\u2713", label: this.t("tasks") });
    if (this.config.show_meals !== false) items.push({ id: "meals", icon: "\u{1F37D}", label: this.t("meals") });
    return b2`<nav class="side-nav">
      ${items.map(
      (item) => b2`<button
          class="side-nav-btn ${this.activeSection === item.id ? "active" : ""}"
          title=${item.label}
          @click=${() => this.activeSection = item.id}
        >
          <span class="side-nav-icon">${item.icon}</span>
          <span class="side-nav-label">${item.label}</span>
        </button>`
    )}
    </nav>`;
  }
  jumpToDay(day) {
    this.currentDate = new Date(day);
    if (this.config?.enabled_views?.includes("day")) this.currentView = "day";
  }
  forecastForDay(day) {
    if (!this.hass || !this.config?.weather_entity) return void 0;
    const weather = this.hass.states[this.config.weather_entity];
    const legacyForecast = Array.isArray(weather?.attributes.forecast) ? weather.attributes.forecast : [];
    const forecast = this.dailyForecast.length ? this.dailyForecast : legacyForecast;
    const dayKey = day.toDateString();
    return forecast.find((entry) => {
      const value = entry.datetime;
      if (typeof value !== "string") return false;
      const parsed = new Date(value);
      return !Number.isNaN(parsed.getTime()) && parsed.toDateString() === dayKey;
    });
  }
  renderDayWeather(day) {
    if (!this.config || this.config.weather_placement !== "day_cell" || this.config.show_weather === false || !this.config.weather_entity)
      return A;
    const entry = this.forecastForDay(day);
    if (!entry) return A;
    const high = entry.temperature;
    const low = entry.templow;
    return b2`<span class="cell-weather" title=${String(entry.condition ?? "")}>
      ${this.weatherIcon(String(entry.condition ?? ""))}
      ${high !== void 0 ? b2`<span class="cell-weather-hi">${String(Math.round(Number(high)))}°</span>` : A}${low !== void 0 ? b2`<span class="cell-weather-lo">/${String(Math.round(Number(low)))}°</span>` : A}
    </span>`;
  }
  renderMonthGrid() {
    if (!this.config) return A;
    const weekStartDay = this.config.week_start_day ?? 1;
    const includeAdjacent = this.config.show_empty_days !== false;
    const days = monthGridDays(this.currentDate, weekStartDay, includeAdjacent);
    const events = this.allEvents();
    const weeks = [];
    for (let i5 = 0; i5 < days.length; i5 += 7) weeks.push(days.slice(i5, i5 + 7));
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    const weekdayLabels = days.slice(0, 7).map((day) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day));
    const todayKey = (/* @__PURE__ */ new Date()).toDateString();
    const currentMonth = this.currentDate.getMonth();
    return b2`<div class="month-grid">
      <div class="month-grid-header">${weekdayLabels.map((label) => b2`<span>${label}</span>`)}</div>
      ${weeks.map(
      (week) => b2`<div class="month-grid-row">
          ${week.map((day) => {
        const dayEvents = eventsOnDay(events, day);
        const isOutside = day.getMonth() !== currentMonth;
        const isToday = day.toDateString() === todayKey;
        const visible = dayEvents.slice(0, 3);
        const extra = dayEvents.length - visible.length;
        return b2`<div class="month-cell ${isOutside ? "outside" : ""} ${isToday ? "today" : ""}">
              <div class="month-cell-top">
                <button class="month-cell-date" @click=${() => this.jumpToDay(day)}>${day.getDate()}</button>
                ${this.renderDayWeather(day)}
              </div>
              <div class="month-cell-events">
                ${visible.map(
          (event) => b2`<button
                    class="cell-event"
                    style=${`--event-color:${event.calendarColor}`}
                    title=${event.title}
                    @click=${(e5) => {
            e5.stopPropagation();
            this.selectedEvent = event;
          }}
                  >
                    <span class="cell-dot"></span>${event.title}
                  </button>`
        )}
                ${extra > 0 ? b2`<span class="cell-more">+${extra} ${this.t("more")}</span>` : A}
              </div>
            </div>`;
      })}
        </div>`
    )}
    </div>`;
  }
  timeGridHourRange(events) {
    let start = 7;
    let end = 21;
    events.forEach((event) => {
      if (event.allDay) return;
      const startHour = event.start.getHours();
      const endHour = event.end.getHours() + (event.end.getMinutes() > 0 || event.end <= event.start ? 1 : 0);
      if (startHour < start) start = Math.max(0, startHour);
      if (endHour > end) end = Math.min(24, endHour);
    });
    return { start, end };
  }
  layoutTimeGridEvents(events, startHour, endHour) {
    const totalMinutes = (endHour - startHour) * 60;
    const sorted = [...events].sort((a3, b3) => a3.start.getTime() - b3.start.getTime());
    const results = [];
    let cluster = [];
    let clusterEnd = -Infinity;
    const clusters = [];
    sorted.forEach((event) => {
      if (cluster.length && event.start.getTime() >= clusterEnd) {
        clusters.push(cluster);
        cluster = [];
        clusterEnd = -Infinity;
      }
      cluster.push(event);
      clusterEnd = Math.max(clusterEnd, event.end.getTime());
    });
    if (cluster.length) clusters.push(cluster);
    clusters.forEach((clusterEvents) => {
      const lanes = [];
      clusterEvents.forEach((event) => {
        const lane = lanes.find((candidate) => candidate[candidate.length - 1].end.getTime() <= event.start.getTime());
        if (lane) lane.push(event);
        else lanes.push([event]);
      });
      const laneCount = lanes.length;
      lanes.forEach((lane, laneIndex) => {
        lane.forEach((event) => {
          const startMinutes = Math.min(
            Math.max(event.start.getHours() * 60 + event.start.getMinutes() - startHour * 60, 0),
            totalMinutes
          );
          const rawEndMinutes = event.end.getHours() * 60 + event.end.getMinutes() - startHour * 60;
          const endMinutes = Math.min(Math.max(rawEndMinutes, startMinutes + 20), totalMinutes);
          results.push({
            event,
            top: startMinutes / totalMinutes * 100,
            height: Math.max((endMinutes - startMinutes) / totalMinutes * 100, 2.5),
            left: laneIndex / laneCount * 100,
            width: 1 / laneCount * 100
          });
        });
      });
    });
    return results;
  }
  renderNowLine(startHour, endHour) {
    const now = /* @__PURE__ */ new Date();
    const totalMinutes = (endHour - startHour) * 60;
    const nowMinutes = now.getHours() * 60 + now.getMinutes() - startHour * 60;
    if (nowMinutes < 0 || nowMinutes > totalMinutes) return A;
    return b2`<div class="time-now-line" style=${`top:${nowMinutes / totalMinutes * 100}%`}></div>`;
  }
  renderWeekGrid() {
    if (!this.config) return A;
    const weekStartDay = this.config.week_start_day ?? 1;
    const days = gridDaysForView(this.currentDate, this.currentView, weekStartDay);
    const events = this.allEvents();
    const todayKey = (/* @__PURE__ */ new Date()).toDateString();
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    const use24h = this.config.time_format === "24h";
    const eventsPerDay = days.map((day) => eventsOnDay(events, day));
    const timedPerDay = eventsPerDay.map((list) => list.filter((event) => !event.allDay));
    const allDayPerDay = eventsPerDay.map((list) => list.filter((event) => event.allDay));
    const hasAllDay = allDayPerDay.some((list) => list.length);
    const { start: gridStart, end: gridEnd } = this.timeGridHourRange(timedPerDay.flat());
    const hours = Array.from({ length: gridEnd - gridStart }, (_2, i5) => gridStart + i5);
    const formatHour = (hour) => new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: !use24h }).format(new Date(2e3, 0, 1, hour));
    return b2`<div class="time-grid">
      <div class="time-grid-header">
        <div class="time-gutter"></div>
        ${days.map((day) => {
      const isToday = day.toDateString() === todayKey;
      return b2`<div class="time-day-header ${isToday ? "today" : ""}" @click=${() => this.jumpToDay(day)}>
            <span class="time-day-name">${new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day)}</span>
            <span class="time-day-num">${day.getDate()}</span>
            ${this.renderDayWeather(day)}
          </div>`;
    })}
      </div>
      ${hasAllDay ? b2`<div class="time-grid-allday">
            <div class="time-gutter"></div>
            ${allDayPerDay.map(
      (list) => b2`<div class="time-allday-cell">
                ${list.map(
        (event) => b2`<button
                    class="cell-event"
                    style=${`--event-color:${event.calendarColor}`}
                    title=${event.title}
                    @click=${() => this.selectedEvent = event}
                  >
                    <span class="cell-dot"></span>${event.title}
                  </button>`
      )}
              </div>`
    )}
          </div>` : A}
      <div class="time-grid-body">
        <div class="time-gutter-col">
          ${hours.map((hour) => b2`<div class="time-hour-label">${formatHour(hour)}</div>`)}
        </div>
        ${days.map((day, dayIndex) => {
      const isToday = day.toDateString() === todayKey;
      return b2`<div class="time-day-col ${isToday ? "today" : ""}">
            ${hours.map(() => b2`<div class="time-hour-cell"></div>`)}
            ${this.layoutTimeGridEvents(timedPerDay[dayIndex], gridStart, gridEnd).map(
        ({ event, top, height, left, width }) => b2`<button
                class="time-event ${event.completed ? "completed" : ""}"
                style=${`--event-color:${event.calendarColor};top:${top}%;height:${height}%;left:${left}%;width:${width}%`}
                title=${event.title}
                @click=${() => this.selectedEvent = event}
              >
                <span class="time-event-title">${event.title}</span>
                <span class="time-event-time">${this.formatDateTime(event.start).split(", ").pop()}</span>
                <span class="time-event-badge" style=${`background:${event.calendarColor}`}
                  >${event.calendarName.charAt(0).toUpperCase()}</span
                >
              </button>`
      )}
            ${isToday ? this.renderNowLine(gridStart, gridEnd) : A}
          </div>`;
    })}
      </div>
    </div>`;
  }
  renderEventItem(event, compact = false) {
    const isToday = (/* @__PURE__ */ new Date()).toDateString() === event.start.toDateString();
    return b2`<button
      class="event ${event.completed ? "completed" : ""} ${compact ? "compact" : ""}"
      style=${`--event-color:${event.calendarColor}`}
      @click=${() => this.selectedEvent = event}
    >
      <span class="event-bar"></span>
      <span class="event-icon">${this.sourceIcon(event)}</span>
      <span class="event-body">
        <span class="event-title">${event.title}</span>
        <span class="event-meta">${event.calendarName}${event.location ? ` \xB7 ${event.location}` : ""}</span>
      </span>
      <span class="event-time ${isToday ? "today" : ""}">
        ${event.allDay ? this.t("day") : this.formatDateTime(event.start).split(", ").pop()}
      </span>
    </button>`;
  }
  renderTasksPanel() {
    const tasks = this.allEvents().filter((event) => event.sourceType === "task");
    if (!tasks.length)
      return b2`<div class="empty">
        <span class="empty-icon">✅</span>
        <span>${this.t("no_tasks")}</span>
      </div>`;
    return b2`<div class="event-list">${tasks.map((task) => this.renderEventItem(task))}</div>`;
  }
  renderMealsPanel() {
    if (!this.config) return A;
    const weekStartDay = this.config.week_start_day ?? 1;
    const days = gridDaysForView(this.currentDate, "week", weekStartDay);
    const meals = this.allEvents().filter((event) => event.sourceType === "meal");
    const locale = this.activeLanguage === "fr" ? "fr-FR" : "en-US";
    const todayKey = (/* @__PURE__ */ new Date()).toDateString();
    return b2`<div class="week-grid">
      ${days.map((day) => {
      const dayMeals = eventsOnDay(meals, day);
      const isToday = day.toDateString() === todayKey;
      return b2`<section class="week-day ${isToday ? "today" : ""}">
          <header class="week-day-header">
            <span class="week-day-name">
              ${new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(day)}
            </span>
            <span class="week-day-count">${dayMeals.length}</span>
          </header>
          <div class="week-day-events">
            ${dayMeals.length ? dayMeals.map((meal) => this.renderEventItem(meal, true)) : b2`<div class="empty-day">${this.t("no_meals")}</div>`}
          </div>
        </section>`;
    })}
    </div>`;
  }
  renderEvents() {
    if (this.activeSection === "tasks") return this.renderTasksPanel();
    if (this.activeSection === "meals") return this.renderMealsPanel();
    if (this.currentView === "month") return this.renderMonthGrid();
    if (this.currentView === "week" || this.currentView === "work_week") {
      return this.renderWeekGrid();
    }
    const events = this.visibleEvents();
    if (!events.length)
      return b2`<div class="empty">
        <span class="empty-icon">🗓️</span>
        <span>${this.t("no_events")}</span>
      </div>`;
    if (this.config?.grouped_by_calendar) {
      const groups = this.groupedEvents(events);
      return b2`<div class="event-list">
        ${[...groups.entries()].map(
        ([calendarName, grouped]) => b2`<section class="group">
            <h3>${calendarName}</h3>
            ${grouped.map((event) => this.renderEventItem(event))}
          </section>`
      )}
      </div>`;
    }
    return b2`<div class="event-list">${events.map((event) => this.renderEventItem(event))}</div>`;
  }
  renderModal() {
    if (!this.selectedEvent) return A;
    const event = this.selectedEvent;
    return b2`<div
      class="modal-backdrop"
      @click=${() => this.closeModal()}
      @keydown=${(e5) => {
      if (e5.key === "Escape") this.closeModal();
    }}
    >
      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fhc-modal-title"
        tabindex="-1"
        style=${`--event-color:${event.calendarColor}`}
        @click=${(e5) => e5.stopPropagation()}
      >
        <div class="modal-banner">
          <span class="modal-source">${this.sourceIcon(event)} ${event.calendarName}</span>
          <button class="modal-close" aria-label=${this.t("close")} @click=${() => this.closeModal()}>✕</button>
        </div>
        <div class="modal-body">
          <h2 id="fhc-modal-title">${event.title}</h2>
          ${event.description ? b2`<p class="modal-description">${event.description}</p>` : A}
          <div class="modal-facts">
            <div class="fact"><span class="fact-label">${this.t("start")}</span><span>${this.formatDateTime(event.start)}</span></div>
            <div class="fact"><span class="fact-label">${this.t("end")}</span><span>${this.formatDateTime(event.end)}</span></div>
            <div class="fact"><span class="fact-label">${this.t("duration")}</span><span>${eventDuration(event)}</span></div>
            ${event.location ? b2`<div class="fact"><span class="fact-label">${this.t("location")}</span><span>${event.location}</span></div>` : A}
            ${event.organizer ? b2`<div class="fact"><span class="fact-label">${this.t("organizer")}</span><span>${event.organizer}</span></div>` : A}
            ${event.attendees?.length ? b2`<div class="fact">
                  <span class="fact-label">${this.t("attendees")}</span><span>${event.attendees.join(", ")}</span>
                </div>` : A}
            ${event.links?.length ? b2`<div class="fact"><span class="fact-label">${this.t("links")}</span><span>${event.links.join(" \xB7 ")}</span></div>` : A}
          </div>
          <div class="actions">
            <button class="pill" @click=${() => this.editEvent(event)}>✎ ${this.t("edit")}</button>
            <button class="pill danger" @click=${() => this.deleteEvent(event)}>🗑 ${this.t("delete")}</button>
            <button class="pill" @click=${() => this.copyEventDetails(event)}>⧉ ${this.t("copy")}</button>
            ${event.location ? b2`<button
                  class="pill"
                  @click=${() => window.open(`https://maps.google.com/?q=${encodeURIComponent(event.location)}`)}
                >
                  📍 ${this.t("open_map")}
                </button>` : A}
          </div>
        </div>
      </section>
    </div>`;
  }
  render() {
    if (!this.config)
      return b2`<ha-card
        ><div class="empty"><span class="empty-icon">⚠️</span><span>Configuration required</span></div></ha-card
      >`;
    const title = this.config.title || "Family Hub Calendar";
    const views = this.config.enabled_views || [];
    const theme = this.config.theme_colors ?? {};
    const density = this.config.event_density || "comfortable";
    return b2`<ha-card
      class="hub density-${density}"
      @touchstart=${this.onTouchStart}
      @touchend=${this.onTouchEnd}
      style=${`--fhc-font-family:${this.config.font_family || "inherit"};--fhc-radius:${this.config.border_radius}px;--fhc-bg:${theme.background || "inherit"};--fhc-surface:${theme.surface || "inherit"};--fhc-text:${theme.text || "inherit"};--fhc-accent:${theme.accent || "var(--primary-color)"};`}
    >
      <div class="layout">
        ${this.renderSideNav()}
        <div class="main-column">
          ${this.config.show_header !== false ? b2`<header>
                <div class="left">
                  ${this.renderWeatherBadge()}
                  <h1>${title}</h1>
                  <span class="date-line">${this.periodLabel()}</span>
                  ${this.activeSection === "calendar" ? this.renderCalendarLegend() : A}
                </div>
                <div class="right">
                  ${this.activeSection !== "tasks" ? b2`<div class="nav-group">
                          <button class="icon-nav" aria-label=${this.t("previous")} @click=${() => this.movePeriod(-1)}>
                            ‹
                          </button>
                          <button class="today-btn" @click=${() => this.currentDate = /* @__PURE__ */ new Date()}>
                            ${this.t("today")}
                          </button>
                          <button class="icon-nav" aria-label=${this.t("next")} @click=${() => this.movePeriod(1)}>
                            ›
                          </button>
                        </div>
                        <label class="date-jump">
                          <input
                            type="date"
                            title=${this.t("jump_to_date")}
                            @change=${(e5) => {
      const input = e5.target;
      const value = input.value ? new Date(input.value) : /* @__PURE__ */ new Date();
      if (!Number.isNaN(value.getTime())) this.currentDate = value;
    }}
                          />
                        </label>` : A}
                </div>
              </header>` : A}

          ${this.activeSection === "calendar" ? b2`<nav class="views">
                <div class="segmented">
                  ${views.map(
      (view) => b2`<button
                        class=${view === this.currentView ? "active" : ""}
                        @click=${() => this.currentView = view}
                      >
                        ${this.t(view)}
                      </button>`
    )}
                </div>
              </nav>` : A}

          <div class="content ${this.config.show_sidebar === false ? "no-sidebar" : ""}">
            <main class="orientation-${this.orientation}">${this.renderEvents()}</main>
            ${this.config.show_sidebar === false ? A : b2`<aside>
                  ${this.renderWeather()}
                  <section class="panel summary">
                    <h3>${this.t("daily_summary")}</h3>
                    <p class="summary-count">${this.visibleEvents().length}</p>
                    <p class="summary-label">events</p>
                  </section>
                </aside>`}
            ${this.activeSection === "calendar" && this.config.calendars.length ? b2`<button class="fab" title=${this.t("add_event")} aria-label=${this.t("add_event")} @click=${() => this.quickAddEvent()}>
                  +
                </button>` : A}
          </div>
        </div>
      </div>
    </ha-card>${this.renderModal()}`;
  }
};
FamilyHubCalendarCard.styles = i`
    :host {
      display: block;
    }
    .hub {
      --fhc-accent-soft: color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 16%, transparent);
      background: var(--fhc-bg, var(--ha-card-background, var(--card-background-color)));
      color: var(--fhc-text, var(--primary-text-color));
      border-radius: var(--fhc-radius, 16px);
      padding: 20px 22px;
      font-family: var(--fhc-font-family, inherit);
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06), 0 12px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.12));
    }
    .hub.density-compact {
      --fhc-event-min-h: 48px;
      --fhc-event-pad: 10px 12px;
      --fhc-event-font: 0.92em;
      --fhc-month-cell-h: 92px;
      --fhc-chip-min-h: 20px;
      --fhc-chip-pad: 3px 6px;
      --fhc-hour-h: 44px;
    }
    .hub.density-comfortable {
      --fhc-event-min-h: 56px;
      --fhc-event-pad: 14px 16px;
      --fhc-event-font: 1em;
      --fhc-month-cell-h: 108px;
      --fhc-chip-min-h: 24px;
      --fhc-chip-pad: 4px 7px;
      --fhc-hour-h: 56px;
    }
    .hub.density-large {
      --fhc-event-min-h: 76px;
      --fhc-event-pad: 18px 20px;
      --fhc-event-font: 1.2em;
      --fhc-month-cell-h: 136px;
      --fhc-chip-min-h: 32px;
      --fhc-chip-pad: 6px 10px;
      --fhc-hour-h: 72px;
    }
    .hub.density-extra_large {
      --fhc-event-min-h: 96px;
      --fhc-event-pad: 22px 26px;
      --fhc-event-font: 1.45em;
      --fhc-month-cell-h: 168px;
      --fhc-chip-min-h: 40px;
      --fhc-chip-pad: 8px 14px;
      --fhc-hour-h: 88px;
    }
    .layout {
      display: flex;
      gap: 18px;
      align-items: flex-start;
    }
    .main-column {
      flex: 1;
      min-width: 0;
    }
    .side-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 84px;
      flex-shrink: 0;
    }
    .side-nav-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border: none;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 6%, transparent));
      color: inherit;
      border-radius: 14px;
      padding: 12px 6px;
      min-height: 60px;
      cursor: pointer;
      opacity: 0.72;
      transition: background 150ms ease, opacity 150ms ease, box-shadow 150ms ease, transform 150ms ease;
    }
    .side-nav-btn:hover {
      opacity: 1;
      background: var(--fhc-accent-soft);
      transform: translateY(-1px);
    }
    .side-nav-btn.active {
      background: var(--fhc-accent-soft);
      color: var(--fhc-accent, var(--primary-color));
      opacity: 1;
      box-shadow: none;
    }
    .side-nav-icon {
      font-size: 1.4rem;
      line-height: 1;
    }
    .side-nav-label {
      font-size: 0.68em;
      font-weight: 700;
      text-align: center;
      letter-spacing: 0.01em;
    }
    header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 12px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    }
    .left {
      display: grid;
      gap: 6px;
      min-width: 0;
    }
    .weather-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.85em;
      font-weight: 700;
      opacity: 0.85;
      justify-self: start;
    }
    .weather-badge-icon {
      font-size: 1.1rem;
    }
    .left h1 {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .date-line {
      display: inline-flex;
      align-self: start;
      opacity: 0.85;
      font-size: 0.85em;
      font-weight: 600;
      text-transform: capitalize;
      background: var(--fhc-accent-soft);
      color: var(--fhc-accent, var(--primary-color));
      padding: 4px 10px;
      border-radius: 999px;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 0.8em;
      font-weight: 700;
      opacity: 1;
      border: none;
      border-left: 4px solid var(--event-color, var(--fhc-accent));
      cursor: pointer;
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 14%, var(--fhc-surface, transparent));
      color: inherit;
      padding: 6px 12px 6px 9px;
      border-radius: 10px;
      transition: opacity 120ms ease, background 120ms ease, transform 120ms ease;
    }
    .legend-item:hover {
      transform: translateY(-1px);
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 24%, var(--fhc-surface, transparent));
    }
    .legend-item.hidden {
      opacity: 0.42;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 5%, transparent));
      border-left-color: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 40%, transparent);
    }
    .legend-item.hidden .legend-name {
      text-decoration: line-through;
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }
    .legend-count {
      font-size: 0.85em;
      font-weight: 800;
      opacity: 0.7;
      min-width: 1.2em;
      text-align: center;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .nav-group {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 6%, transparent));
      border-radius: 999px;
      padding: 4px;
    }
    .icon-nav {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 999px;
      background: transparent;
      color: inherit;
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      transition: background 120ms ease;
    }
    .icon-nav:hover {
      background: var(--fhc-accent-soft);
    }
    .today-btn {
      border: none;
      background: transparent;
      color: inherit;
      font-weight: 700;
      font-size: 0.9em;
      padding: 10px 16px;
      min-height: 44px;
      border-radius: 999px;
      cursor: pointer;
      transition: background 120ms ease;
    }
    .today-btn:hover {
      background: var(--fhc-accent-soft);
    }
    .date-jump input[type="date"] {
      border: 1px solid var(--divider-color, #374151);
      border-radius: 10px;
      padding: 8px 10px;
      background: transparent;
      color: inherit;
      font-size: 0.85em;
      min-height: 44px;
      box-sizing: border-box;
    }
    .views {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 0 0 16px;
      flex-wrap: wrap;
    }
    .segmented {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 6%, transparent));
      border-radius: 12px;
      padding: 3px;
    }
    .segmented button {
      border: none;
      background: transparent;
      color: inherit;
      padding: 10px 16px;
      min-height: 40px;
      border-radius: 9px;
      font-size: 0.9em;
      font-weight: 600;
      cursor: pointer;
      opacity: 0.7;
      transition: background 120ms ease, opacity 120ms ease;
    }
    .segmented button:hover {
      opacity: 1;
    }
    .segmented button.active {
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
      opacity: 1;
      box-shadow: 0 4px 10px color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 40%, transparent);
    }
    .content {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      flex-wrap: wrap;
      position: relative;
    }
    .content.no-sidebar aside {
      display: none;
    }
    main {
      flex: 1;
      min-width: 0;
      display: grid;
      gap: 8px;
      transition: transform 150ms ease, opacity 150ms ease;
    }
    .event-list {
      display: grid;
      gap: 8px;
    }
    main.orientation-horizontal .event-list {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
    }
    main.orientation-horizontal .event-list .event {
      flex: 0 0 260px;
    }
    .fab {
      position: absolute;
      right: 4px;
      bottom: 4px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
      font-size: 1.8rem;
      line-height: 1;
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 55%, transparent);
      transition: transform 120ms ease, box-shadow 120ms ease;
      z-index: 5;
    }
    .fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 60%, transparent);
    }
    aside {
      width: min(35%, 320px);
      display: grid;
      gap: 12px;
    }
    .panel,
    .group {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      border-radius: 14px;
      padding: 14px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 4%, transparent));
    }
    .panel h3,
    .group h3 {
      margin: 0 0 8px;
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      opacity: 0.65;
    }
    .group {
      display: grid;
      gap: 6px;
    }
    .month-grid {
      display: grid;
      gap: 6px;
    }
    .month-grid-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      font-size: 0.75em;
      font-weight: 700;
      opacity: 0.55;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      text-align: center;
      padding-bottom: 4px;
    }
    .month-grid-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
    }
    .month-cell {
      min-height: var(--fhc-month-cell-h, 108px);
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      border-radius: 12px;
      padding: 6px;
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 3px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 3%, transparent));
      transition: box-shadow 120ms ease;
    }
    .month-cell.outside {
      opacity: 0.38;
    }
    .month-cell.today {
      border-color: var(--fhc-accent, var(--primary-color));
      box-shadow: inset 0 0 0 1.5px var(--fhc-accent, var(--primary-color));
      background: var(--fhc-accent-soft);
    }
    .month-cell-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
    }
    .month-cell-date {
      border: none;
      background: transparent;
      color: inherit;
      font-weight: 700;
      font-size: var(--fhc-event-font, 0.9em);
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .month-cell.today .month-cell-date {
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
    }
    .cell-weather {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 0.72em;
      opacity: 0.75;
      white-space: nowrap;
    }
    .cell-weather-hi {
      font-weight: 700;
    }
    .cell-weather-lo {
      opacity: 0.7;
    }
    .month-cell-events {
      display: grid;
      gap: 3px;
      align-content: start;
      overflow: hidden;
    }
    .cell-event {
      display: flex;
      align-items: center;
      gap: 5px;
      border: none;
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 30%, var(--fhc-surface, white));
      color: inherit;
      text-align: left;
      font-size: var(--fhc-event-font, 0.8em);
      font-weight: 600;
      padding: var(--fhc-chip-pad, 4px 7px);
      min-height: var(--fhc-chip-min-h, 24px);
      border-radius: 999px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background 120ms ease;
    }
    .cell-event:hover {
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 42%, var(--fhc-surface, white));
    }
    .cell-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--event-color, var(--fhc-accent));
      flex-shrink: 0;
    }
    .cell-more {
      font-size: 0.75em;
      opacity: 0.6;
      padding: 2px 4px;
    }
    .week-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      align-items: start;
      overflow-x: auto;
    }
    .week-day {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      border-radius: 14px;
      padding: 12px;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 3%, transparent));
      min-width: 0;
    }
    .week-day.today {
      border-color: var(--fhc-accent, var(--primary-color));
      box-shadow: inset 0 0 0 1.5px var(--fhc-accent, var(--primary-color));
      background: var(--fhc-accent-soft);
    }
    .week-day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      font-size: 0.85em;
      font-weight: 700;
      text-transform: capitalize;
    }
    .week-day-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .week-day-count {
      opacity: 0.85;
      font-weight: 700;
      font-size: 0.85em;
      background: var(--fhc-accent-soft);
      color: var(--fhc-accent, var(--primary-color));
      padding: 2px 8px;
      border-radius: 999px;
      flex-shrink: 0;
    }
    .week-day-events {
      display: grid;
      gap: 6px;
    }
    .empty-day {
      opacity: 0.55;
      font-size: 0.85em;
      padding: 6px 2px;
    }
    .time-grid {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      border-radius: 14px;
      overflow: hidden;
      background: var(--fhc-surface, color-mix(in srgb, currentColor 3%, transparent));
    }
    .time-grid-header {
      display: flex;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      background: color-mix(in srgb, var(--fhc-accent, var(--primary-color)) 5%, transparent);
    }
    .time-gutter {
      width: 56px;
      flex-shrink: 0;
    }
    .time-day-header {
      flex: 1;
      min-width: 0;
      display: grid;
      justify-items: center;
      gap: 2px;
      padding: 8px 4px;
      cursor: pointer;
      font-size: 0.8em;
      font-weight: 700;
      text-transform: capitalize;
      border-left: 1px solid var(--divider-color, rgba(127, 127, 127, 0.1));
    }
    .time-day-name {
      opacity: 0.6;
      font-size: 0.85em;
    }
    .time-day-num {
      font-size: 1.15rem;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 50%;
    }
    .time-day-header.today .time-day-num {
      background: var(--fhc-accent, var(--primary-color));
      color: #fff;
    }
    .time-grid-allday {
      display: flex;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      padding: 4px 0;
    }
    .time-allday-cell {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      padding: 2px 4px;
      border-left: 1px solid var(--divider-color, rgba(127, 127, 127, 0.1));
    }
    .time-grid-body {
      display: flex;
      overflow-y: auto;
      max-height: min(70vh, 640px);
    }
    .time-gutter-col {
      width: 56px;
      flex-shrink: 0;
    }
    .time-hour-label {
      height: var(--fhc-hour-h, 56px);
      box-sizing: border-box;
      padding: 2px 8px 0 0;
      text-align: right;
      font-size: 0.7em;
      font-weight: 600;
      opacity: 0.5;
      transform: translateY(-0.6em);
    }
    .time-day-col {
      flex: 1;
      min-width: 0;
      position: relative;
      border-left: 1px solid var(--divider-color, rgba(127, 127, 127, 0.1));
    }
    .time-day-col.today {
      background: var(--fhc-accent-soft);
    }
    .time-hour-cell {
      height: var(--fhc-hour-h, 56px);
      box-sizing: border-box;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.1));
    }
    .time-hour-cell:first-child {
      border-top: none;
    }
    .time-event {
      position: absolute;
      display: grid;
      align-content: start;
      gap: 1px;
      margin: 0 2px;
      padding: 3px 6px;
      border: none;
      border-radius: 8px;
      border-left: 3px solid var(--event-color, var(--fhc-accent));
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 32%, white);
      color: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 65%, #10131a);
      text-align: left;
      font: inherit;
      font-size: var(--fhc-event-font, 0.78em);
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 120ms ease, box-shadow 120ms ease, z-index 0ms;
      z-index: 1;
    }
    .time-event:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
      z-index: 2;
    }
    .time-event.completed {
      opacity: 0.6;
      text-decoration: line-through;
    }
    .time-event-title {
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .time-event-time {
      font-size: 0.85em;
      opacity: 0.8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .time-event-badge {
      position: absolute;
      right: 4px;
      bottom: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      color: #fff;
      font-size: 0.62em;
      font-weight: 800;
      display: grid;
      place-items: center;
      box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.8);
    }
    .time-now-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: #ef4444;
      z-index: 3;
    }
    .time-now-line::before {
      content: "";
      position: absolute;
      left: -4px;
      top: -3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
    }
    .event {
      width: 100%;
      position: relative;
      display: grid;
      grid-template-columns: auto 26px 1fr auto;
      gap: 12px;
      align-items: center;
      text-align: left;
      cursor: pointer;
      min-height: var(--fhc-event-min-h, 56px);
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16));
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 14%, var(--fhc-surface, color-mix(in srgb, currentColor 4%, transparent)));
      border-radius: 14px;
      padding: var(--fhc-event-pad, 14px 16px);
      color: inherit;
      font: inherit;
      font-size: var(--fhc-event-font, 1em);
      transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }
    .event:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 16%, var(--fhc-surface, transparent));
    }
    .event.compact {
      grid-template-columns: 1fr;
      gap: 2px;
      min-height: auto;
      border: none;
      padding: 8px 10px;
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 30%, var(--fhc-surface, white));
    }
    .event.compact:hover {
      transform: none;
      background: color-mix(in srgb, var(--event-color, var(--fhc-accent)) 42%, var(--fhc-surface, white));
    }
    .event.compact .event-bar,
    .event.compact .event-icon,
    .event.compact .event-meta {
      display: none;
    }
    .event.compact .event-title {
      font-size: 0.85em;
      white-space: normal;
    }
    .event.compact .event-time {
      font-size: 0.72em;
      opacity: 0.8;
    }
    .event-bar {
      width: 5px;
      align-self: stretch;
      border-radius: 4px;
      background: var(--event-color, var(--fhc-accent, var(--primary-color)));
    }
    .event-icon {
      font-size: 1.2rem;
      opacity: 0.8;
    }
    .event-body {
      display: grid;
      gap: 3px;
      min-width: 0;
    }
    .event-title {
      font-weight: 700;
      font-size: 1.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event.completed .event-title {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .event-meta {
      font-size: 0.82em;
      opacity: 0.65;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event-time {
      font-size: 0.85em;
      opacity: 0.75;
      white-space: nowrap;
    }
    .event-time.today {
      color: var(--fhc-accent, var(--primary-color));
      font-weight: 700;
    }
    .weather-current {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1rem;
    }
    .weather-icon {
      font-size: 1.6rem;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--fhc-accent-soft);
      flex-shrink: 0;
    }
    .weather-temp {
      font-size: 1.4rem;
      font-weight: 700;
    }
    .weather-condition {
      opacity: 0.65;
      font-size: 0.85em;
      text-transform: capitalize;
    }
    .forecast {
      display: flex;
      gap: 6px;
      margin-top: 10px;
      justify-content: space-between;
    }
    .forecast-item {
      display: grid;
      justify-items: center;
      gap: 4px;
      font-size: 0.78em;
      flex: 1;
    }
    .forecast-day {
      text-transform: capitalize;
      opacity: 0.7;
    }
    .forecast-icon {
      font-size: 1.1rem;
    }
    .summary-count {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: var(--fhc-accent, var(--primary-color));
      line-height: 1;
    }
    .summary-label {
      margin: 2px 0 0;
      opacity: 0.6;
      font-size: 0.8em;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(2px);
      display: grid;
      place-items: center;
      z-index: 1000;
      padding: 12px;
    }
    .modal {
      position: relative;
      width: min(560px, 100%);
      max-height: 85vh;
      overflow: auto;
      background: var(--card-background-color, #fff);
      border-radius: 18px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }
    .modal-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      background: linear-gradient(135deg, var(--event-color, var(--fhc-accent)), color-mix(in srgb, var(--event-color, var(--fhc-accent)) 60%, #000));
      color: #fff;
    }
    .modal-source {
      font-size: 0.85em;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .modal-close {
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 1.1rem;
      line-height: 1;
    }
    .modal-body {
      padding: 18px 20px 20px;
    }
    .modal-body h2 {
      margin: 0 0 6px;
      font-size: 1.3rem;
    }
    .modal-description {
      opacity: 0.8;
      margin: 0 0 12px;
    }
    .modal-facts {
      display: grid;
      gap: 8px;
      margin-bottom: 16px;
    }
    .fact {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 0.9em;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
    }
    .fact-label {
      opacity: 0.6;
      font-weight: 600;
    }
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pill {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      background: transparent;
      color: inherit;
      padding: 12px 18px;
      min-height: 44px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 0.92em;
      font-weight: 500;
    }
    .pill:hover {
      background: var(--fhc-accent-soft);
    }
    .pill.danger {
      color: #ef4444;
      border-color: color-mix(in srgb, #ef4444 40%, transparent);
    }
    .empty {
      display: grid;
      justify-items: center;
      gap: 8px;
      opacity: 0.7;
      padding: 32px 8px;
      text-align: center;
    }
    .empty-icon {
      font-size: 2rem;
    }
    @media (max-width: 900px) {
      .content {
        flex-direction: column;
      }
      aside {
        width: 100%;
      }
    }
    @media (max-width: 700px) {
      .layout {
        flex-direction: column;
      }
      .side-nav {
        flex-direction: row;
        width: 100%;
        overflow-x: auto;
      }
    }
  `;
__decorateClass([
  n4({ attribute: false })
], FamilyHubCalendarCard.prototype, "hass", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "config", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "currentDate", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "currentView", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "activeLanguage", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "selectedEvent", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "todoItemsByEntity", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "activeSection", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "orientation", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "hiddenCalendarEntities", 2);
__decorateClass([
  r5()
], FamilyHubCalendarCard.prototype, "dailyForecast", 2);
FamilyHubCalendarCard = __decorateClass([
  t3("family-hub-calendar")
], FamilyHubCalendarCard);

// src/index.ts
init_family_hub_calendar_editor();
window.customCards = window.customCards || [];
window.customCards.push({
  type: "family-hub-calendar",
  name: "Family Hub Calendar",
  description: "Premium family planner card with calendar, tasks, meals, and weather"
});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
