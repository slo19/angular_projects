import {
  GuardsCheckEnd,
  NavigationEnd,
  NavigationStart,
  Router
} from "./chunk-5KX7ABYZ.js";
import {
  HttpClient,
  HttpClientModule
} from "./chunk-RE6GW4TL.js";
import {
  DOCUMENT,
  Location
} from "./chunk-MTMQRAJE.js";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  NgZone,
  ViewEncapsulation$1,
  isDevMode,
  setClassMetadata,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵinject,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-NU3M6P6R.js";
import {
  BehaviorSubject,
  NEVER,
  ReplaySubject,
  __awaiter,
  catchError,
  filter,
  first,
  firstValueFrom,
  map,
  merge,
  of,
  pluck,
  shareReplay,
  switchMap,
  takeWhile,
  tap
} from "./chunk-IONCU4BC.js";

// node_modules/@scullyio/ng-lib/fesm2015/scullyio-ng-lib.js
var _c0 = ["*"];
var ScullyDefaultSettings = {
  useTransferState: true,
  alwaysMonitor: false,
  manualIdle: false,
  baseURIForScullyContent: "http://localhost:1668"
};
var SCULLY_LIB_CONFIG = new InjectionToken("scullyLibConfig", {
  factory: () => ScullyDefaultSettings
});
var basePathOnly = (str) => {
  if (str.includes("#")) {
    str = str.split("#")[0];
  }
  if (str.includes("?")) {
    str = str.split("?")[0];
  }
  const cleanedUpVersion = str.endsWith("/") ? str.slice(0, -1) : str;
  return cleanedUpVersion;
};
var isScullyRunning = () => window && window["ScullyIO"] === "running";
var isScullyGenerated = () => window && window["ScullyIO"] === "generated";
function mergePaths(base, path) {
  base = base !== null && base !== void 0 ? base : "";
  if (base.endsWith("/") && path.startsWith("/")) {
    return `${base}${path.substr(1)}`;
  }
  if (!base.endsWith("/") && !path.startsWith("/")) {
    return `${base}/${path}`;
  }
  return `${base}${path}`;
}
var SCULLY_SCRIPT_ID = `ScullyIO-transfer-state`;
var SCULLY_STATE_START = `/** ___SCULLY_STATE_START___ */`;
var SCULLY_STATE_END = `/** ___SCULLY_STATE_END___ */`;
var initialStateDone = "__done__with__Initial__navigation__";
var TransferStateService = class {
  constructor(document2, router, http) {
    this.document = document2;
    this.router = router;
    this.http = http;
    this.inlineOnly = false;
    this.currentBaseUrl = "//";
    this.stateBS = new BehaviorSubject({});
    this.state$ = this.stateBS.pipe(filter((state) => state !== void 0));
    this.nextUrl = this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      switchMap((e) => {
        if (basePathOnly(this.initialUrl) === basePathOnly(e.url)) {
          this.initialUrl = initialStateDone;
          return NEVER;
        }
        return of(e);
      }),
      /** reset the state, so new components will never get stale data */
      tap(() => this.stateBS.next(void 0)),
      /** prevent emitting before navigation to _this_ URL is done. */
      switchMap((e) => this.router.events.pipe(filter((ev) => ev instanceof GuardsCheckEnd && ev.url === e.url), first())),
      map((ev) => basePathOnly(ev.urlAfterRedirects || ev.url)),
      shareReplay(1)
    );
  }
  startMonitoring() {
    if (window && window["ScullyIO-injected"] && window["ScullyIO-injected"].inlineStateOnly) {
      this.inlineOnly = true;
    }
    this.setupEnvForTransferState();
    this.setupStartNavMonitoring();
  }
  setupEnvForTransferState() {
    if (isScullyRunning()) {
      this.injectScript();
      const exposed = window["ScullyIO-exposed"] || {};
      if (exposed.transferState) {
        this.stateBS.next(exposed.transferState);
        this.saveState(exposed.transferState);
      }
    } else {
      this.initialUrl = window.location.pathname || "__no_NO_no__";
      this.initialUrl = this.initialUrl !== "/" && this.initialUrl.endsWith("/") ? this.initialUrl.slice(0, -1) : this.initialUrl;
      if (isScullyGenerated()) {
        this.stateBS.next(window && window[SCULLY_SCRIPT_ID] || {});
      }
    }
  }
  injectScript() {
    this.script = this.document.createElement("script");
    this.script.setAttribute("id", SCULLY_SCRIPT_ID);
    let last = this.document.body.lastChild;
    while (last.previousSibling.nodeName === "SCRIPT") {
      last = last.previousSibling;
    }
    this.document.body.insertBefore(this.script, last);
  }
  /**
   * Getstate will return an observable that containes the data.
   * It does so right after the navigation for the page has finished.
   * please note, this works SYNC on initial route, preventing a flash of content.
   * @param name The name of the state to
   */
  getState(name) {
    this.fetchTransferState();
    return this.state$.pipe(
      pluck(name)
      // tap((data) => console.log('tss', data))
    );
  }
  /**
   * Read the current state, and see if it has an value for the name.
   * (note the value it containes still can be undefined!)
   */
  stateHasKey(name) {
    return this.stateBS.value && this.stateBS.value.hasOwnProperty(name);
  }
  /**
   * Read the current state, and see if it has an value for the name.
   * ys also if there is actually an value in the state.
   */
  stateKeyHasValue(name) {
    return this.stateBS.value && this.stateBS.value.hasOwnProperty(name) && this.stateBS.value[name] != null;
  }
  /**
   * SetState will update the script in the generated page with data added.
   * @param name
   * @param val
   */
  setState(name, val) {
    const newState = Object.assign(Object.assign({}, this.stateBS.value), {
      [name]: val
    });
    this.stateBS.next(newState);
    this.saveState(newState);
  }
  saveState(newState) {
    if (isScullyRunning()) {
      this.script.textContent = `{window['${SCULLY_SCRIPT_ID}']=_u(String.raw\`${SCULLY_STATE_START}${escapeHtml(JSON.stringify(newState))}${SCULLY_STATE_END}\`);function _u(t){t=t.split('${SCULLY_STATE_START}')[1].split('${SCULLY_STATE_END}')[0];const u={'_~b~': "${"`"}",'_~q~': "'",'_~o~': '$','_~s~': '/','_~l~': '<','_~g~': '>'};return JSON.parse(t.replace(/_~d~/g,'\\\\"').replace(/_~[^]~/g, (s) => u[s]).replace(/\\n/g,'\\\\n').replace(/\\t/g,'\\\\t').replace(/\\r/g,'\\\\r'));}}`;
    }
  }
  /**
   * starts monitoring the router, and keep the url from the last completed navigation handy.
   */
  setupStartNavMonitoring() {
    if (!isScullyGenerated()) {
      return;
    }
    this.nextUrl.subscribe();
  }
  /**
   * Wraps an observable into scully's transfer state. If data for the provided `name` is
   * available in the state, it gets returned. Otherwise, the `originalState` observable will
   * be returned.
   *
   * On subsequent calls, the data in the state will always be returned. The `originalState` will
   * be returned only once.
   *
   * This is a convenience method which does not require you to use `getState`/`setState` manually.
   *
   * @param name state key
   * @param originalState an observable which yields the desired data
   */
  useScullyTransferState(name, originalState) {
    if (isScullyGenerated()) {
      return this.getState(name);
    }
    return originalState.pipe(tap((state) => this.setState(name, state)));
  }
  fetchTransferState() {
    return __awaiter(this, void 0, void 0, function* () {
      const base = (url) => url.split("/").filter((part) => part.trim() !== "")[0];
      yield new Promise((r) => setTimeout(r, 0));
      const currentUrl = yield firstValueFrom(this.nextUrl);
      const baseUrl = base(currentUrl);
      if (this.currentBaseUrl === baseUrl) {
        return;
      }
      this.currentBaseUrl = baseUrl;
      this.nextUrl.pipe(
        /** keep updating till we move to another route */
        takeWhile((url) => base(url) === this.currentBaseUrl),
        // Get the next route's data from the the index or data file
        switchMap((url) => this.inlineOnly ? this.readFromIndex(url) : this.readFromJson(url)),
        catchError((e) => {
          console.warn("Error while loading of parsing Scully state:", e);
          return of({});
        }),
        tap((newState) => {
          this.stateBS.next(newState);
        })
      ).subscribe({
        /** when completes (different URL) */
        complete: () => {
          this.currentBaseUrl = "//";
        }
      });
    });
  }
  readFromJson(url) {
    return firstValueFrom(this.http.get(dropPreSlash(mergePaths(url, "/data.json"))));
  }
  readFromIndex(url) {
    return firstValueFrom(this.http.get(dropPreSlash(mergePaths(url, "/index.html")), {
      responseType: "text"
    })).then((html) => {
      const newStateStr = html.split(SCULLY_STATE_START)[1].split(SCULLY_STATE_END)[0];
      return JSON.parse(unescapeHtml(newStateStr));
    });
  }
};
TransferStateService.ɵfac = function TransferStateService_Factory(t) {
  return new (t || TransferStateService)(ɵɵinject(DOCUMENT), ɵɵinject(Router), ɵɵinject(HttpClient));
};
TransferStateService.ɵprov = ɵɵdefineInjectable({
  token: TransferStateService,
  factory: TransferStateService.ɵfac,
  providedIn: "root"
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TransferStateService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [{
      type: Document,
      decorators: [{
        type: Inject,
        args: [DOCUMENT]
      }]
    }, {
      type: Router
    }, {
      type: HttpClient
    }];
  }, null);
})();
function dropPreSlash(string) {
  return string.startsWith("/") ? string.slice(1) : string;
}
function escapeHtml(text) {
  const escapedText = {
    "'": "_~q~",
    $: "_~o~",
    "`": "_~b~",
    "/": "_~s~",
    "<": "_~l~",
    ">": "_~g~"
  };
  return text.replace(/[\$`'<>\/]/g, (s) => escapedText[s]).replace(/\\\"/g, `_~d~`);
}
function unescapeHtml(text) {
  const unescapedText = {
    "_~q~": "'",
    "_~b~": "`",
    "_~o~": "$",
    "_~s~": "/",
    "_~l~": "<",
    "_~g~": ">"
  };
  return text.replace(/_~d~/g, `\\"`).replace(/_~[^]~/g, (s) => unescapedText[s]).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}
