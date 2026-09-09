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
    _ = /--!?>/g;
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
var DEFAULT_VIEWS, DEFAULT_CONFIG, normalizeConfig, dateRangeForView;
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
var FamilyHubCalendarEditor;
var init_family_hub_calendar_editor = __esm({
  "src/family-hub-calendar-editor.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_config();
    FamilyHubCalendarEditor = class extends i4 {
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
      updateCalendars(value) {
        if (!this.config) return;
        const existing = new Map(this.config.calendars.map((calendar) => [calendar.entity, calendar]));
        const entities = value.split("\n").map((entity) => entity.trim()).filter(Boolean).map((entity) => existing.get(entity) ?? { entity });
        this.updateValue("calendars", entities);
      }
      render() {
        if (!this.config) return b2``;
        return b2`<div class="form">
      <label>
        Title
        <input
          type="text"
          .value=${this.config.title || ""}
          @input=${(e5) => this.updateValue("title", e5.target.value)}
        />
      </label>
      <label>
        Calendar entities (one per line)
        <textarea
          rows="6"
          @input=${(e5) => this.updateCalendars(e5.target.value)}
        >${this.config.calendars.map((calendar) => calendar.entity).join("\n")}</textarea>
      </label>
      <label>
        Default view
        <select
          .value=${this.config.default_view || "week"}
          @change=${(e5) => this.updateValue("default_view", e5.target.value)}
        >
          <option value="day">Day</option>
          <option value="3day">3-Day</option>
          <option value="week">Week</option>
          <option value="work_week">Work Week</option>
          <option value="month">Month</option>
          <option value="agenda">Agenda</option>
          <option value="timeline">Timeline</option>
        </select>
      </label>
      <label>
        Language
        <select
          .value=${this.config.language || "en"}
          @change=${(e5) => this.updateValue("language", e5.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </label>
      <label>
        Weather entity
        <input
          type="text"
          .value=${this.config.weather_entity || ""}
          @input=${(e5) => this.updateValue("weather_entity", e5.target.value)}
        />
      </label>
      <label>
        Show tasks
        <input
          type="checkbox"
          .checked=${this.config.show_tasks !== false}
          @change=${(e5) => this.updateValue("show_tasks", e5.target.checked)}
        />
      </label>
      <label>
        Show meals
        <input
          type="checkbox"
          .checked=${this.config.show_meals !== false}
          @change=${(e5) => this.updateValue("show_meals", e5.target.checked)}
        />
      </label>
    </div>`;
      }
    };
    FamilyHubCalendarEditor.styles = i`
    .form {
      display: grid;
      gap: 12px;
    }
    label {
      display: grid;
      gap: 4px;
      font-size: 14px;
    }
  `;
    __decorateClass([
      n4({ attribute: false })
    ], FamilyHubCalendarEditor.prototype, "hass", 2);
    __decorateClass([
      r5()
    ], FamilyHubCalendarEditor.prototype, "config", 2);
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
  no_events: "No events in range"
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
  no_events: "Aucun \xE9v\xE9nement sur cette p\xE9riode"
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
  const parsed = new Date(value);
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
    this.languageOverridden = false;
    this.fetchedTodoEntities = "";
  }
  setConfig(config) {
    this.config = normalizeConfig(config);
    this.currentView = this.config.default_view || "week";
    this.languageOverridden = false;
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
    if (this.config && !this.languageOverridden && changedProps.has("hass")) {
      const hassLocale = this.hass?.locale?.language;
      if (hassLocale !== this.lastDetectedLocale) {
        this.lastDetectedLocale = hassLocale;
        this.activeLanguage = detectLanguage(this.hass, this.config.language);
      }
    }
    this.refreshTodoItems();
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
  t(key) {
    return localize(key, this.activeLanguage);
  }
  allEvents() {
    if (!this.hass || !this.config) return [];
    const calendarEvents = extractCalendarEvents(this.hass, this.config.calendars);
    const taskEvents = this.config.show_tasks === false ? [] : extractTasks(this.hass, this.config.task_entities, this.todoItemsByEntity);
    const mealEvents = this.config.show_meals === false ? [] : extractMeals(this.hass, this.config.meal_entities);
    return sortEvents([...calendarEvents, ...taskEvents, ...mealEvents]);
  }
  visibleEvents() {
    if (!this.config) return [];
    const { start, end } = dateRangeForView(this.currentDate, this.currentView, this.config.week_start_day || 1);
    return this.allEvents().filter((event) => event.end >= start && event.start <= end);
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
  async editEvent(event) {
    if (event.sourceType !== "calendar" || !this.hass) return;
    await this.hass.callService("calendar", "edit_event", {
      entity_id: event.calendarEntity,
      event_id: event.id
    });
  }
  async deleteEvent(event) {
    if (event.sourceType !== "calendar" || !this.hass) return;
    await this.hass.callService("calendar", "delete_event", {
      entity_id: event.calendarEntity,
      event_id: event.id
    });
    this.selectedEvent = void 0;
  }
  renderWeather() {
    if (!this.hass || !this.config?.weather_entity || this.config.show_weather === false) return A;
    const weather = this.hass.states[this.config.weather_entity];
    if (!weather) return A;
    const forecast = Array.isArray(weather.attributes.forecast) ? weather.attributes.forecast.slice(0, 3) : [];
    return b2`<section class="panel weather">
      <h3>${this.t("weather")}</h3>
      <div class="weather-current">${weather.state} · ${String(weather.attributes.temperature ?? "-")}</div>
      <div class="forecast">
        ${forecast.map(
      (day) => b2`<div class="forecast-item">
            <span>${String(day.datetime ?? "")}</span>
            <span>${String(day.condition ?? "")}</span>
            <span>${String(day.temperature ?? "-")}/${String(day.templow ?? "-")}</span>
            <span>${String(day.precipitation_probability ?? "0")}%</span>
          </div>`
    )}
      </div>
    </section>`;
  }
  renderEventItem(event) {
    return b2`<button class="event" @click=${() => this.selectedEvent = event}>
      <span class="dot" style=${`background:${event.calendarColor}`}></span>
      <span class="event-title">${event.title}</span>
      <span class="event-time">${this.formatDateTime(event.start)}</span>
    </button>`;
  }
  renderEvents() {
    const events = this.visibleEvents();
    if (!events.length) return b2`<div class="empty">${this.t("no_events")}</div>`;
    if (this.config?.grouped_by_calendar) {
      const groups = this.groupedEvents(events);
      return b2`${[...groups.entries()].map(
        ([calendarName, grouped]) => b2`<section class="group">
          <h3>${calendarName}</h3>
          ${grouped.map((event) => this.renderEventItem(event))}
        </section>`
      )}`;
    }
    return b2`${events.map((event) => this.renderEventItem(event))}`;
  }
  renderModal() {
    if (!this.selectedEvent) return A;
    const event = this.selectedEvent;
    return b2`<div class="modal-backdrop" @click=${() => this.selectedEvent = void 0}>
      <section class="modal" @click=${(e5) => e5.stopPropagation()}>
        <h2>${this.t("details")}</h2>
        <h3>${event.title}</h3>
        <p>${event.description || ""}</p>
        <p><strong>${this.t("start")}:</strong> ${this.formatDateTime(event.start)}</p>
        <p><strong>${this.t("end")}:</strong> ${this.formatDateTime(event.end)}</p>
        <p><strong>${this.t("duration")}:</strong> ${eventDuration(event)}</p>
        <p><strong>${this.t("calendar")}:</strong> ${event.calendarName}</p>
        ${event.location ? b2`<p><strong>${this.t("location")}:</strong> ${event.location}</p>` : A}
        ${event.organizer ? b2`<p><strong>${this.t("organizer")}:</strong> ${event.organizer}</p>` : A}
        ${event.attendees?.length ? b2`<p><strong>${this.t("attendees")}:</strong> ${event.attendees.join(", ")}</p>` : A}
        ${event.links?.length ? b2`<p><strong>${this.t("links")}:</strong> ${event.links.join(" \xB7 ")}</p>` : A}
        <div class="actions">
          <button @click=${() => this.editEvent(event)}>${this.t("edit")}</button>
          <button @click=${() => this.deleteEvent(event)}>${this.t("delete")}</button>
          <button @click=${() => this.copyEventDetails(event)}>${this.t("copy")}</button>
          ${event.location ? b2`<button @click=${() => window.open(`https://maps.google.com/?q=${encodeURIComponent(event.location)}`)}>
                ${this.t("open_map")}
              </button>` : A}
        </div>
      </section>
    </div>`;
  }
  render() {
    if (!this.config) return b2`<ha-card><div class="empty">Configuration required</div></ha-card>`;
    const title = this.config.title || "Family Hub Calendar";
    const views = this.config.enabled_views || [];
    return b2`<ha-card
      class="hub"
      @touchstart=${this.onTouchStart}
      @touchend=${this.onTouchEnd}
      style=${`--fhc-font-family:${this.config.font_family || "inherit"};--fhc-radius:${this.config.border_radius}px;`}
    >
      ${this.config.show_header !== false ? b2`<header>
            <div class="left">
              <h1>${title}</h1>
              <span>${this.formatDateTime(this.currentDate)}</span>
            </div>
            <div class="right">
              <button @click=${() => this.movePeriod(-1)}>${this.t("previous")}</button>
              <button @click=${() => this.currentDate = /* @__PURE__ */ new Date()}>${this.t("today")}</button>
              <button @click=${() => this.movePeriod(1)}>${this.t("next")}</button>
              <label>
                ${this.t("jump_to_date")}
                <input
                  type="date"
                  @change=${(e5) => {
      const input = e5.target;
      const value = input.value ? new Date(input.value) : /* @__PURE__ */ new Date();
      if (!Number.isNaN(value.getTime())) this.currentDate = value;
    }}
                />
              </label>
            </div>
          </header>` : A}

      <nav class="views">
        ${views.map(
      (view) => b2`<button class=${view === this.currentView ? "active" : ""} @click=${() => this.currentView = view}>
            ${this.t(view)}
          </button>`
    )}
        <select
          .value=${this.activeLanguage}
          @change=${(e5) => {
      this.languageOverridden = true;
      this.activeLanguage = e5.target.value;
    }}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </nav>

      <div class="content ${this.config.show_sidebar === false ? "no-sidebar" : ""}">
        <main>${this.renderEvents()}</main>
        ${this.config.show_sidebar === false ? A : b2`<aside>
              ${this.renderWeather()}
              <section class="panel summary">
                <h3>${this.t("daily_summary")}</h3>
                <p>${this.visibleEvents().length} events</p>
              </section>
            </aside>`}
      </div>
      ${this.renderModal()}
    </ha-card>`;
  }
};
FamilyHubCalendarCard.styles = i`
    :host {
      display: block;
    }
    .hub {
      border-radius: var(--fhc-radius, 16px);
      padding: 16px;
      font-family: var(--fhc-font-family, inherit);
      overflow: hidden;
    }
    header,
    .views,
    .content,
    .actions,
    .forecast-item {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .views {
      margin: 8px 0 12px;
      justify-content: flex-start;
    }
    .views button.active {
      background: var(--primary-color);
      color: white;
    }
    .content {
      align-items: flex-start;
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
    aside {
      width: min(35%, 320px);
      display: grid;
      gap: 8px;
    }
    .panel,
    .event,
    .group {
      border: 1px solid var(--divider-color, #374151);
      border-radius: 12px;
      padding: 10px;
      background: color-mix(in srgb, var(--ha-card-background, #111827) 85%, white 15%);
    }
    .event {
      width: 100%;
      display: grid;
      grid-template-columns: 12px 1fr auto;
      gap: 8px;
      align-items: center;
      text-align: left;
      cursor: pointer;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .event-title {
      font-weight: 600;
    }
    .event-time {
      opacity: 0.85;
      font-size: 0.9em;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: grid;
      place-items: center;
      z-index: 1000;
      padding: 12px;
    }
    .modal {
      width: min(680px, 100%);
      max-height: 80vh;
      overflow: auto;
      background: var(--card-background-color);
      border-radius: 14px;
      padding: 16px;
    }
    .actions {
      justify-content: flex-start;
      margin-top: 8px;
    }
    .empty {
      opacity: 0.8;
      padding: 8px;
    }
    @media (max-width: 900px) {
      .content {
        flex-direction: column;
      }
      aside {
        width: 100%;
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
