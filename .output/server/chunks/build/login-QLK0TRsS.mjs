import { defineComponent, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, ref, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { e as useAuthStore, n as navigateTo } from './server.mjs';
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
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TokenInput",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const tokenInput = ref("");
    const loading = ref(false);
    const error = ref("");
    const handleSubmit = async () => {
      if (!tokenInput.value.trim()) {
        error.value = "Token is required";
        return;
      }
      loading.value = true;
      error.value = "";
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (tokenInput.value.trim().length > 0) {
          authStore.setToken(tokenInput.value);
          await navigateTo("/");
        } else {
          error.value = "Token cannot be empty";
        }
      } catch {
        error.value = "Failed to validate token. Please try again.";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_container = resolveComponent("v-container");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_spacer = resolveComponent("v-spacer");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_icon = resolveComponent("v-icon");
      _push(ssrRenderComponent(_component_v_container, mergeProps({
        class: "fill-height",
        fluid: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_row, {
              align: "center",
              justify: "center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    sm: "6",
                    md: "4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_card, {
                          elevation: "8",
                          class: "pa-4"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_form, { onSubmit: handleSubmit }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_v_card_text, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_v_text_field, {
                                            modelValue: tokenInput.value,
                                            "onUpdate:modelValue": ($event) => tokenInput.value = $event,
                                            label: "Tuleap API Token",
                                            type: "password",
                                            placeholder: "Enter your Tuleap API token",
                                            required: "",
                                            "prepend-icon": "mdi-key",
                                            variant: "outlined",
                                            "error-messages": error.value
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_v_text_field, {
                                              modelValue: tokenInput.value,
                                              "onUpdate:modelValue": ($event) => tokenInput.value = $event,
                                              label: "Tuleap API Token",
                                              type: "password",
                                              placeholder: "Enter your Tuleap API token",
                                              required: "",
                                              "prepend-icon": "mdi-key",
                                              variant: "outlined",
                                              "error-messages": error.value
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_v_card_actions, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_v_spacer, null, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_v_btn, {
                                            type: "submit",
                                            loading: loading.value,
                                            disabled: loading.value,
                                            color: "primary",
                                            variant: "elevated",
                                            size: "large"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_v_icon, { start: "" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`mdi-login`);
                                                    } else {
                                                      return [
                                                        createTextVNode("mdi-login")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(` ${ssrInterpolate(loading.value ? "Validating..." : "Save Token")}`);
                                              } else {
                                                return [
                                                  createVNode(_component_v_icon, { start: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-login")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" " + toDisplayString(loading.value ? "Validating..." : "Save Token"), 1)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_v_spacer),
                                            createVNode(_component_v_btn, {
                                              type: "submit",
                                              loading: loading.value,
                                              disabled: loading.value,
                                              color: "primary",
                                              variant: "elevated",
                                              size: "large"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_v_icon, { start: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-login")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" " + toDisplayString(loading.value ? "Validating..." : "Save Token"), 1)
                                              ]),
                                              _: 1
                                            }, 8, ["loading", "disabled"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_v_card_text, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_text_field, {
                                            modelValue: tokenInput.value,
                                            "onUpdate:modelValue": ($event) => tokenInput.value = $event,
                                            label: "Tuleap API Token",
                                            type: "password",
                                            placeholder: "Enter your Tuleap API token",
                                            required: "",
                                            "prepend-icon": "mdi-key",
                                            variant: "outlined",
                                            "error-messages": error.value
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_v_card_actions, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_spacer),
                                          createVNode(_component_v_btn, {
                                            type: "submit",
                                            loading: loading.value,
                                            disabled: loading.value,
                                            color: "primary",
                                            variant: "elevated",
                                            size: "large"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_v_icon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-login")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" " + toDisplayString(loading.value ? "Validating..." : "Save Token"), 1)
                                            ]),
                                            _: 1
                                          }, 8, ["loading", "disabled"])
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_form, {
                                  onSubmit: withModifiers(handleSubmit, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card_text, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_text_field, {
                                          modelValue: tokenInput.value,
                                          "onUpdate:modelValue": ($event) => tokenInput.value = $event,
                                          label: "Tuleap API Token",
                                          type: "password",
                                          placeholder: "Enter your Tuleap API token",
                                          required: "",
                                          "prepend-icon": "mdi-key",
                                          variant: "outlined",
                                          "error-messages": error.value
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_v_card_actions, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_spacer),
                                        createVNode(_component_v_btn, {
                                          type: "submit",
                                          loading: loading.value,
                                          disabled: loading.value,
                                          color: "primary",
                                          variant: "elevated",
                                          size: "large"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_v_icon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-login")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" " + toDisplayString(loading.value ? "Validating..." : "Save Token"), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["loading", "disabled"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_card, {
                            elevation: "8",
                            class: "pa-4"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_form, {
                                onSubmit: withModifiers(handleSubmit, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_card_text, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_text_field, {
                                        modelValue: tokenInput.value,
                                        "onUpdate:modelValue": ($event) => tokenInput.value = $event,
                                        label: "Tuleap API Token",
                                        type: "password",
                                        placeholder: "Enter your Tuleap API token",
                                        required: "",
                                        "prepend-icon": "mdi-key",
                                        variant: "outlined",
                                        "error-messages": error.value
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_v_card_actions, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_spacer),
                                      createVNode(_component_v_btn, {
                                        type: "submit",
                                        loading: loading.value,
                                        disabled: loading.value,
                                        color: "primary",
                                        variant: "elevated",
                                        size: "large"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_icon, { start: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-login")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" " + toDisplayString(loading.value ? "Validating..." : "Save Token"), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["loading", "disabled"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_col, {
                      cols: "12",
                      sm: "6",
                      md: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, {
                          elevation: "8",
                          class: "pa-4"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_form, {
                              onSubmit: withModifiers(handleSubmit, ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_card_text, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_text_field, {
                                      modelValue: tokenInput.value,
                                      "onUpdate:modelValue": ($event) => tokenInput.value = $event,
                                      label: "Tuleap API Token",
                                      type: "password",
                                      placeholder: "Enter your Tuleap API token",
                                      required: "",
                                      "prepend-icon": "mdi-key",
                                      variant: "outlined",
                                      "error-messages": error.value
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_card_actions, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_spacer),
                                    createVNode(_component_v_btn, {
                                      type: "submit",
                                      loading: loading.value,
                                      disabled: loading.value,
                                      color: "primary",
                                      variant: "elevated",
                                      size: "large"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_icon, { start: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-login")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" " + toDisplayString(loading.value ? "Validating..." : "Save Token"), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["loading", "disabled"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_row, {
                align: "center",
                justify: "center"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_col, {
                    cols: "12",
                    sm: "6",
                    md: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card, {
                        elevation: "8",
                        class: "pa-4"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_v_form, {
                            onSubmit: withModifiers(handleSubmit, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_card_text, null, {
                                default: withCtx(() => [
                                  createVNode(_component_v_text_field, {
                                    modelValue: tokenInput.value,
                                    "onUpdate:modelValue": ($event) => tokenInput.value = $event,
                                    label: "Tuleap API Token",
                                    type: "password",
                                    placeholder: "Enter your Tuleap API token",
                                    required: "",
                                    "prepend-icon": "mdi-key",
                                    variant: "outlined",
                                    "error-messages": error.value
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_card_actions, null, {
                                default: withCtx(() => [
                                  createVNode(_component_v_spacer),
                                  createVNode(_component_v_btn, {
                                    type: "submit",
                                    loading: loading.value,
                                    disabled: loading.value,
                                    color: "primary",
                                    variant: "elevated",
                                    size: "large"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_icon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-login")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" " + toDisplayString(loading.value ? "Validating..." : "Save Token"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["loading", "disabled"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TokenInput.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TokenInput = Object.assign(_sfc_main$1, { __name: "TokenInput" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_container = resolveComponent("v-container");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_icon = resolveComponent("v-icon");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fill-height" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_v_container, {
        class: "fill-height",
        fluid: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_row, {
              align: "center",
              justify: "center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    class: "text-center mb-8"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="login-header"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_v_icon, {
                          size: "64",
                          color: "primary",
                          class: "mb-4"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-chart-line`);
                            } else {
                              return [
                                createTextVNode("mdi-chart-line")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<h1 class="text-h3 text-primary font-weight-light mb-2"${_scopeId3}>Tuleap Tracker</h1><p class="text-h6 text-medium-emphasis"${_scopeId3}>Enter your API token to access the dashboard</p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "login-header" }, [
                            createVNode(_component_v_icon, {
                              size: "64",
                              color: "primary",
                              class: "mb-4"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-chart-line")
                              ]),
                              _: 1
                            }),
                            createVNode("h1", { class: "text-h3 text-primary font-weight-light mb-2" }, "Tuleap Tracker"),
                            createVNode("p", { class: "text-h6 text-medium-emphasis" }, "Enter your API token to access the dashboard")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_col, {
                      cols: "12",
                      class: "text-center mb-8"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "login-header" }, [
                          createVNode(_component_v_icon, {
                            size: "64",
                            color: "primary",
                            class: "mb-4"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-chart-line")
                            ]),
                            _: 1
                          }),
                          createVNode("h1", { class: "text-h3 text-primary font-weight-light mb-2" }, "Tuleap Tracker"),
                          createVNode("p", { class: "text-h6 text-medium-emphasis" }, "Enter your API token to access the dashboard")
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TokenInput, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_row, {
                align: "center",
                justify: "center"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_col, {
                    cols: "12",
                    class: "text-center mb-8"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "login-header" }, [
                        createVNode(_component_v_icon, {
                          size: "64",
                          color: "primary",
                          class: "mb-4"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("mdi-chart-line")
                          ]),
                          _: 1
                        }),
                        createVNode("h1", { class: "text-h3 text-primary font-weight-light mb-2" }, "Tuleap Tracker"),
                        createVNode("p", { class: "text-h6 text-medium-emphasis" }, "Enter your API token to access the dashboard")
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(TokenInput)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-QLK0TRsS.mjs.map
