import { e as useAuthStore, d as useEpicStore, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, resolveComponent, withCtx, createVNode, unref, createTextVNode, createBlock, openBlock, Fragment, renderList, withKeys, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const authStore = useAuthStore();
    const epicStore = useEpicStore();
    const navigationItems = [
      {
        title: "Epic Board",
        icon: "mdi-view-column",
        to: "/"
      },
      {
        title: "Stories & Tasks",
        icon: "mdi-table",
        to: "/stories-table"
      }
    ];
    const handleLogout = () => {
      authStore.logout();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_app = resolveComponent("v-app");
      const _component_v_navigation_drawer = resolveComponent("v-navigation-drawer");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_app_bar = resolveComponent("v-app-bar");
      const _component_v_app_bar_title = resolveComponent("v-app-bar-title");
      const _component_v_main = resolveComponent("v-main");
      _push(ssrRenderComponent(_component_v_app, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_navigation_drawer, { permanent: "" }, {
              append: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_divider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_list, {
                    density: "compact",
                    nav: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_list_item, {
                          "prepend-icon": "mdi-logout",
                          title: "Logout",
                          onClick: handleLogout
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_list_item, {
                            "prepend-icon": "mdi-logout",
                            title: "Logout",
                            onClick: handleLogout
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_divider),
                    createVNode(_component_v_list, {
                      density: "compact",
                      nav: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_list_item, {
                          "prepend-icon": "mdi-logout",
                          title: "Logout",
                          onClick: handleLogout
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_list_item, {
                    "prepend-icon": "mdi-clipboard-list",
                    title: "Epic Tracker",
                    nav: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_divider, null, null, _parent3, _scopeId2));
                  _push3(`<div class="pa-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_ClientOnly, null, {
                    fallback: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_text_field, {
                          "model-value": "",
                          label: "Epic IDs",
                          placeholder: "416725, 123456",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "auto",
                          clearable: "",
                          class: "mb-3",
                          disabled: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_text_field, {
                            "model-value": "",
                            label: "Epic IDs",
                            placeholder: "416725, 123456",
                            variant: "outlined",
                            density: "compact",
                            "hide-details": "auto",
                            clearable: "",
                            class: "mb-3",
                            disabled: ""
                          })
                        ];
                      }
                    })
                  }, _parent3, _scopeId2));
                  _push3(`<div class="d-flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_v_btn, {
                    onClick: unref(epicStore).loadEpics,
                    disabled: !unref(epicStore).isValidInput || unref(epicStore).loading,
                    loading: unref(epicStore).loading,
                    color: "primary",
                    variant: "elevated",
                    size: "small",
                    class: "flex-grow-1"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_icon, { left: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-magnify`);
                            } else {
                              return [
                                createTextVNode("mdi-magnify")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(` Load `);
                      } else {
                        return [
                          createVNode(_component_v_icon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-magnify")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Load ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_btn, {
                    onClick: unref(epicStore).clearEpics,
                    disabled: unref(epicStore).loading,
                    color: "secondary",
                    variant: "outlined",
                    size: "small",
                    "min-width": "44"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_icon, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-close`);
                            } else {
                              return [
                                createTextVNode("mdi-close")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_icon, null, {
                            default: withCtx(() => [
                              createTextVNode("mdi-close")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(ssrRenderComponent(_component_v_divider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_list, {
                    density: "compact",
                    nav: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(navigationItems, (item) => {
                          _push4(ssrRenderComponent(_component_v_list_item, {
                            key: item.title,
                            "prepend-icon": item.icon,
                            title: item.title,
                            to: item.to,
                            active: unref(route).path === item.to,
                            color: "primary"
                          }, null, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(), createBlock(Fragment, null, renderList(navigationItems, (item) => {
                            return createVNode(_component_v_list_item, {
                              key: item.title,
                              "prepend-icon": item.icon,
                              title: item.title,
                              to: item.to,
                              active: unref(route).path === item.to,
                              color: "primary"
                            }, null, 8, ["prepend-icon", "title", "to", "active"]);
                          }), 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_list_item, {
                      "prepend-icon": "mdi-clipboard-list",
                      title: "Epic Tracker",
                      nav: ""
                    }),
                    createVNode(_component_v_divider),
                    createVNode("div", { class: "pa-4" }, [
                      createVNode(_component_ClientOnly, null, {
                        fallback: withCtx(() => [
                          createVNode(_component_v_text_field, {
                            "model-value": "",
                            label: "Epic IDs",
                            placeholder: "416725, 123456",
                            variant: "outlined",
                            density: "compact",
                            "hide-details": "auto",
                            clearable: "",
                            class: "mb-3",
                            disabled: ""
                          })
                        ]),
                        default: withCtx(() => [
                          createVNode(_component_v_text_field, {
                            "model-value": unref(epicStore).epicIds,
                            "onUpdate:modelValue": unref(epicStore).setEpicIds,
                            label: "Epic IDs",
                            placeholder: "416725, 123456",
                            variant: "outlined",
                            density: "compact",
                            onKeyup: withKeys(unref(epicStore).loadEpics, ["enter"]),
                            "error-messages": unref(epicStore).error,
                            "hide-details": "auto",
                            clearable: "",
                            class: "mb-3"
                          }, null, 8, ["model-value", "onUpdate:modelValue", "onKeyup", "error-messages"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "d-flex gap-2" }, [
                        createVNode(_component_v_btn, {
                          onClick: unref(epicStore).loadEpics,
                          disabled: !unref(epicStore).isValidInput || unref(epicStore).loading,
                          loading: unref(epicStore).loading,
                          color: "primary",
                          variant: "elevated",
                          size: "small",
                          class: "flex-grow-1"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { left: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-magnify")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Load ")
                          ]),
                          _: 1
                        }, 8, ["onClick", "disabled", "loading"]),
                        createVNode(_component_v_btn, {
                          onClick: unref(epicStore).clearEpics,
                          disabled: unref(epicStore).loading,
                          color: "secondary",
                          variant: "outlined",
                          size: "small",
                          "min-width": "44"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, null, {
                              default: withCtx(() => [
                                createTextVNode("mdi-close")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["onClick", "disabled"])
                      ])
                    ]),
                    createVNode(_component_v_divider),
                    createVNode(_component_v_list, {
                      density: "compact",
                      nav: ""
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(Fragment, null, renderList(navigationItems, (item) => {
                          return createVNode(_component_v_list_item, {
                            key: item.title,
                            "prepend-icon": item.icon,
                            title: item.title,
                            to: item.to,
                            active: unref(route).path === item.to,
                            color: "primary"
                          }, null, 8, ["prepend-icon", "title", "to", "active"]);
                        }), 64))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_app_bar, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_app_bar_title, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Epic Tracker`);
                      } else {
                        return [
                          createTextVNode("Epic Tracker")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_app_bar_title, null, {
                      default: withCtx(() => [
                        createTextVNode("Epic Tracker")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_main, { class: "bg-grey-lighten-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_navigation_drawer, { permanent: "" }, {
                append: withCtx(() => [
                  createVNode(_component_v_divider),
                  createVNode(_component_v_list, {
                    density: "compact",
                    nav: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_list_item, {
                        "prepend-icon": "mdi-logout",
                        title: "Logout",
                        onClick: handleLogout
                      })
                    ]),
                    _: 1
                  })
                ]),
                default: withCtx(() => [
                  createVNode(_component_v_list_item, {
                    "prepend-icon": "mdi-clipboard-list",
                    title: "Epic Tracker",
                    nav: ""
                  }),
                  createVNode(_component_v_divider),
                  createVNode("div", { class: "pa-4" }, [
                    createVNode(_component_ClientOnly, null, {
                      fallback: withCtx(() => [
                        createVNode(_component_v_text_field, {
                          "model-value": "",
                          label: "Epic IDs",
                          placeholder: "416725, 123456",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "auto",
                          clearable: "",
                          class: "mb-3",
                          disabled: ""
                        })
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_v_text_field, {
                          "model-value": unref(epicStore).epicIds,
                          "onUpdate:modelValue": unref(epicStore).setEpicIds,
                          label: "Epic IDs",
                          placeholder: "416725, 123456",
                          variant: "outlined",
                          density: "compact",
                          onKeyup: withKeys(unref(epicStore).loadEpics, ["enter"]),
                          "error-messages": unref(epicStore).error,
                          "hide-details": "auto",
                          clearable: "",
                          class: "mb-3"
                        }, null, 8, ["model-value", "onUpdate:modelValue", "onKeyup", "error-messages"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "d-flex gap-2" }, [
                      createVNode(_component_v_btn, {
                        onClick: unref(epicStore).loadEpics,
                        disabled: !unref(epicStore).isValidInput || unref(epicStore).loading,
                        loading: unref(epicStore).loading,
                        color: "primary",
                        variant: "elevated",
                        size: "small",
                        class: "flex-grow-1"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_v_icon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-magnify")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Load ")
                        ]),
                        _: 1
                      }, 8, ["onClick", "disabled", "loading"]),
                      createVNode(_component_v_btn, {
                        onClick: unref(epicStore).clearEpics,
                        disabled: unref(epicStore).loading,
                        color: "secondary",
                        variant: "outlined",
                        size: "small",
                        "min-width": "44"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_v_icon, null, {
                            default: withCtx(() => [
                              createTextVNode("mdi-close")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["onClick", "disabled"])
                    ])
                  ]),
                  createVNode(_component_v_divider),
                  createVNode(_component_v_list, {
                    density: "compact",
                    nav: ""
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(Fragment, null, renderList(navigationItems, (item) => {
                        return createVNode(_component_v_list_item, {
                          key: item.title,
                          "prepend-icon": item.icon,
                          title: item.title,
                          to: item.to,
                          active: unref(route).path === item.to,
                          color: "primary"
                        }, null, 8, ["prepend-icon", "title", "to", "active"]);
                      }), 64))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_v_app_bar, null, {
                default: withCtx(() => [
                  createVNode(_component_v_app_bar_title, null, {
                    default: withCtx(() => [
                      createTextVNode("Epic Tracker")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_v_main, { class: "bg-grey-lighten-4" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BoElCFpL.mjs.map