var IdleMonitorService = class {
  constructor(zone, router, conf, document2, tss) {
    this.zone = zone;
    this.router = router;
    this.document = document2;
    this.initialUrl = dropEndingSlash(window && window.location && window.location.pathname) || "";
    this.imState = new BehaviorSubject({
      idle: false,
      timeOut: 5 * 1e3
      // 5 seconds timeout as default
    });
    this.idle$ = this.imState.pipe(pluck("idle"));
    this.initApp = new Event("AngularInitialized", {
      bubbles: true,
      cancelable: false
    });
    this.appReady = new Event("AngularReady", {
      bubbles: true,
      cancelable: false
    });
    this.appTimeout = new Event("AngularTimeout", {
      bubbles: true,
      cancelable: false
    });
    this.scullyLibConfig = Object.assign({}, ScullyDefaultSettings, conf);
    const exposed = window["ScullyIO-exposed"] || {};
    const manualIdle = !!exposed.manualIdle;
    if (!this.scullyLibConfig.manualIdle && window && (this.scullyLibConfig.alwaysMonitor || isScullyRunning())) {
      this.document.dispatchEvent(this.initApp);
      this.router.events.pipe(
        filter((ev) => ev instanceof NavigationEnd && ev.urlAfterRedirects !== void 0),
        /** don't check the page that has this setting. event is only importand on page load */
        filter((ev) => manualIdle ? ev.urlAfterRedirects !== this.initialUrl : true),
        tap(() => this.zoneIdleCheck())
      ).subscribe();
    }
    if (this.scullyLibConfig.manualIdle) {
      this.document.dispatchEvent(this.initApp);
    }
    if (this.scullyLibConfig.useTransferState) {
      tss.startMonitoring();
    }
  }
  fireManualMyAppReadyEvent() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.document.dispatchEvent(this.appReady);
    });
  }
  init() {
    return firstValueFrom(this.idle$);
  }
  zoneIdleCheck() {
    return __awaiter(this, void 0, void 0, function* () {
      if (Zone === void 0) {
        return this.simpleTimeout();
      }
      const taskTrackingZone = Zone.current.get("TaskTrackingZone");
      if (taskTrackingZone === void 0) {
        return this.simpleTimeout();
      }
      if (this.imState.value.idle) {
        yield this.setState("idle", false);
      }
      this.zone.runOutsideAngular(() => {
        let tCancel;
        let count = 0;
        const startTime = Date.now();
        const monitor = () => {
          clearTimeout(tCancel);
          if (Date.now() - startTime > 30 * 1e3) {
            this.document.dispatchEvent(this.appTimeout);
            return;
          }
          if (taskTrackingZone.macroTasks.length > 0 && taskTrackingZone.macroTasks.find((z) => z.source.includes("XMLHttpRequest")) !== void 0 || count < 1) {
            tCancel = setTimeout(() => {
              count += 1;
              monitor();
            }, 50);
            return;
          }
          this.zone.run(() => {
            setTimeout(() => {
              this.document.dispatchEvent(this.appReady);
              this.setState("idle", true);
            }, 250);
          });
        };
        monitor();
      });
    });
  }
  simpleTimeout() {
    return __awaiter(this, void 0, void 0, function* () {
      console.warn("Scully is using timeouts, add the needed polyfills instead!");
      yield new Promise((r) => setTimeout(r, this.imState.value.timeOut));
      this.document.dispatchEvent(this.appReady);
    });
  }
  setPupeteerTimeoutValue(milliseconds) {
    this.imState.next(Object.assign(Object.assign({}, this.imState.value), {
      timeOut: milliseconds
    }));
  }
  setState(key, value) {
    this.imState.next(Object.assign(Object.assign({}, this.imState.value), {
      [key]: value
    }));
  }
};
IdleMonitorService.ɵfac = function IdleMonitorService_Factory(t) {
  return new (t || IdleMonitorService)(ɵɵinject(NgZone), ɵɵinject(Router), ɵɵinject(SCULLY_LIB_CONFIG), ɵɵinject(DOCUMENT), ɵɵinject(TransferStateService));
};
IdleMonitorService.ɵprov = ɵɵdefineInjectable({
  token: IdleMonitorService,
  factory: IdleMonitorService.ɵfac,
  providedIn: "root"
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IdleMonitorService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [{
      type: NgZone
    }, {
      type: Router
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [SCULLY_LIB_CONFIG]
      }]
    }, {
      type: Document,
      decorators: [{
        type: Inject,
        args: [DOCUMENT]
      }]
    }, {
      type: TransferStateService
    }];
  }, null);
})();
function dropEndingSlash(str) {
  return str.endsWith("/") ? str.slice(0, -1) : str;
}
var ScullyRoutesService = class {
  constructor(router, http) {
    this.router = router;
    this.http = http;
    this.refresh = new ReplaySubject(1);
    this.allRoutes$ = this.refresh.pipe(
      switchMap(() => this.http.get("assets/scully-routes.json")),
      catchError(() => {
        console.warn("Scully routes file not found, are you running the Scully generated version of your site?");
        return of([]);
      }),
      /** filter out all non-array results */
      filter((routes) => Array.isArray(routes)),
      map(this.cleanDups),
      shareReplay({
        refCount: false,
        bufferSize: 1
      })
    );
    this.available$ = this.allRoutes$.pipe(map((list) => list.filter((r) => r.hasOwnProperty("published") ? r.published !== false : true)), shareReplay({
      refCount: false,
      bufferSize: 1
    }));
    this.unPublished$ = this.allRoutes$.pipe(map((list) => list.filter((r) => r.hasOwnProperty("published") ? r.published === false : false)), shareReplay({
      refCount: false,
      bufferSize: 1
    }));
    this.topLevel$ = this.available$.pipe(map((routes) => routes.filter((r) => !r.route.slice(1).includes("/"))), shareReplay({
      refCount: false,
      bufferSize: 1
    }));
    this.reload();
  }
  /**
   * returns an observable that returns the route information for the
   * route currently selected. subscribes to route-events to update when needed
   */
  getCurrent() {
    if (!location) {
      return of();
    }
    return merge(of(new NavigationEnd(0, "", "")), this.router.events).pipe(filter((e) => e instanceof NavigationEnd), switchMap(() => this.available$), map((list) => {
      const curLocation = basePathOnly(encodeURI(location.pathname).trim());
      return list.find((r) => curLocation === basePathOnly(r.route.trim()) || r.slugs && Array.isArray(r.slugs) && r.slugs.find((slug) => curLocation.endsWith(basePathOnly(slug.trim()))));
    }));
  }
  /**
   * internal, as routes can have multiple slugs, and so occur multiple times
   * this util function collapses all slugs back into 1 route.
   */
  cleanDups(routes) {
    const m = /* @__PURE__ */ new Map();
    routes.forEach((r) => m.set(JSON.stringify(Object.assign(Object.assign({}, r), {
      route: hasOtherprops(r) ? "" : r.route
    })), r));
    return [...m.values()];
  }
  /** an utility that will force a reload of the `scully-routes.json` file */
  reload() {
    this.refresh.next();
  }
};
ScullyRoutesService.ɵfac = function ScullyRoutesService_Factory(t) {
  return new (t || ScullyRoutesService)(ɵɵinject(Router), ɵɵinject(HttpClient));
};
ScullyRoutesService.ɵprov = ɵɵdefineInjectable({
  token: ScullyRoutesService,
  factory: ScullyRoutesService.ɵfac,
  providedIn: "root"
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScullyRoutesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [{
      type: Router
    }, {
      type: HttpClient
    }];
  }, null);
})();
function hasOtherprops(obj) {
  const keys = Object.keys(obj);
  if (keys.length === 1 && keys.includes("route")) {
    return false;
  }
  if (keys.length === 2 && keys.includes("route") && keys.includes("title")) {
    return false;
  }
  return true;
}
function findComments(rootElem, searchText) {
  const comments = [];
  const iterator = document.createNodeIterator(
    rootElem,
    NodeFilter.SHOW_COMMENT,
    {
      acceptNode: (node) => {
        if (searchText && node.nodeValue && !node.nodeValue.includes(searchText)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
    // , false // IE-11 support requires this parameter.
  );
  let curNode;
  while (curNode = iterator.nextNode()) {
    comments.push(curNode);
  }
  return comments;
}
var scullyBegin = "<!--scullyContent-begin-->";
var scullyEnd = "<!--scullyContent-end-->";
var lastHandled;
var ScullyContentComponent = class {
  constructor(elmRef, srs, router, location2, http, document2, conf) {
    this.elmRef = elmRef;
    this.srs = srs;
    this.router = router;
    this.location = location2;
    this.http = http;
    this.document = document2;
    this.conf = conf;
    this.baseUrl = this.conf.useTransferState || ScullyDefaultSettings.useTransferState;
    this.elm = this.elmRef.nativeElement;
    this.routes = firstValueFrom(this.srs.allRoutes$);
    this.routeUpdates$ = this.router.events.pipe(
      filter((ev) => ev instanceof NavigationEnd),
      /** don't replace if we are already there */
      filter((ev) => lastHandled && !lastHandled.endsWith(basePathOnly(ev.urlAfterRedirects))),
      tap((r) => this.replaceContent())
    );
    this.routeSub = this.routeUpdates$.subscribe();
  }
  ngOnInit() {
    if (this.elm) {
      this.handlePage();
    }
  }
  /**
   * Loads the static content from scully into the view
   * Will fetch the content from sibling links with xmlHTTPrequest
   */
  handlePage() {
    return __awaiter(this, void 0, void 0, function* () {
      const curPage = basePathOnly(location.href);
      if (lastHandled === curPage) {
        return;
      }
      lastHandled = curPage;
      const template = this.document.createElement("template");
      const currentCssId = this.getCSSId(this.elm);
      if (window.scullyContent) {
        const htmlString = window.scullyContent.html;
        if (currentCssId !== window.scullyContent.cssId) {
          template.innerHTML = htmlString.split(window.scullyContent.cssId).join(currentCssId);
        } else {
          template.innerHTML = htmlString;
        }
      } else {
        if (isScullyRunning()) {
          return;
        }
        yield firstValueFrom(this.http.get(curPage + "/index.html", {
          responseType: "text"
        })).catch((e) => {
          if (isDevMode()) {
            const uri = new URL(location.href);
            const url = `${this.conf.baseURIForScullyContent}/${basePathOnly(uri.pathname)}/index.html`;
            return firstValueFrom(this.http.get(url, {
              responseType: "text"
            }));
          } else {
            return Promise.reject(e);
          }
        }).then((html) => {
          try {
            const htmlString = html.split(scullyBegin)[1].split(scullyEnd)[0];
            if (htmlString.includes("_ngcontent")) {
              const atr = "_ngcontent" + htmlString.split("_ngcontent")[1].split("=")[0];
              template.innerHTML = htmlString.split(atr).join(currentCssId);
            } else {
              template.innerHTML = htmlString;
            }
          } catch (e) {
            template.innerHTML = `<h2 id="___scully-parsing-error___">Sorry, could not parse static page content</h2>
            <p>This might happen if you are not using the static generated pages.</p>`;
          }
        }).catch((e) => {
          template.innerHTML = '<h2 id="___scully-parsing-error___">Sorry, could not load static page content</h2>';
          console.error("problem during loading static scully content", e);
        });
      }
      const parent = this.elm.parentElement || this.document.body;
      const begin = this.document.createComment("scullyContent-begin");
      const end = this.document.createComment("scullyContent-end");
      parent.insertBefore(begin, this.elm);
      parent.insertBefore(template.content, this.elm);
      parent.insertBefore(end, this.elm);
      setTimeout(() => this.document.querySelectorAll("[href]").forEach(this.upgradeToRoutelink.bind(this)), 10);
    });
  }
  /**
   * upgrade a **href** attributes to links that respect the Angular router
   * and don't do a full page reload. Only works on links that are found in the
   * Scully route config file.
   * @param elm the element containing the **hrefs**
   */
  upgradeToRoutelink(elm) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      if (!["A", "BUTTON"].includes(elm.tagName)) {
        return;
      }
      const hash = (_a = elm.dataset) === null || _a === void 0 ? void 0 : _a.hash;
      if (hash) {
        elm.setAttribute("href", "#" + hash);
        elm.setAttribute("onclick", "");
        elm.onclick = (ev) => {
          ev.preventDefault();
          const destination = document.getElementById(hash);
          if (destination) {
            const url = new URL(window.location.href);
            url.hash = hash;
            history.replaceState("", "", url.toString());
            destination.scrollIntoView();
          }
        };
        return;
      }
      const routes = yield this.routes;
      const href = elm.getAttribute("href");
      const lnk = basePathOnly(href.toLowerCase());
      const route = routes.find((r) => basePathOnly(r.route.toLowerCase()) === lnk);
      if (lnk && route && !lnk.startsWith("#")) {
        elm.onclick = (ev) => __awaiter(this, void 0, void 0, function* () {
          const splitRoute = route.route.split(`/`);
          const curSplit = location.pathname.split("/");
          curSplit.pop();
          ev.preventDefault();
          const routed = yield this.router.navigate(splitRoute).catch((e) => {
            console.error("routing error", e);
            return false;
          });
          if (!routed) {
            return;
          }
          if (curSplit.every((part, i) => splitRoute[i] === part) && splitRoute.length !== curSplit.length + 1) {
            setTimeout(() => this.replaceContent(), 10);
          }
        });
      }
    });
  }
  replaceContent() {
    window.scullyContent = void 0;
    const parent = this.elm.parentElement;
    let cur = findComments(parent, "scullyContent-begin")[0];
    while (cur && cur !== this.elm) {
      const next = cur.nextSibling;
      parent.removeChild(cur);
      cur = next;
    }
    this.handlePage();
  }
  getCSSId(elm) {
    return elm.getAttributeNames().find((a) => a.startsWith("_ngcontent")) || "";
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
    lastHandled = "//";
  }
};
ScullyContentComponent.ɵfac = function ScullyContentComponent_Factory(t) {
  return new (t || ScullyContentComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ScullyRoutesService), ɵɵdirectiveInject(Router), ɵɵdirectiveInject(Location), ɵɵdirectiveInject(HttpClient), ɵɵdirectiveInject(DOCUMENT), ɵɵdirectiveInject(SCULLY_LIB_CONFIG));
};
ScullyContentComponent.ɵcmp = ɵɵdefineComponent({
  type: ScullyContentComponent,
  selectors: [["scully-content"]],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ScullyContentComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["\n      :host {\n        display: none;\n      }\n      scully-content {\n        display: none;\n      }\n    "],
  encapsulation: 2,
  changeDetection: 0
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScullyContentComponent, [{
    type: Component,
    args: [{
      // tslint:disable-next-line: component-selector
      selector: "scully-content",
      template: "<ng-content></ng-content>",
      styles: [`
      :host {
        display: none;
      }
      scully-content {
        display: none;
      }
    `],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation$1.None,
      preserveWhitespaces: true
    }]
  }], function() {
    return [{
      type: ElementRef
    }, {
      type: ScullyRoutesService
    }, {
      type: Router
    }, {
      type: Location
    }, {
      type: HttpClient
    }, {
      type: Document,
      decorators: [{
        type: Inject,
        args: [DOCUMENT]
      }]
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [SCULLY_LIB_CONFIG]
      }]
    }];
  }, null);
})();
var ScullyContentModule = class {
};
ScullyContentModule.ɵfac = function ScullyContentModule_Factory(t) {
  return new (t || ScullyContentModule)();
};
ScullyContentModule.ɵmod = ɵɵdefineNgModule({
  type: ScullyContentModule,
  declarations: [ScullyContentComponent],
  exports: [ScullyContentComponent]
});
ScullyContentModule.ɵinj = ɵɵdefineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScullyContentModule, [{
    type: NgModule,
    args: [{
      declarations: [ScullyContentComponent],
      exports: [ScullyContentComponent]
    }]
  }], null, null);
})();
var ScullyLibModule = class _ScullyLibModule {
  constructor(idle) {
    this.idle = idle;
  }
  /**
   * We use a little trick to get a working idle-service.
   * First, we separate out the component in a separate module to prevent a circulair injection
   * second we create a constuctor that activates the IdleMonitorService. as that is provided for 'root'
   * there will be only 1 instance in our app.
   */
  static forRoot(config = ScullyDefaultSettings) {
    config = Object.assign({}, ScullyDefaultSettings, config);
    return {
      ngModule: _ScullyLibModule,
      providers: [{
        provide: SCULLY_LIB_CONFIG,
        useValue: config
      }]
    };
  }
};
ScullyLibModule.ɵfac = function ScullyLibModule_Factory(t) {
  return new (t || ScullyLibModule)(ɵɵinject(IdleMonitorService));
};
ScullyLibModule.ɵmod = ɵɵdefineNgModule({
  type: ScullyLibModule,
  imports: [ScullyContentModule, HttpClientModule],
  exports: [ScullyContentModule]
});
ScullyLibModule.ɵinj = ɵɵdefineInjector({
  imports: [[ScullyContentModule, HttpClientModule], ScullyContentModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScullyLibModule, [{
    type: NgModule,
    args: [{
      imports: [ScullyContentModule, HttpClientModule],
      exports: [ScullyContentModule]
    }]
  }], function() {
    return [{
      type: IdleMonitorService
    }];
  }, null);
})();
export {
  IdleMonitorService,
  ScullyContentComponent,
  ScullyContentModule,
  ScullyLibModule,
  ScullyRoutesService,
  TransferStateService,
  dropEndingSlash,
  isScullyGenerated,
  isScullyRunning
};
//# sourceMappingURL=@scullyio_ng-lib.js.map
