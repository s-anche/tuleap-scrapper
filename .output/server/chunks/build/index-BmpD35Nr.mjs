import { defineComponent, useSSRContext, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, withModifiers, Fragment, renderList, unref } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { d as useEpicStore } from './server.mjs';
import { storeToRefs } from 'pinia';
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
import 'vue-router';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "EpicCard",
  __ssrInlineRender: true,
  props: {
    epic: {}
  },
  setup(__props) {
    const props = __props;
    const statusColor = computed(() => {
      switch (props.epic.status?.toLowerCase()) {
        case "development in progress":
          return "warning";
        case "done":
          return "success";
        case "to do":
          return "info";
        case "cancelled":
          return "error";
        default:
          return "primary";
      }
    });
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
    const relatedArtifactsCount = computed(() => {
      if (!props.epic.links) return 0;
      return props.epic.links.features.length + props.epic.links.stories.length + props.epic.links.tasks.length + props.epic.links.defects.length;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_tooltip = resolveComponent("v-tooltip");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_spacer = resolveComponent("v-spacer");
      _push(ssrRenderComponent(_component_v_card, mergeProps({
        class: "epic-card h-100",
        elevation: "2",
        hover: "",
        to: `/epic/${_ctx.epic.id}`
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_card_title, { class: "d-flex align-center pa-4 pb-2" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="d-flex align-center flex-grow-1 mr-3" data-v-753786ca${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_v_chip, {
                    class: "mr-3",
                    variant: "flat",
                    size: "small",
                    color: statusColor.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(_ctx.epic.status)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(_ctx.epic.status), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_chip, {
                    variant: "tonal",
                    size: "small",
                    color: "primary"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` #${ssrInterpolate(_ctx.epic.id)}`);
                      } else {
                        return [
                          createTextVNode(" #" + toDisplayString(_ctx.epic.id), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (_ctx.epic.project.icon) {
                    _push3(`<div class="text-h6" data-v-753786ca${_scopeId2}>${ssrInterpolate(_ctx.epic.project.icon)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "d-flex align-center flex-grow-1 mr-3" }, [
                      createVNode(_component_v_chip, {
                        class: "mr-3",
                        variant: "flat",
                        size: "small",
                        color: statusColor.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(_ctx.epic.status), 1)
                        ]),
                        _: 1
                      }, 8, ["color"]),
                      createVNode(_component_v_chip, {
                        variant: "tonal",
                        size: "small",
                        color: "primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" #" + toDisplayString(_ctx.epic.id), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _ctx.epic.project.icon ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-h6"
                    }, toDisplayString(_ctx.epic.project.icon), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_card_subtitle, { class: "pa-4 pt-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-h6 font-weight-medium text-wrap" data-v-753786ca${_scopeId2}>${ssrInterpolate(_ctx.epic.title)}</div>`);
                  if (_ctx.epic.project.label) {
                    _push3(`<div class="text-body-2 text-grey-darken-1 mt-1" data-v-753786ca${_scopeId2}>${ssrInterpolate(_ctx.epic.project.label)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "text-h6 font-weight-medium text-wrap" }, toDisplayString(_ctx.epic.title), 1),
                    _ctx.epic.project.label ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-body-2 text-grey-darken-1 mt-1"
                    }, toDisplayString(_ctx.epic.project.label), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_card_text, { class: "pa-4 pt-2" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_row, { dense: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="info-section" data-v-753786ca${_scopeId4}><div class="text-overline mb-1" data-v-753786ca${_scopeId4}>Leading Team</div><div class="text-body-2" data-v-753786ca${_scopeId4}>`);
                              if (_ctx.epic.leadTeam) {
                                _push5(ssrRenderComponent(_component_v_chip, {
                                  variant: "tonal",
                                  size: "small",
                                  color: "success",
                                  class: "text-caption"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(_ctx.epic.leadTeam)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(_ctx.epic.leadTeam), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<span class="text-grey-darken-1" data-v-753786ca${_scopeId4}>Not assigned</span>`);
                              }
                              _push5(`</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "info-section" }, [
                                  createVNode("div", { class: "text-overline mb-1" }, "Leading Team"),
                                  createVNode("div", { class: "text-body-2" }, [
                                    _ctx.epic.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                      key: 0,
                                      variant: "tonal",
                                      size: "small",
                                      color: "success",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(_ctx.epic.leadTeam), 1)
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-grey-darken-1"
                                    }, "Not assigned"))
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="info-section" data-v-753786ca${_scopeId4}><div class="text-overline mb-1" data-v-753786ca${_scopeId4}>Estimation</div><div class="text-body-2" data-v-753786ca${_scopeId4}>`);
                              if (_ctx.epic.estimation || _ctx.epic.remainingEffort) {
                                _push5(`<div class="d-flex gap-1" data-v-753786ca${_scopeId4}>`);
                                if (_ctx.epic.estimation) {
                                  _push5(ssrRenderComponent(_component_v_chip, {
                                    variant: "tonal",
                                    size: "small",
                                    color: "info",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(_ctx.epic.estimation)} pts `);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(_ctx.epic.estimation) + " pts ", 1)
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (_ctx.epic.remainingEffort) {
                                  _push5(ssrRenderComponent(_component_v_chip, {
                                    variant: "tonal",
                                    size: "small",
                                    color: "warning",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(_ctx.epic.remainingEffort)} remaining `);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(_ctx.epic.remainingEffort) + " remaining ", 1)
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div>`);
                              } else {
                                _push5(`<span class="text-grey-darken-1" data-v-753786ca${_scopeId4}>Not estimated</span>`);
                              }
                              _push5(`</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "info-section" }, [
                                  createVNode("div", { class: "text-overline mb-1" }, "Estimation"),
                                  createVNode("div", { class: "text-body-2" }, [
                                    _ctx.epic.estimation || _ctx.epic.remainingEffort ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "d-flex gap-1"
                                    }, [
                                      _ctx.epic.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                        key: 0,
                                        variant: "tonal",
                                        size: "small",
                                        color: "info",
                                        class: "text-caption"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(_ctx.epic.estimation) + " pts ", 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      _ctx.epic.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                        key: 1,
                                        variant: "tonal",
                                        size: "small",
                                        color: "warning",
                                        class: "text-caption"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(_ctx.epic.remainingEffort) + " remaining ", 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-grey-darken-1"
                                    }, "Not estimated"))
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="info-section" data-v-753786ca${_scopeId4}><div class="text-overline mb-1" data-v-753786ca${_scopeId4}>Last Updated</div><div class="text-body-2" data-v-753786ca${_scopeId4}>${ssrInterpolate(formatDate(_ctx.epic.lastUpdateDate))}</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "info-section" }, [
                                  createVNode("div", { class: "text-overline mb-1" }, "Last Updated"),
                                  createVNode("div", { class: "text-body-2" }, toDisplayString(formatDate(_ctx.epic.lastUpdateDate)), 1)
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="info-section" data-v-753786ca${_scopeId4}><div class="text-overline mb-1" data-v-753786ca${_scopeId4}>Related Artifacts</div><div class="text-body-2" data-v-753786ca${_scopeId4}>`);
                              if (relatedArtifactsCount.value > 0) {
                                _push5(ssrRenderComponent(_component_v_chip, {
                                  variant: "tonal",
                                  size: "small",
                                  color: "secondary",
                                  class: "text-caption"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(relatedArtifactsCount.value)} linked `);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(relatedArtifactsCount.value) + " linked ", 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<span class="text-grey-darken-1" data-v-753786ca${_scopeId4}>None linked</span>`);
                              }
                              _push5(`</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "info-section" }, [
                                  createVNode("div", { class: "text-overline mb-1" }, "Related Artifacts"),
                                  createVNode("div", { class: "text-body-2" }, [
                                    relatedArtifactsCount.value > 0 ? (openBlock(), createBlock(_component_v_chip, {
                                      key: 0,
                                      variant: "tonal",
                                      size: "small",
                                      color: "secondary",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(relatedArtifactsCount.value) + " linked ", 1)
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-grey-darken-1"
                                    }, "None linked"))
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_col, {
                            cols: "12",
                            lg: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "info-section" }, [
                                createVNode("div", { class: "text-overline mb-1" }, "Leading Team"),
                                createVNode("div", { class: "text-body-2" }, [
                                  _ctx.epic.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                    key: 0,
                                    variant: "tonal",
                                    size: "small",
                                    color: "success",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(_ctx.epic.leadTeam), 1)
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-grey-darken-1"
                                  }, "Not assigned"))
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_col, {
                            cols: "12",
                            lg: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "info-section" }, [
                                createVNode("div", { class: "text-overline mb-1" }, "Estimation"),
                                createVNode("div", { class: "text-body-2" }, [
                                  _ctx.epic.estimation || _ctx.epic.remainingEffort ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "d-flex gap-1"
                                  }, [
                                    _ctx.epic.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                      key: 0,
                                      variant: "tonal",
                                      size: "small",
                                      color: "info",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(_ctx.epic.estimation) + " pts ", 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    _ctx.epic.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                      key: 1,
                                      variant: "tonal",
                                      size: "small",
                                      color: "warning",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(_ctx.epic.remainingEffort) + " remaining ", 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ])) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-grey-darken-1"
                                  }, "Not estimated"))
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_col, {
                            cols: "12",
                            lg: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "info-section" }, [
                                createVNode("div", { class: "text-overline mb-1" }, "Last Updated"),
                                createVNode("div", { class: "text-body-2" }, toDisplayString(formatDate(_ctx.epic.lastUpdateDate)), 1)
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_col, {
                            cols: "12",
                            lg: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "info-section" }, [
                                createVNode("div", { class: "text-overline mb-1" }, "Related Artifacts"),
                                createVNode("div", { class: "text-body-2" }, [
                                  relatedArtifactsCount.value > 0 ? (openBlock(), createBlock(_component_v_chip, {
                                    key: 0,
                                    variant: "tonal",
                                    size: "small",
                                    color: "secondary",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(relatedArtifactsCount.value) + " linked ", 1)
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-grey-darken-1"
                                  }, "None linked"))
                                ])
                              ])
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
                    createVNode(_component_v_row, { dense: "" }, {
                      default: withCtx(() => [
                        createVNode(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "info-section" }, [
                              createVNode("div", { class: "text-overline mb-1" }, "Leading Team"),
                              createVNode("div", { class: "text-body-2" }, [
                                _ctx.epic.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                  key: 0,
                                  variant: "tonal",
                                  size: "small",
                                  color: "success",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(_ctx.epic.leadTeam), 1)
                                  ]),
                                  _: 1
                                })) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "text-grey-darken-1"
                                }, "Not assigned"))
                              ])
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "info-section" }, [
                              createVNode("div", { class: "text-overline mb-1" }, "Estimation"),
                              createVNode("div", { class: "text-body-2" }, [
                                _ctx.epic.estimation || _ctx.epic.remainingEffort ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "d-flex gap-1"
                                }, [
                                  _ctx.epic.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                    key: 0,
                                    variant: "tonal",
                                    size: "small",
                                    color: "info",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(_ctx.epic.estimation) + " pts ", 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  _ctx.epic.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                    key: 1,
                                    variant: "tonal",
                                    size: "small",
                                    color: "warning",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(_ctx.epic.remainingEffort) + " remaining ", 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ])) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "text-grey-darken-1"
                                }, "Not estimated"))
                              ])
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "info-section" }, [
                              createVNode("div", { class: "text-overline mb-1" }, "Last Updated"),
                              createVNode("div", { class: "text-body-2" }, toDisplayString(formatDate(_ctx.epic.lastUpdateDate)), 1)
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_v_col, {
                          cols: "12",
                          lg: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "info-section" }, [
                              createVNode("div", { class: "text-overline mb-1" }, "Related Artifacts"),
                              createVNode("div", { class: "text-body-2" }, [
                                relatedArtifactsCount.value > 0 ? (openBlock(), createBlock(_component_v_chip, {
                                  key: 0,
                                  variant: "tonal",
                                  size: "small",
                                  color: "secondary",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(relatedArtifactsCount.value) + " linked ", 1)
                                  ]),
                                  _: 1
                                })) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "text-grey-darken-1"
                                }, "None linked"))
                              ])
                            ])
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
            _push2(ssrRenderComponent(_component_v_card_actions, { class: "pa-4 pt-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (_ctx.epic.summary) {
                    _push3(ssrRenderComponent(_component_v_tooltip, {
                      location: "top",
                      "max-width": "500"
                    }, {
                      activator: withCtx(({ props: props2 }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_v_btn, mergeProps(props2, {
                            variant: "text",
                            size: "small",
                            color: "primary",
                            onClick: () => {
                            }
                          }), {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_icon, { left: "" }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`mdi-information-outline`);
                                    } else {
                                      return [
                                        createTextVNode("mdi-information-outline")
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(` Summary `);
                              } else {
                                return [
                                  createVNode(_component_v_icon, { left: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-information-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Summary ")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_v_btn, mergeProps(props2, {
                              variant: "text",
                              size: "small",
                              color: "primary",
                              onClick: withModifiers(() => {
                              }, ["stop"])
                            }), {
                              default: withCtx(() => [
                                createVNode(_component_v_icon, { left: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-information-outline")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Summary ")
                              ]),
                              _: 2
                            }, 1040, ["onClick"])
                          ];
                        }
                      }),
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="pa-3" data-v-753786ca${_scopeId3}><div class="text-subtitle-2 mb-2" data-v-753786ca${_scopeId3}>Epic Summary</div><div class="text-body-2 summary-tooltip" data-v-753786ca${_scopeId3}>${_ctx.epic.summary ?? ""}</div></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "pa-3" }, [
                              createVNode("div", { class: "text-subtitle-2 mb-2" }, "Epic Summary"),
                              createVNode("div", {
                                class: "text-body-2 summary-tooltip",
                                innerHTML: _ctx.epic.summary
                              }, null, 8, ["innerHTML"])
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_v_spacer, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_btn, {
                    variant: "outlined",
                    size: "small",
                    href: _ctx.epic.htmlUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    color: "primary",
                    onClick: () => {
                    }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_icon, { left: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-open-in-new`);
                            } else {
                              return [
                                createTextVNode("mdi-open-in-new")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(` View in Tuleap `);
                      } else {
                        return [
                          createVNode(_component_v_icon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-open-in-new")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" View in Tuleap ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    _ctx.epic.summary ? (openBlock(), createBlock(_component_v_tooltip, {
                      key: 0,
                      location: "top",
                      "max-width": "500"
                    }, {
                      activator: withCtx(({ props: props2 }) => [
                        createVNode(_component_v_btn, mergeProps(props2, {
                          variant: "text",
                          size: "small",
                          color: "primary",
                          onClick: withModifiers(() => {
                          }, ["stop"])
                        }), {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { left: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-information-outline")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Summary ")
                          ]),
                          _: 2
                        }, 1040, ["onClick"])
                      ]),
                      default: withCtx(() => [
                        createVNode("div", { class: "pa-3" }, [
                          createVNode("div", { class: "text-subtitle-2 mb-2" }, "Epic Summary"),
                          createVNode("div", {
                            class: "text-body-2 summary-tooltip",
                            innerHTML: _ctx.epic.summary
                          }, null, 8, ["innerHTML"])
                        ])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(_component_v_spacer),
                    createVNode(_component_v_btn, {
                      variant: "outlined",
                      size: "small",
                      href: _ctx.epic.htmlUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      color: "primary",
                      onClick: withModifiers(() => {
                      }, ["stop"])
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_icon, { left: "" }, {
                          default: withCtx(() => [
                            createTextVNode("mdi-open-in-new")
                          ]),
                          _: 1
                        }),
                        createTextVNode(" View in Tuleap ")
                      ]),
                      _: 1
                    }, 8, ["href", "onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_card_title, { class: "d-flex align-center pa-4 pb-2" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "d-flex align-center flex-grow-1 mr-3" }, [
                    createVNode(_component_v_chip, {
                      class: "mr-3",
                      variant: "flat",
                      size: "small",
                      color: statusColor.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.epic.status), 1)
                      ]),
                      _: 1
                    }, 8, ["color"]),
                    createVNode(_component_v_chip, {
                      variant: "tonal",
                      size: "small",
                      color: "primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" #" + toDisplayString(_ctx.epic.id), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _ctx.epic.project.icon ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-h6"
                  }, toDisplayString(_ctx.epic.project.icon), 1)) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(_component_v_card_subtitle, { class: "pa-4 pt-0" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "text-h6 font-weight-medium text-wrap" }, toDisplayString(_ctx.epic.title), 1),
                  _ctx.epic.project.label ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-body-2 text-grey-darken-1 mt-1"
                  }, toDisplayString(_ctx.epic.project.label), 1)) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(_component_v_card_text, { class: "pa-4 pt-2" }, {
                default: withCtx(() => [
                  createVNode(_component_v_row, { dense: "" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_col, {
                        cols: "12",
                        lg: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "info-section" }, [
                            createVNode("div", { class: "text-overline mb-1" }, "Leading Team"),
                            createVNode("div", { class: "text-body-2" }, [
                              _ctx.epic.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                key: 0,
                                variant: "tonal",
                                size: "small",
                                color: "success",
                                class: "text-caption"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(_ctx.epic.leadTeam), 1)
                                ]),
                                _: 1
                              })) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-grey-darken-1"
                              }, "Not assigned"))
                            ])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_col, {
                        cols: "12",
                        lg: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "info-section" }, [
                            createVNode("div", { class: "text-overline mb-1" }, "Estimation"),
                            createVNode("div", { class: "text-body-2" }, [
                              _ctx.epic.estimation || _ctx.epic.remainingEffort ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "d-flex gap-1"
                              }, [
                                _ctx.epic.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                  key: 0,
                                  variant: "tonal",
                                  size: "small",
                                  color: "info",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(_ctx.epic.estimation) + " pts ", 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                _ctx.epic.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                  key: 1,
                                  variant: "tonal",
                                  size: "small",
                                  color: "warning",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(_ctx.epic.remainingEffort) + " remaining ", 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-grey-darken-1"
                              }, "Not estimated"))
                            ])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_col, {
                        cols: "12",
                        lg: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "info-section" }, [
                            createVNode("div", { class: "text-overline mb-1" }, "Last Updated"),
                            createVNode("div", { class: "text-body-2" }, toDisplayString(formatDate(_ctx.epic.lastUpdateDate)), 1)
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_col, {
                        cols: "12",
                        lg: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "info-section" }, [
                            createVNode("div", { class: "text-overline mb-1" }, "Related Artifacts"),
                            createVNode("div", { class: "text-body-2" }, [
                              relatedArtifactsCount.value > 0 ? (openBlock(), createBlock(_component_v_chip, {
                                key: 0,
                                variant: "tonal",
                                size: "small",
                                color: "secondary",
                                class: "text-caption"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(relatedArtifactsCount.value) + " linked ", 1)
                                ]),
                                _: 1
                              })) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-grey-darken-1"
                              }, "None linked"))
                            ])
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_v_card_actions, { class: "pa-4 pt-0" }, {
                default: withCtx(() => [
                  _ctx.epic.summary ? (openBlock(), createBlock(_component_v_tooltip, {
                    key: 0,
                    location: "top",
                    "max-width": "500"
                  }, {
                    activator: withCtx(({ props: props2 }) => [
                      createVNode(_component_v_btn, mergeProps(props2, {
                        variant: "text",
                        size: "small",
                        color: "primary",
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }), {
                        default: withCtx(() => [
                          createVNode(_component_v_icon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-information-outline")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Summary ")
                        ]),
                        _: 2
                      }, 1040, ["onClick"])
                    ]),
                    default: withCtx(() => [
                      createVNode("div", { class: "pa-3" }, [
                        createVNode("div", { class: "text-subtitle-2 mb-2" }, "Epic Summary"),
                        createVNode("div", {
                          class: "text-body-2 summary-tooltip",
                          innerHTML: _ctx.epic.summary
                        }, null, 8, ["innerHTML"])
                      ])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(_component_v_spacer),
                  createVNode(_component_v_btn, {
                    variant: "outlined",
                    size: "small",
                    href: _ctx.epic.htmlUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    color: "primary",
                    onClick: withModifiers(() => {
                    }, ["stop"])
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_icon, { left: "" }, {
                        default: withCtx(() => [
                          createTextVNode("mdi-open-in-new")
                        ]),
                        _: 1
                      }),
                      createTextVNode(" View in Tuleap ")
                    ]),
                    _: 1
                  }, 8, ["href", "onClick"])
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EpicCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const EpicCard = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-753786ca"]]), { __name: "EpicCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "KanbanColumn",
  __ssrInlineRender: true,
  props: {
    title: {},
    status: {},
    epics: {},
    color: { default: "primary" }
  },
  setup(__props) {
    const props = __props;
    const statusIcon = computed(() => {
      switch (props.status.toLowerCase()) {
        case "to do":
          return "mdi-clipboard-text-outline";
        case "development in progress":
          return "mdi-progress-wrench";
        case "done":
          return "mdi-check-circle";
        case "cancelled":
          return "mdi-cancel";
        default:
          return "mdi-clipboard-list";
      }
    });
    const statusColor = computed(() => {
      switch (props.status.toLowerCase()) {
        case "to do":
          return "info";
        case "development in progress":
          return "warning";
        case "done":
          return "success";
        case "cancelled":
          return "error";
        default:
          return "primary";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_spacer = resolveComponent("v-spacer");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_card_text = resolveComponent("v-card-text");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "kanban-column" }, _attrs))} data-v-ee046431>`);
      _push(ssrRenderComponent(_component_v_card, {
        class: "h-100 d-flex flex-column",
        variant: "outlined",
        color: statusColor.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_card_title, { class: "d-flex align-center pa-4 pb-2" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_icon, {
                    color: statusColor.value,
                    class: "mr-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(statusIcon.value)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(statusIcon.value), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span class="text-h6" data-v-ee046431${_scopeId2}>${ssrInterpolate(_ctx.title)}</span>`);
                  _push3(ssrRenderComponent(_component_v_spacer, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_chip, {
                    color: statusColor.value,
                    variant: "tonal",
                    size: "small",
                    class: "text-caption"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(_ctx.epics.length)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(_ctx.epics.length), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_icon, {
                      color: statusColor.value,
                      class: "mr-2"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(statusIcon.value), 1)
                      ]),
                      _: 1
                    }, 8, ["color"]),
                    createVNode("span", { class: "text-h6" }, toDisplayString(_ctx.title), 1),
                    createVNode(_component_v_spacer),
                    createVNode(_component_v_chip, {
                      color: statusColor.value,
                      variant: "tonal",
                      size: "small",
                      class: "text-caption"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.epics.length), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_divider, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_card_text, {
              class: "flex-grow-1 pa-2",
              style: { "max-height": "calc(100vh - 200px)", "overflow-y": "auto" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="d-flex flex-column ga-2" data-v-ee046431${_scopeId2}><!--[-->`);
                  ssrRenderList(_ctx.epics, (epic) => {
                    _push3(`<div class="kanban-card" data-v-ee046431${_scopeId2}>`);
                    _push3(ssrRenderComponent(EpicCard, { epic }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  });
                  _push3(`<!--]--></div>`);
                  if (_ctx.epics.length === 0) {
                    _push3(`<div class="text-center py-8" data-v-ee046431${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_icon, {
                      color: statusColor.value,
                      size: "48",
                      class: "mb-2"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(statusIcon.value)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(statusIcon.value), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<p class="text-body-2 text-medium-emphasis" data-v-ee046431${_scopeId2}> No epics in ${ssrInterpolate(_ctx.title.toLowerCase())}</p></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "d-flex flex-column ga-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.epics, (epic) => {
                        return openBlock(), createBlock("div", {
                          key: epic.id,
                          class: "kanban-card"
                        }, [
                          createVNode(EpicCard, { epic }, null, 8, ["epic"])
                        ]);
                      }), 128))
                    ]),
                    _ctx.epics.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-8"
                    }, [
                      createVNode(_component_v_icon, {
                        color: statusColor.value,
                        size: "48",
                        class: "mb-2"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(statusIcon.value), 1)
                        ]),
                        _: 1
                      }, 8, ["color"]),
                      createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " No epics in " + toDisplayString(_ctx.title.toLowerCase()), 1)
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_card_title, { class: "d-flex align-center pa-4 pb-2" }, {
                default: withCtx(() => [
                  createVNode(_component_v_icon, {
                    color: statusColor.value,
                    class: "mr-2"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(statusIcon.value), 1)
                    ]),
                    _: 1
                  }, 8, ["color"]),
                  createVNode("span", { class: "text-h6" }, toDisplayString(_ctx.title), 1),
                  createVNode(_component_v_spacer),
                  createVNode(_component_v_chip, {
                    color: statusColor.value,
                    variant: "tonal",
                    size: "small",
                    class: "text-caption"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.epics.length), 1)
                    ]),
                    _: 1
                  }, 8, ["color"])
                ]),
                _: 1
              }),
              createVNode(_component_v_divider),
              createVNode(_component_v_card_text, {
                class: "flex-grow-1 pa-2",
                style: { "max-height": "calc(100vh - 200px)", "overflow-y": "auto" }
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "d-flex flex-column ga-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.epics, (epic) => {
                      return openBlock(), createBlock("div", {
                        key: epic.id,
                        class: "kanban-card"
                      }, [
                        createVNode(EpicCard, { epic }, null, 8, ["epic"])
                      ]);
                    }), 128))
                  ]),
                  _ctx.epics.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-8"
                  }, [
                    createVNode(_component_v_icon, {
                      color: statusColor.value,
                      size: "48",
                      class: "mb-2"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(statusIcon.value), 1)
                      ]),
                      _: 1
                    }, 8, ["color"]),
                    createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " No epics in " + toDisplayString(_ctx.title.toLowerCase()), 1)
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/KanbanColumn.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const KanbanColumn = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-ee046431"]]), { __name: "KanbanColumn" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const epicStore = useEpicStore();
    const { epics, loading, error } = storeToRefs(epicStore);
    const groupedEpics = computed(() => {
      const groups = {};
      epics.value.forEach((epic) => {
        const status = epic.status || "No Status";
        if (!groups[status]) {
          groups[status] = [];
        }
        groups[status].push(epic);
      });
      return groups;
    });
    const kanbanColumns = computed(() => {
      const statusGroups = groupedEpics.value;
      const columns = [];
      for (const [status, epics2] of Object.entries(statusGroups)) {
        if (epics2.length > 0) {
          let color = "primary";
          const statusLower = status.toLowerCase();
          if (statusLower.includes("progress") || statusLower.includes("development")) {
            color = "warning";
          } else if (statusLower.includes("done") || statusLower.includes("closed")) {
            color = "success";
          } else if (statusLower.includes("cancel")) {
            color = "error";
          } else if (statusLower.includes("todo") || statusLower.includes("new")) {
            color = "info";
          }
          columns.push({
            title: status,
            status,
            color
          });
        }
      }
      return columns;
    });
    const totalEpics = computed(() => epics.value.length);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_spacer = resolveComponent("v-spacer");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "pa-4 bg-grey-lighten-4",
        style: { "width": "100%", "min-height": "100vh" }
      }, _attrs))} data-v-c897b27e>`);
      if (totalEpics.value > 0) {
        _push(`<div class="mb-4" data-v-c897b27e><div class="d-flex align-center mb-2" data-v-c897b27e>`);
        _push(ssrRenderComponent(_component_v_icon, {
          class: "mr-2",
          size: "large"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`mdi-view-column`);
            } else {
              return [
                createTextVNode("mdi-view-column")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<h2 class="text-h4" data-v-c897b27e>Epic Board</h2>`);
        _push(ssrRenderComponent(_component_v_spacer, null, null, _parent));
        _push(ssrRenderComponent(_component_v_chip, {
          color: "primary",
          variant: "tonal",
          size: "large",
          class: "text-subtitle-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(totalEpics.value)} Epic${ssrInterpolate(totalEpics.value > 1 ? "s" : "")}`);
            } else {
              return [
                createTextVNode(toDisplayString(totalEpics.value) + " Epic" + toDisplayString(totalEpics.value > 1 ? "s" : ""), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (totalEpics.value > 0) {
        _push(`<div class="kanban-board" data-v-c897b27e><div class="d-flex ga-4 align-start" style="${ssrRenderStyle({ "overflow-x": "auto", "min-height": "70vh" })}" data-v-c897b27e><!--[-->`);
        ssrRenderList(kanbanColumns.value, (column) => {
          _push(ssrRenderComponent(KanbanColumn, {
            key: column.status,
            title: column.title,
            status: column.status,
            epics: groupedEpics.value[column.status],
            color: column.color
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_v_row, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_col, {
                cols: "12",
                class: "text-center py-12"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_progress_circular, {
                      indeterminate: "",
                      color: "primary",
                      size: "64"
                    }, null, _parent3, _scopeId2));
                    _push3(`<p class="text-h6 mt-4" data-v-c897b27e${_scopeId2}>Loading epics...</p>`);
                  } else {
                    return [
                      createVNode(_component_v_progress_circular, {
                        indeterminate: "",
                        color: "primary",
                        size: "64"
                      }),
                      createVNode("p", { class: "text-h6 mt-4" }, "Loading epics...")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_v_col, {
                  cols: "12",
                  class: "text-center py-12"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_progress_circular, {
                      indeterminate: "",
                      color: "primary",
                      size: "64"
                    }),
                    createVNode("p", { class: "text-h6 mt-4" }, "Loading epics...")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading) && unref(epics).length === 0 && unref(error)) {
        _push(ssrRenderComponent(_component_v_row, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_col, {
                cols: "12",
                class: "text-center py-12"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_icon, {
                      size: "64",
                      color: "grey-lighten-2"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`mdi-clipboard-outline`);
                        } else {
                          return [
                            createTextVNode("mdi-clipboard-outline")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<p class="text-h6 mt-4" data-v-c897b27e${_scopeId2}>No epics found</p><p class="text-body-1" data-v-c897b27e${_scopeId2}>Please check your Epic IDs and try again.</p>`);
                  } else {
                    return [
                      createVNode(_component_v_icon, {
                        size: "64",
                        color: "grey-lighten-2"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("mdi-clipboard-outline")
                        ]),
                        _: 1
                      }),
                      createVNode("p", { class: "text-h6 mt-4" }, "No epics found"),
                      createVNode("p", { class: "text-body-1" }, "Please check your Epic IDs and try again.")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_v_col, {
                  cols: "12",
                  class: "text-center py-12"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_icon, {
                      size: "64",
                      color: "grey-lighten-2"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("mdi-clipboard-outline")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-h6 mt-4" }, "No epics found"),
                    createVNode("p", { class: "text-body-1" }, "Please check your Epic IDs and try again.")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading) && unref(epics).length === 0 && !unref(error)) {
        _push(ssrRenderComponent(_component_v_row, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_col, {
                cols: "12",
                class: "text-center py-12"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_icon, {
                      size: "64",
                      color: "primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`mdi-information-outline`);
                        } else {
                          return [
                            createTextVNode("mdi-information-outline")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<p class="text-h6 mt-4" data-v-c897b27e${_scopeId2}>Welcome to Epic Tracker</p><p class="text-body-1" data-v-c897b27e${_scopeId2}>Enter Epic IDs in the sidebar to get started</p>`);
                  } else {
                    return [
                      createVNode(_component_v_icon, {
                        size: "64",
                        color: "primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("mdi-information-outline")
                        ]),
                        _: 1
                      }),
                      createVNode("p", { class: "text-h6 mt-4" }, "Welcome to Epic Tracker"),
                      createVNode("p", { class: "text-body-1" }, "Enter Epic IDs in the sidebar to get started")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_v_col, {
                  cols: "12",
                  class: "text-center py-12"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_icon, {
                      size: "64",
                      color: "primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("mdi-information-outline")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-h6 mt-4" }, "Welcome to Epic Tracker"),
                    createVNode("p", { class: "text-body-1" }, "Enter Epic IDs in the sidebar to get started")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c897b27e"]]);

export { index as default };
//# sourceMappingURL=index-BmpD35Nr.mjs.map
