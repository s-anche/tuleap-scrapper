import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { f as useRoute$1, u as useRouter$1 } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
  __name: "EpicTreeView",
  __ssrInlineRender: true,
  props: {
    epic: {}
  },
  setup(__props) {
    const loading = ref(true);
    const error = ref(null);
    const treeData = ref([]);
    ref(["epic"]);
    const transformedTreeData = computed(() => {
      const transformNode = (node) => ({
        ...node,
        children: node.children ? sortByStatus(node.children).map(transformNode) : []
      });
      return treeData.value.map((item) => ({
        ...item,
        children: item.children ? sortByStatus(item.children).map(transformNode) : []
      }));
    });
    const getTypeIcon = (type) => {
      switch (type) {
        case "epic":
          return "mdi-mountain";
        case "feature":
          return "mdi-puzzle-outline";
        case "story":
          return "mdi-book-open-variant";
        case "task":
          return "mdi-clipboard-list";
        case "defect":
          return "mdi-bug";
        default:
          return "mdi-file-document";
      }
    };
    const getTypeColor = (type) => {
      switch (type) {
        case "epic":
          return "purple";
        case "feature":
          return "primary";
        case "story":
          return "success";
        case "task":
          return "info";
        case "defect":
          return "error";
        default:
          return "grey";
      }
    };
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "done":
          return "success";
        case "development in progress":
          return "warning";
        case "implementation in progress":
          return "warning";
        case "implemented":
          return "primary";
        case "to do":
          return "info";
        case "new":
          return "info";
        case "ready":
          return "info";
        case "cancelled":
          return "error";
        case "merged":
          return "success";
        case "done without dev":
          return "success";
        default:
          return "grey";
      }
    };
    const getStatusPriority = (status) => {
      switch (status?.toLowerCase()) {
        case "new":
          return 1;
        case "to do":
          return 2;
        case "ready":
          return 3;
        case "implementation in progress":
          return 4;
        case "development in progress":
          return 4;
        case "implemented":
          return 5;
        case "done":
          return 6;
        case "done without dev":
          return 6;
        case "merged":
          return 6;
        case "cancelled":
          return 7;
        default:
          return 8;
      }
    };
    const sortByStatus = (items) => {
      return [...items].sort((a, b) => {
        const priorityA = getStatusPriority(a.status || "");
        const priorityB = getStatusPriority(b.status || "");
        return priorityA - priorityB;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_expansion_panels = resolveComponent("v-expansion-panels");
      const _component_v_expansion_panel = resolveComponent("v-expansion-panel");
      const _component_v_expansion_panel_text = resolveComponent("v-expansion-panel-text");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list_item_title = resolveComponent("v-list-item-title");
      const _component_v_chip = resolveComponent("v-chip");
      _push(ssrRenderComponent(_component_v_card, mergeProps({ elevation: "2" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_card_title, { class: "d-flex align-center" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_icon, {
                    icon: getTypeIcon("epic"),
                    color: getTypeColor("epic"),
                    class: "mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Epic Artifacts Tree `);
                } else {
                  return [
                    createVNode(_component_v_icon, {
                      icon: getTypeIcon("epic"),
                      color: getTypeColor("epic"),
                      class: "mr-2"
                    }, null, 8, ["icon", "color"]),
                    createTextVNode(" Epic Artifacts Tree ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_card_text, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (loading.value) {
                    _push3(`<div class="text-center py-8" data-v-70eb07ab${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_progress_circular, {
                      indeterminate: "",
                      size: "48",
                      color: "primary"
                    }, null, _parent3, _scopeId2));
                    _push3(`<div class="mt-4" data-v-70eb07ab${_scopeId2}>Loading epic tree data...</div></div>`);
                  } else if (error.value) {
                    _push3(ssrRenderComponent(_component_v_alert, {
                      type: "error",
                      variant: "tonal",
                      class: "mb-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(error.value)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(error.value), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<div data-v-70eb07ab${_scopeId2}><div data-v-70eb07ab${_scopeId2}><h4 data-v-70eb07ab${_scopeId2}>Epic Artifacts Tree:</h4>`);
                    _push3(ssrRenderComponent(_component_v_expansion_panels, {
                      multiple: "",
                      variant: "accordion"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(transformedTreeData.value, (item) => {
                            _push4(ssrRenderComponent(_component_v_expansion_panel, {
                              key: item.id,
                              title: item.title
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_expansion_panel_text, null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        if (item.children && item.children.length > 0) {
                                          _push6(ssrRenderComponent(_component_v_list, null, {
                                            default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`<!--[-->`);
                                                ssrRenderList(item.children, (child) => {
                                                  _push7(`<!--[-->`);
                                                  if (child.type === "feature") {
                                                    _push7(ssrRenderComponent(_component_v_list_item, {
                                                      "prepend-icon": getTypeIcon(child.type),
                                                      href: child.htmlUrl,
                                                      target: "_blank",
                                                      class: "feature-item"
                                                    }, {
                                                      append: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                        if (_push8) {
                                                          if (child.status) {
                                                            _push8(ssrRenderComponent(_component_v_chip, {
                                                              color: getStatusColor(child.status),
                                                              size: "x-small",
                                                              variant: "tonal"
                                                            }, {
                                                              default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                                if (_push9) {
                                                                  _push9(`${ssrInterpolate(child.status)}`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(toDisplayString(child.status), 1)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 2
                                                            }, _parent8, _scopeId7));
                                                          } else {
                                                            _push8(`<!---->`);
                                                          }
                                                        } else {
                                                          return [
                                                            child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                              key: 0,
                                                              color: getStatusColor(child.status),
                                                              size: "x-small",
                                                              variant: "tonal"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(child.status), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"])) : createCommentVNode("", true)
                                                          ];
                                                        }
                                                      }),
                                                      default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                        if (_push8) {
                                                          _push8(ssrRenderComponent(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                            default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                              if (_push9) {
                                                                _push9(`${ssrInterpolate(child.title)} `);
                                                                if (child.linkedArtifactCount) {
                                                                  _push9(ssrRenderComponent(_component_v_chip, {
                                                                    size: "x-small",
                                                                    variant: "tonal",
                                                                    color: "info",
                                                                    class: "ml-2"
                                                                  }, {
                                                                    default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                                      if (_push10) {
                                                                        _push10(`${ssrInterpolate(child.linkedArtifactCount)} items `);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 2
                                                                  }, _parent9, _scopeId8));
                                                                } else {
                                                                  _push9(`<!---->`);
                                                                }
                                                              } else {
                                                                return [
                                                                  createTextVNode(toDisplayString(child.title) + " ", 1),
                                                                  child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                                    key: 0,
                                                                    size: "x-small",
                                                                    variant: "tonal",
                                                                    color: "info",
                                                                    class: "ml-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)) : createCommentVNode("", true)
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent8, _scopeId7));
                                                        } else {
                                                          return [
                                                            createVNode(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(child.title) + " ", 1),
                                                                child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                                  key: 0,
                                                                  size: "x-small",
                                                                  variant: "tonal",
                                                                  color: "info",
                                                                  class: "ml-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)) : createCommentVNode("", true)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent7, _scopeId6));
                                                  } else {
                                                    _push7(`<!---->`);
                                                  }
                                                  if (child.children && child.children.length > 0) {
                                                    _push7(ssrRenderComponent(_component_v_list, { class: "ml-8" }, {
                                                      default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                        if (_push8) {
                                                          _push8(`<!--[-->`);
                                                          ssrRenderList(child.children, (subArtifact) => {
                                                            _push8(ssrRenderComponent(_component_v_list_item, {
                                                              key: subArtifact.id,
                                                              "prepend-icon": getTypeIcon(subArtifact.type),
                                                              href: subArtifact.htmlUrl,
                                                              target: "_blank",
                                                              class: "sub-artifact-item",
                                                              density: "compact"
                                                            }, {
                                                              append: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                                if (_push9) {
                                                                  _push9(`<div class="d-flex align-center ga-2" data-v-70eb07ab${_scopeId8}>`);
                                                                  if (subArtifact.points) {
                                                                    _push9(ssrRenderComponent(_component_v_chip, {
                                                                      size: "x-small",
                                                                      variant: "tonal",
                                                                      color: "primary"
                                                                    }, {
                                                                      default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                                        if (_push10) {
                                                                          _push10(`${ssrInterpolate(subArtifact.points)}pts `);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent9, _scopeId8));
                                                                  } else {
                                                                    _push9(`<!---->`);
                                                                  }
                                                                  if (subArtifact.status) {
                                                                    _push9(ssrRenderComponent(_component_v_chip, {
                                                                      color: getStatusColor(subArtifact.status),
                                                                      size: "x-small",
                                                                      variant: "tonal"
                                                                    }, {
                                                                      default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                                        if (_push10) {
                                                                          _push10(`${ssrInterpolate(subArtifact.status)}`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(subArtifact.status), 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent9, _scopeId8));
                                                                  } else {
                                                                    _push9(`<!---->`);
                                                                  }
                                                                  _push9(`</div>`);
                                                                } else {
                                                                  return [
                                                                    createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                                      subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                                        key: 0,
                                                                        size: "x-small",
                                                                        variant: "tonal",
                                                                        color: "primary"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)) : createCommentVNode("", true),
                                                                      subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                                        key: 1,
                                                                        color: getStatusColor(subArtifact.status),
                                                                        size: "x-small",
                                                                        variant: "tonal"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(subArtifact.status), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["color"])) : createCommentVNode("", true)
                                                                    ])
                                                                  ];
                                                                }
                                                              }),
                                                              default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                                if (_push9) {
                                                                  _push9(ssrRenderComponent(_component_v_list_item_title, { class: "text-body-2" }, {
                                                                    default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                                      if (_push10) {
                                                                        _push10(`${ssrInterpolate(subArtifact.title)}`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode(toDisplayString(subArtifact.title), 1)
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 2
                                                                  }, _parent9, _scopeId8));
                                                                } else {
                                                                  return [
                                                                    createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(subArtifact.title), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 2
                                                            }, _parent8, _scopeId7));
                                                          });
                                                          _push8(`<!--]-->`);
                                                        } else {
                                                          return [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(child.children, (subArtifact) => {
                                                              return openBlock(), createBlock(_component_v_list_item, {
                                                                key: subArtifact.id,
                                                                "prepend-icon": getTypeIcon(subArtifact.type),
                                                                href: subArtifact.htmlUrl,
                                                                target: "_blank",
                                                                class: "sub-artifact-item",
                                                                density: "compact"
                                                              }, {
                                                                append: withCtx(() => [
                                                                  createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                                    subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                                      key: 0,
                                                                      size: "x-small",
                                                                      variant: "tonal",
                                                                      color: "primary"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)) : createCommentVNode("", true),
                                                                    subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                                      key: 1,
                                                                      color: getStatusColor(subArtifact.status),
                                                                      size: "x-small",
                                                                      variant: "tonal"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(subArtifact.status), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["color"])) : createCommentVNode("", true)
                                                                  ])
                                                                ]),
                                                                default: withCtx(() => [
                                                                  createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(subArtifact.title), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["prepend-icon", "href"]);
                                                            }), 128))
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent7, _scopeId6));
                                                  } else {
                                                    _push7(`<!---->`);
                                                  }
                                                  if (child.type !== "feature") {
                                                    _push7(ssrRenderComponent(_component_v_list_item, {
                                                      "prepend-icon": getTypeIcon(child.type),
                                                      href: child.htmlUrl,
                                                      target: "_blank",
                                                      class: "direct-item"
                                                    }, {
                                                      append: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                        if (_push8) {
                                                          _push8(`<div class="d-flex align-center ga-2" data-v-70eb07ab${_scopeId7}>`);
                                                          if (child.points) {
                                                            _push8(ssrRenderComponent(_component_v_chip, {
                                                              size: "x-small",
                                                              variant: "tonal",
                                                              color: "primary"
                                                            }, {
                                                              default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                                if (_push9) {
                                                                  _push9(`${ssrInterpolate(child.points)}pts `);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 2
                                                            }, _parent8, _scopeId7));
                                                          } else {
                                                            _push8(`<!---->`);
                                                          }
                                                          if (child.status) {
                                                            _push8(ssrRenderComponent(_component_v_chip, {
                                                              color: getStatusColor(child.status),
                                                              size: "x-small",
                                                              variant: "tonal"
                                                            }, {
                                                              default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                                if (_push9) {
                                                                  _push9(`${ssrInterpolate(child.status)}`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(toDisplayString(child.status), 1)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 2
                                                            }, _parent8, _scopeId7));
                                                          } else {
                                                            _push8(`<!---->`);
                                                          }
                                                          _push8(`</div>`);
                                                        } else {
                                                          return [
                                                            createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                              child.points ? (openBlock(), createBlock(_component_v_chip, {
                                                                key: 0,
                                                                size: "x-small",
                                                                variant: "tonal",
                                                                color: "primary"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)) : createCommentVNode("", true),
                                                              child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                                key: 1,
                                                                color: getStatusColor(child.status),
                                                                size: "x-small",
                                                                variant: "tonal"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(child.status), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"])) : createCommentVNode("", true)
                                                            ])
                                                          ];
                                                        }
                                                      }),
                                                      default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                        if (_push8) {
                                                          _push8(ssrRenderComponent(_component_v_list_item_title, null, {
                                                            default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                              if (_push9) {
                                                                _push9(`${ssrInterpolate(child.title)}`);
                                                              } else {
                                                                return [
                                                                  createTextVNode(toDisplayString(child.title), 1)
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent8, _scopeId7));
                                                        } else {
                                                          return [
                                                            createVNode(_component_v_list_item_title, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(child.title), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent7, _scopeId6));
                                                  } else {
                                                    _push7(`<!---->`);
                                                  }
                                                  _push7(`<!--]-->`);
                                                });
                                                _push7(`<!--]-->`);
                                              } else {
                                                return [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
                                                    return openBlock(), createBlock(Fragment, {
                                                      key: child.id
                                                    }, [
                                                      child.type === "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                        key: 0,
                                                        "prepend-icon": getTypeIcon(child.type),
                                                        href: child.htmlUrl,
                                                        target: "_blank",
                                                        class: "feature-item"
                                                      }, {
                                                        append: withCtx(() => [
                                                          child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                            key: 0,
                                                            color: getStatusColor(child.status),
                                                            size: "x-small",
                                                            variant: "tonal"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(child.status), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"])) : createCommentVNode("", true)
                                                        ]),
                                                        default: withCtx(() => [
                                                          createVNode(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(child.title) + " ", 1),
                                                              child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                                key: 0,
                                                                size: "x-small",
                                                                variant: "tonal",
                                                                color: "info",
                                                                class: "ml-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)) : createCommentVNode("", true)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true),
                                                      child.children && child.children.length > 0 ? (openBlock(), createBlock(_component_v_list, {
                                                        key: 1,
                                                        class: "ml-8"
                                                      }, {
                                                        default: withCtx(() => [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(child.children, (subArtifact) => {
                                                            return openBlock(), createBlock(_component_v_list_item, {
                                                              key: subArtifact.id,
                                                              "prepend-icon": getTypeIcon(subArtifact.type),
                                                              href: subArtifact.htmlUrl,
                                                              target: "_blank",
                                                              class: "sub-artifact-item",
                                                              density: "compact"
                                                            }, {
                                                              append: withCtx(() => [
                                                                createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                                  subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                                    key: 0,
                                                                    size: "x-small",
                                                                    variant: "tonal",
                                                                    color: "primary"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)) : createCommentVNode("", true),
                                                                  subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                                    key: 1,
                                                                    color: getStatusColor(subArtifact.status),
                                                                    size: "x-small",
                                                                    variant: "tonal"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(subArtifact.status), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["color"])) : createCommentVNode("", true)
                                                                ])
                                                              ]),
                                                              default: withCtx(() => [
                                                                createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(subArtifact.title), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["prepend-icon", "href"]);
                                                          }), 128))
                                                        ]),
                                                        _: 2
                                                      }, 1024)) : createCommentVNode("", true),
                                                      child.type !== "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                        key: 2,
                                                        "prepend-icon": getTypeIcon(child.type),
                                                        href: child.htmlUrl,
                                                        target: "_blank",
                                                        class: "direct-item"
                                                      }, {
                                                        append: withCtx(() => [
                                                          createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                            child.points ? (openBlock(), createBlock(_component_v_chip, {
                                                              key: 0,
                                                              size: "x-small",
                                                              variant: "tonal",
                                                              color: "primary"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)) : createCommentVNode("", true),
                                                            child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                              key: 1,
                                                              color: getStatusColor(child.status),
                                                              size: "x-small",
                                                              variant: "tonal"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(child.status), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"])) : createCommentVNode("", true)
                                                          ])
                                                        ]),
                                                        default: withCtx(() => [
                                                          createVNode(_component_v_list_item_title, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(child.title), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true)
                                                    ], 64);
                                                  }), 128))
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                      } else {
                                        return [
                                          item.children && item.children.length > 0 ? (openBlock(), createBlock(_component_v_list, { key: 0 }, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
                                                return openBlock(), createBlock(Fragment, {
                                                  key: child.id
                                                }, [
                                                  child.type === "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                    key: 0,
                                                    "prepend-icon": getTypeIcon(child.type),
                                                    href: child.htmlUrl,
                                                    target: "_blank",
                                                    class: "feature-item"
                                                  }, {
                                                    append: withCtx(() => [
                                                      child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                        key: 0,
                                                        color: getStatusColor(child.status),
                                                        size: "x-small",
                                                        variant: "tonal"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(child.status), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])) : createCommentVNode("", true)
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(child.title) + " ", 1),
                                                          child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                            key: 0,
                                                            size: "x-small",
                                                            variant: "tonal",
                                                            color: "info",
                                                            class: "ml-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)) : createCommentVNode("", true)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true),
                                                  child.children && child.children.length > 0 ? (openBlock(), createBlock(_component_v_list, {
                                                    key: 1,
                                                    class: "ml-8"
                                                  }, {
                                                    default: withCtx(() => [
                                                      (openBlock(true), createBlock(Fragment, null, renderList(child.children, (subArtifact) => {
                                                        return openBlock(), createBlock(_component_v_list_item, {
                                                          key: subArtifact.id,
                                                          "prepend-icon": getTypeIcon(subArtifact.type),
                                                          href: subArtifact.htmlUrl,
                                                          target: "_blank",
                                                          class: "sub-artifact-item",
                                                          density: "compact"
                                                        }, {
                                                          append: withCtx(() => [
                                                            createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                              subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                                key: 0,
                                                                size: "x-small",
                                                                variant: "tonal",
                                                                color: "primary"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)) : createCommentVNode("", true),
                                                              subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                                key: 1,
                                                                color: getStatusColor(subArtifact.status),
                                                                size: "x-small",
                                                                variant: "tonal"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(subArtifact.status), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"])) : createCommentVNode("", true)
                                                            ])
                                                          ]),
                                                          default: withCtx(() => [
                                                            createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(subArtifact.title), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["prepend-icon", "href"]);
                                                      }), 128))
                                                    ]),
                                                    _: 2
                                                  }, 1024)) : createCommentVNode("", true),
                                                  child.type !== "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                    key: 2,
                                                    "prepend-icon": getTypeIcon(child.type),
                                                    href: child.htmlUrl,
                                                    target: "_blank",
                                                    class: "direct-item"
                                                  }, {
                                                    append: withCtx(() => [
                                                      createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                        child.points ? (openBlock(), createBlock(_component_v_chip, {
                                                          key: 0,
                                                          size: "x-small",
                                                          variant: "tonal",
                                                          color: "primary"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)) : createCommentVNode("", true),
                                                        child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                          key: 1,
                                                          color: getStatusColor(child.status),
                                                          size: "x-small",
                                                          variant: "tonal"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(child.status), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"])) : createCommentVNode("", true)
                                                      ])
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(_component_v_list_item_title, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(child.title), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true)
                                                ], 64);
                                              }), 128))
                                            ]),
                                            _: 2
                                          }, 1024)) : createCommentVNode("", true)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_expansion_panel_text, null, {
                                      default: withCtx(() => [
                                        item.children && item.children.length > 0 ? (openBlock(), createBlock(_component_v_list, { key: 0 }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
                                              return openBlock(), createBlock(Fragment, {
                                                key: child.id
                                              }, [
                                                child.type === "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                  key: 0,
                                                  "prepend-icon": getTypeIcon(child.type),
                                                  href: child.htmlUrl,
                                                  target: "_blank",
                                                  class: "feature-item"
                                                }, {
                                                  append: withCtx(() => [
                                                    child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                      key: 0,
                                                      color: getStatusColor(child.status),
                                                      size: "x-small",
                                                      variant: "tonal"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.status), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])) : createCommentVNode("", true)
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.title) + " ", 1),
                                                        child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                          key: 0,
                                                          size: "x-small",
                                                          variant: "tonal",
                                                          color: "info",
                                                          class: "ml-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)) : createCommentVNode("", true)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true),
                                                child.children && child.children.length > 0 ? (openBlock(), createBlock(_component_v_list, {
                                                  key: 1,
                                                  class: "ml-8"
                                                }, {
                                                  default: withCtx(() => [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(child.children, (subArtifact) => {
                                                      return openBlock(), createBlock(_component_v_list_item, {
                                                        key: subArtifact.id,
                                                        "prepend-icon": getTypeIcon(subArtifact.type),
                                                        href: subArtifact.htmlUrl,
                                                        target: "_blank",
                                                        class: "sub-artifact-item",
                                                        density: "compact"
                                                      }, {
                                                        append: withCtx(() => [
                                                          createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                            subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                              key: 0,
                                                              size: "x-small",
                                                              variant: "tonal",
                                                              color: "primary"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)) : createCommentVNode("", true),
                                                            subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                              key: 1,
                                                              color: getStatusColor(subArtifact.status),
                                                              size: "x-small",
                                                              variant: "tonal"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(subArtifact.status), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"])) : createCommentVNode("", true)
                                                          ])
                                                        ]),
                                                        default: withCtx(() => [
                                                          createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(subArtifact.title), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["prepend-icon", "href"]);
                                                    }), 128))
                                                  ]),
                                                  _: 2
                                                }, 1024)) : createCommentVNode("", true),
                                                child.type !== "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                  key: 2,
                                                  "prepend-icon": getTypeIcon(child.type),
                                                  href: child.htmlUrl,
                                                  target: "_blank",
                                                  class: "direct-item"
                                                }, {
                                                  append: withCtx(() => [
                                                    createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                      child.points ? (openBlock(), createBlock(_component_v_chip, {
                                                        key: 0,
                                                        size: "x-small",
                                                        variant: "tonal",
                                                        color: "primary"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)) : createCommentVNode("", true),
                                                      child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                        key: 1,
                                                        color: getStatusColor(child.status),
                                                        size: "x-small",
                                                        variant: "tonal"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(child.status), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])) : createCommentVNode("", true)
                                                    ])
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode(_component_v_list_item_title, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.title), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true)
                                              ], 64);
                                            }), 128))
                                          ]),
                                          _: 2
                                        }, 1024)) : createCommentVNode("", true)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(transformedTreeData.value, (item) => {
                              return openBlock(), createBlock(_component_v_expansion_panel, {
                                key: item.id,
                                title: item.title
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_expansion_panel_text, null, {
                                    default: withCtx(() => [
                                      item.children && item.children.length > 0 ? (openBlock(), createBlock(_component_v_list, { key: 0 }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
                                            return openBlock(), createBlock(Fragment, {
                                              key: child.id
                                            }, [
                                              child.type === "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                key: 0,
                                                "prepend-icon": getTypeIcon(child.type),
                                                href: child.htmlUrl,
                                                target: "_blank",
                                                class: "feature-item"
                                              }, {
                                                append: withCtx(() => [
                                                  child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                    key: 0,
                                                    color: getStatusColor(child.status),
                                                    size: "x-small",
                                                    variant: "tonal"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.status), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])) : createCommentVNode("", true)
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.title) + " ", 1),
                                                      child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                        key: 0,
                                                        size: "x-small",
                                                        variant: "tonal",
                                                        color: "info",
                                                        class: "ml-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)) : createCommentVNode("", true)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true),
                                              child.children && child.children.length > 0 ? (openBlock(), createBlock(_component_v_list, {
                                                key: 1,
                                                class: "ml-8"
                                              }, {
                                                default: withCtx(() => [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(child.children, (subArtifact) => {
                                                    return openBlock(), createBlock(_component_v_list_item, {
                                                      key: subArtifact.id,
                                                      "prepend-icon": getTypeIcon(subArtifact.type),
                                                      href: subArtifact.htmlUrl,
                                                      target: "_blank",
                                                      class: "sub-artifact-item",
                                                      density: "compact"
                                                    }, {
                                                      append: withCtx(() => [
                                                        createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                          subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                            key: 0,
                                                            size: "x-small",
                                                            variant: "tonal",
                                                            color: "primary"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)) : createCommentVNode("", true),
                                                          subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                            key: 1,
                                                            color: getStatusColor(subArtifact.status),
                                                            size: "x-small",
                                                            variant: "tonal"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(subArtifact.status), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"])) : createCommentVNode("", true)
                                                        ])
                                                      ]),
                                                      default: withCtx(() => [
                                                        createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(subArtifact.title), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["prepend-icon", "href"]);
                                                  }), 128))
                                                ]),
                                                _: 2
                                              }, 1024)) : createCommentVNode("", true),
                                              child.type !== "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                key: 2,
                                                "prepend-icon": getTypeIcon(child.type),
                                                href: child.htmlUrl,
                                                target: "_blank",
                                                class: "direct-item"
                                              }, {
                                                append: withCtx(() => [
                                                  createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                    child.points ? (openBlock(), createBlock(_component_v_chip, {
                                                      key: 0,
                                                      size: "x-small",
                                                      variant: "tonal",
                                                      color: "primary"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)) : createCommentVNode("", true),
                                                    child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                      key: 1,
                                                      color: getStatusColor(child.status),
                                                      size: "x-small",
                                                      variant: "tonal"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.status), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])) : createCommentVNode("", true)
                                                  ])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_v_list_item_title, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.title), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true)
                                            ], 64);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1032, ["title"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div></div>`);
                  }
                  if (!loading.value && !error.value && treeData.value.length === 0) {
                    _push3(`<div class="text-center py-8" data-v-70eb07ab${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_icon, {
                      icon: "mdi-file-tree-outline",
                      size: "64",
                      color: "grey"
                    }, null, _parent3, _scopeId2));
                    _push3(`<div class="mt-4 text-h6" data-v-70eb07ab${_scopeId2}>No artifacts found</div><div class="text-body-2 text-grey" data-v-70eb07ab${_scopeId2}>This epic has no linked artifacts.</div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    loading.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-8"
                    }, [
                      createVNode(_component_v_progress_circular, {
                        indeterminate: "",
                        size: "48",
                        color: "primary"
                      }),
                      createVNode("div", { class: "mt-4" }, "Loading epic tree data...")
                    ])) : error.value ? (openBlock(), createBlock(_component_v_alert, {
                      key: 1,
                      type: "error",
                      variant: "tonal",
                      class: "mb-4"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(error.value), 1)
                      ]),
                      _: 1
                    })) : (openBlock(), createBlock("div", { key: 2 }, [
                      createVNode("div", null, [
                        createVNode("h4", null, "Epic Artifacts Tree:"),
                        createVNode(_component_v_expansion_panels, {
                          multiple: "",
                          variant: "accordion"
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(transformedTreeData.value, (item) => {
                              return openBlock(), createBlock(_component_v_expansion_panel, {
                                key: item.id,
                                title: item.title
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_expansion_panel_text, null, {
                                    default: withCtx(() => [
                                      item.children && item.children.length > 0 ? (openBlock(), createBlock(_component_v_list, { key: 0 }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
                                            return openBlock(), createBlock(Fragment, {
                                              key: child.id
                                            }, [
                                              child.type === "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                key: 0,
                                                "prepend-icon": getTypeIcon(child.type),
                                                href: child.htmlUrl,
                                                target: "_blank",
                                                class: "feature-item"
                                              }, {
                                                append: withCtx(() => [
                                                  child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                    key: 0,
                                                    color: getStatusColor(child.status),
                                                    size: "x-small",
                                                    variant: "tonal"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.status), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])) : createCommentVNode("", true)
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.title) + " ", 1),
                                                      child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                        key: 0,
                                                        size: "x-small",
                                                        variant: "tonal",
                                                        color: "info",
                                                        class: "ml-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)) : createCommentVNode("", true)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true),
                                              child.children && child.children.length > 0 ? (openBlock(), createBlock(_component_v_list, {
                                                key: 1,
                                                class: "ml-8"
                                              }, {
                                                default: withCtx(() => [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(child.children, (subArtifact) => {
                                                    return openBlock(), createBlock(_component_v_list_item, {
                                                      key: subArtifact.id,
                                                      "prepend-icon": getTypeIcon(subArtifact.type),
                                                      href: subArtifact.htmlUrl,
                                                      target: "_blank",
                                                      class: "sub-artifact-item",
                                                      density: "compact"
                                                    }, {
                                                      append: withCtx(() => [
                                                        createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                          subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                            key: 0,
                                                            size: "x-small",
                                                            variant: "tonal",
                                                            color: "primary"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)) : createCommentVNode("", true),
                                                          subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                            key: 1,
                                                            color: getStatusColor(subArtifact.status),
                                                            size: "x-small",
                                                            variant: "tonal"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(subArtifact.status), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"])) : createCommentVNode("", true)
                                                        ])
                                                      ]),
                                                      default: withCtx(() => [
                                                        createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(subArtifact.title), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["prepend-icon", "href"]);
                                                  }), 128))
                                                ]),
                                                _: 2
                                              }, 1024)) : createCommentVNode("", true),
                                              child.type !== "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                                key: 2,
                                                "prepend-icon": getTypeIcon(child.type),
                                                href: child.htmlUrl,
                                                target: "_blank",
                                                class: "direct-item"
                                              }, {
                                                append: withCtx(() => [
                                                  createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                    child.points ? (openBlock(), createBlock(_component_v_chip, {
                                                      key: 0,
                                                      size: "x-small",
                                                      variant: "tonal",
                                                      color: "primary"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)) : createCommentVNode("", true),
                                                    child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                      key: 1,
                                                      color: getStatusColor(child.status),
                                                      size: "x-small",
                                                      variant: "tonal"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.status), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])) : createCommentVNode("", true)
                                                  ])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_v_list_item_title, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.title), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true)
                                            ], 64);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1032, ["title"]);
                            }), 128))
                          ]),
                          _: 1
                        })
                      ])
                    ])),
                    !loading.value && !error.value && treeData.value.length === 0 ? (openBlock(), createBlock("div", {
                      key: 3,
                      class: "text-center py-8"
                    }, [
                      createVNode(_component_v_icon, {
                        icon: "mdi-file-tree-outline",
                        size: "64",
                        color: "grey"
                      }),
                      createVNode("div", { class: "mt-4 text-h6" }, "No artifacts found"),
                      createVNode("div", { class: "text-body-2 text-grey" }, "This epic has no linked artifacts.")
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_card_title, { class: "d-flex align-center" }, {
                default: withCtx(() => [
                  createVNode(_component_v_icon, {
                    icon: getTypeIcon("epic"),
                    color: getTypeColor("epic"),
                    class: "mr-2"
                  }, null, 8, ["icon", "color"]),
                  createTextVNode(" Epic Artifacts Tree ")
                ]),
                _: 1
              }),
              createVNode(_component_v_card_text, null, {
                default: withCtx(() => [
                  loading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-8"
                  }, [
                    createVNode(_component_v_progress_circular, {
                      indeterminate: "",
                      size: "48",
                      color: "primary"
                    }),
                    createVNode("div", { class: "mt-4" }, "Loading epic tree data...")
                  ])) : error.value ? (openBlock(), createBlock(_component_v_alert, {
                    key: 1,
                    type: "error",
                    variant: "tonal",
                    class: "mb-4"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(error.value), 1)
                    ]),
                    _: 1
                  })) : (openBlock(), createBlock("div", { key: 2 }, [
                    createVNode("div", null, [
                      createVNode("h4", null, "Epic Artifacts Tree:"),
                      createVNode(_component_v_expansion_panels, {
                        multiple: "",
                        variant: "accordion"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(transformedTreeData.value, (item) => {
                            return openBlock(), createBlock(_component_v_expansion_panel, {
                              key: item.id,
                              title: item.title
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_expansion_panel_text, null, {
                                  default: withCtx(() => [
                                    item.children && item.children.length > 0 ? (openBlock(), createBlock(_component_v_list, { key: 0 }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child) => {
                                          return openBlock(), createBlock(Fragment, {
                                            key: child.id
                                          }, [
                                            child.type === "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                              key: 0,
                                              "prepend-icon": getTypeIcon(child.type),
                                              href: child.htmlUrl,
                                              target: "_blank",
                                              class: "feature-item"
                                            }, {
                                              append: withCtx(() => [
                                                child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                  key: 0,
                                                  color: getStatusColor(child.status),
                                                  size: "x-small",
                                                  variant: "tonal"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(child.status), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])) : createCommentVNode("", true)
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_v_list_item_title, { class: "font-weight-medium" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(child.title) + " ", 1),
                                                    child.linkedArtifactCount ? (openBlock(), createBlock(_component_v_chip, {
                                                      key: 0,
                                                      size: "x-small",
                                                      variant: "tonal",
                                                      color: "info",
                                                      class: "ml-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(child.linkedArtifactCount) + " items ", 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)) : createCommentVNode("", true)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true),
                                            child.children && child.children.length > 0 ? (openBlock(), createBlock(_component_v_list, {
                                              key: 1,
                                              class: "ml-8"
                                            }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(child.children, (subArtifact) => {
                                                  return openBlock(), createBlock(_component_v_list_item, {
                                                    key: subArtifact.id,
                                                    "prepend-icon": getTypeIcon(subArtifact.type),
                                                    href: subArtifact.htmlUrl,
                                                    target: "_blank",
                                                    class: "sub-artifact-item",
                                                    density: "compact"
                                                  }, {
                                                    append: withCtx(() => [
                                                      createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                        subArtifact.points ? (openBlock(), createBlock(_component_v_chip, {
                                                          key: 0,
                                                          size: "x-small",
                                                          variant: "tonal",
                                                          color: "primary"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(subArtifact.points) + "pts ", 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)) : createCommentVNode("", true),
                                                        subArtifact.status ? (openBlock(), createBlock(_component_v_chip, {
                                                          key: 1,
                                                          color: getStatusColor(subArtifact.status),
                                                          size: "x-small",
                                                          variant: "tonal"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(subArtifact.status), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"])) : createCommentVNode("", true)
                                                      ])
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(_component_v_list_item_title, { class: "text-body-2" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(subArtifact.title), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["prepend-icon", "href"]);
                                                }), 128))
                                              ]),
                                              _: 2
                                            }, 1024)) : createCommentVNode("", true),
                                            child.type !== "feature" ? (openBlock(), createBlock(_component_v_list_item, {
                                              key: 2,
                                              "prepend-icon": getTypeIcon(child.type),
                                              href: child.htmlUrl,
                                              target: "_blank",
                                              class: "direct-item"
                                            }, {
                                              append: withCtx(() => [
                                                createVNode("div", { class: "d-flex align-center ga-2" }, [
                                                  child.points ? (openBlock(), createBlock(_component_v_chip, {
                                                    key: 0,
                                                    size: "x-small",
                                                    variant: "tonal",
                                                    color: "primary"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.points) + "pts ", 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)) : createCommentVNode("", true),
                                                  child.status ? (openBlock(), createBlock(_component_v_chip, {
                                                    key: 1,
                                                    color: getStatusColor(child.status),
                                                    size: "x-small",
                                                    variant: "tonal"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(child.status), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])) : createCommentVNode("", true)
                                                ])
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_v_list_item_title, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(child.title), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["prepend-icon", "href"])) : createCommentVNode("", true)
                                          ], 64);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["title"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ])
                  ])),
                  !loading.value && !error.value && treeData.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "text-center py-8"
                  }, [
                    createVNode(_component_v_icon, {
                      icon: "mdi-file-tree-outline",
                      size: "64",
                      color: "grey"
                    }),
                    createVNode("div", { class: "mt-4 text-h6" }, "No artifacts found"),
                    createVNode("div", { class: "text-body-2 text-grey" }, "This epic has no linked artifacts.")
                  ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EpicTreeView.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EpicTreeView = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-70eb07ab"]]), { __name: "EpicTreeView" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter$1();
    const epic = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const epicId = computed(() => {
      const id = route.params.id;
      return typeof id === "string" ? parseInt(id) : null;
    });
    const goBack = () => {
      router.back();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_container = resolveComponent("v-container");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_breadcrumbs = resolveComponent("v-breadcrumbs");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_divider = resolveComponent("v-divider");
      _push(ssrRenderComponent(_component_v_container, mergeProps({
        fluid: "",
        class: "pa-4"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex align-center mb-4" data-v-ad3668f1${_scopeId}>`);
            _push2(ssrRenderComponent(_component_v_btn, {
              variant: "text",
              "prepend-icon": "mdi-arrow-left",
              onClick: goBack,
              class: "mr-3"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Back `);
                } else {
                  return [
                    createTextVNode(" Back ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_breadcrumbs, {
              items: [
                { title: "Home", disabled: false, to: "/" },
                { title: `Epic #${epicId.value}`, disabled: true }
              ],
              class: "pa-0"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (loading.value) {
              _push2(`<div class="text-center py-8" data-v-ad3668f1${_scopeId}>`);
              _push2(ssrRenderComponent(_component_v_progress_circular, {
                indeterminate: "",
                size: "64",
                color: "primary"
              }, null, _parent2, _scopeId));
              _push2(`<div class="mt-4 text-h6" data-v-ad3668f1${_scopeId}>Loading epic details...</div></div>`);
            } else if (error.value) {
              _push2(ssrRenderComponent(_component_v_alert, {
                type: "error",
                variant: "tonal",
                closable: "",
                class: "mb-4"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(error.value)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(error.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (epic.value) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_v_card, {
                class: "mb-6",
                elevation: "2"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_card_title, { class: "d-flex align-center pa-6" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="d-flex align-center flex-grow-1" data-v-ad3668f1${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_v_chip, {
                            class: "mr-3",
                            variant: "flat",
                            size: "default",
                            color: epic.value.status === "Done" ? "success" : epic.value.status === "Development in progress" ? "warning" : "info"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(epic.value.status)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(epic.value.status), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<div data-v-ad3668f1${_scopeId3}><div class="text-h4" data-v-ad3668f1${_scopeId3}>${ssrInterpolate(epic.value.title)}</div><div class="text-subtitle-1 text-grey-darken-1 mt-1" data-v-ad3668f1${_scopeId3}>${ssrInterpolate(epic.value.project.label)} • Epic #${ssrInterpolate(epic.value.id)}</div></div></div>`);
                          if (epic.value.project.icon) {
                            _push4(`<div class="text-h4 ml-4" data-v-ad3668f1${_scopeId3}>${ssrInterpolate(epic.value.project.icon)}</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            createVNode("div", { class: "d-flex align-center flex-grow-1" }, [
                              createVNode(_component_v_chip, {
                                class: "mr-3",
                                variant: "flat",
                                size: "default",
                                color: epic.value.status === "Done" ? "success" : epic.value.status === "Development in progress" ? "warning" : "info"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(epic.value.status), 1)
                                ]),
                                _: 1
                              }, 8, ["color"]),
                              createVNode("div", null, [
                                createVNode("div", { class: "text-h4" }, toDisplayString(epic.value.title), 1),
                                createVNode("div", { class: "text-subtitle-1 text-grey-darken-1 mt-1" }, toDisplayString(epic.value.project.label) + " • Epic #" + toDisplayString(epic.value.id), 1)
                              ])
                            ]),
                            epic.value.project.icon ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-h4 ml-4"
                            }, toDisplayString(epic.value.project.icon), 1)) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_v_card_text, { class: "pa-6 pt-0" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_v_row, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_col, {
                                  cols: "12",
                                  md: "4"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="text-overline mb-2" data-v-ad3668f1${_scopeId5}>Leading Team</div>`);
                                      if (epic.value.leadTeam) {
                                        _push6(ssrRenderComponent(_component_v_chip, {
                                          variant: "tonal",
                                          color: "success"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`${ssrInterpolate(epic.value.leadTeam)}`);
                                            } else {
                                              return [
                                                createTextVNode(toDisplayString(epic.value.leadTeam), 1)
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<span class="text-grey-darken-1" data-v-ad3668f1${_scopeId5}>Not assigned</span>`);
                                      }
                                    } else {
                                      return [
                                        createVNode("div", { class: "text-overline mb-2" }, "Leading Team"),
                                        epic.value.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                          key: 0,
                                          variant: "tonal",
                                          color: "success"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(epic.value.leadTeam), 1)
                                          ]),
                                          _: 1
                                        })) : (openBlock(), createBlock("span", {
                                          key: 1,
                                          class: "text-grey-darken-1"
                                        }, "Not assigned"))
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_v_col, {
                                  cols: "12",
                                  md: "4"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="text-overline mb-2" data-v-ad3668f1${_scopeId5}>Estimation</div><div class="d-flex gap-2" data-v-ad3668f1${_scopeId5}>`);
                                      if (epic.value.estimation) {
                                        _push6(ssrRenderComponent(_component_v_chip, {
                                          variant: "tonal",
                                          color: "info"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`${ssrInterpolate(epic.value.estimation)} pts `);
                                            } else {
                                              return [
                                                createTextVNode(toDisplayString(epic.value.estimation) + " pts ", 1)
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      if (epic.value.remainingEffort) {
                                        _push6(ssrRenderComponent(_component_v_chip, {
                                          variant: "tonal",
                                          color: "warning"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`${ssrInterpolate(epic.value.remainingEffort)} remaining `);
                                            } else {
                                              return [
                                                createTextVNode(toDisplayString(epic.value.remainingEffort) + " remaining ", 1)
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(`</div>`);
                                    } else {
                                      return [
                                        createVNode("div", { class: "text-overline mb-2" }, "Estimation"),
                                        createVNode("div", { class: "d-flex gap-2" }, [
                                          epic.value.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                            key: 0,
                                            variant: "tonal",
                                            color: "info"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(epic.value.estimation) + " pts ", 1)
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true),
                                          epic.value.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                            key: 1,
                                            variant: "tonal",
                                            color: "warning"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(epic.value.remainingEffort) + " remaining ", 1)
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_v_col, {
                                  cols: "12",
                                  md: "4"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="text-overline mb-2" data-v-ad3668f1${_scopeId5}>Actions</div>`);
                                      _push6(ssrRenderComponent(_component_v_btn, {
                                        variant: "outlined",
                                        href: epic.value.htmlUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        "prepend-icon": "mdi-open-in-new"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(` View in Tuleap `);
                                          } else {
                                            return [
                                              createTextVNode(" View in Tuleap ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode("div", { class: "text-overline mb-2" }, "Actions"),
                                        createVNode(_component_v_btn, {
                                          variant: "outlined",
                                          href: epic.value.htmlUrl,
                                          target: "_blank",
                                          rel: "noopener noreferrer",
                                          "prepend-icon": "mdi-open-in-new"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" View in Tuleap ")
                                          ]),
                                          _: 1
                                        }, 8, ["href"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_col, {
                                    cols: "12",
                                    md: "4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "text-overline mb-2" }, "Leading Team"),
                                      epic.value.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                        key: 0,
                                        variant: "tonal",
                                        color: "success"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(epic.value.leadTeam), 1)
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "text-grey-darken-1"
                                      }, "Not assigned"))
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_v_col, {
                                    cols: "12",
                                    md: "4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "text-overline mb-2" }, "Estimation"),
                                      createVNode("div", { class: "d-flex gap-2" }, [
                                        epic.value.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                          key: 0,
                                          variant: "tonal",
                                          color: "info"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(epic.value.estimation) + " pts ", 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        epic.value.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                          key: 1,
                                          variant: "tonal",
                                          color: "warning"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(epic.value.remainingEffort) + " remaining ", 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_v_col, {
                                    cols: "12",
                                    md: "4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "text-overline mb-2" }, "Actions"),
                                      createVNode(_component_v_btn, {
                                        variant: "outlined",
                                        href: epic.value.htmlUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        "prepend-icon": "mdi-open-in-new"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" View in Tuleap ")
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_v_divider, { class: "my-4" }, null, _parent4, _scopeId3));
                          if (epic.value.summary) {
                            _push4(`<div class="mb-4" data-v-ad3668f1${_scopeId3}><div class="text-overline mb-2" data-v-ad3668f1${_scopeId3}>Summary</div><div class="text-body-1 summary-content" data-v-ad3668f1${_scopeId3}>${epic.value.summary ?? ""}</div></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            createVNode(_component_v_row, null, {
                              default: withCtx(() => [
                                createVNode(_component_v_col, {
                                  cols: "12",
                                  md: "4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-overline mb-2" }, "Leading Team"),
                                    epic.value.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                      key: 0,
                                      variant: "tonal",
                                      color: "success"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(epic.value.leadTeam), 1)
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-grey-darken-1"
                                    }, "Not assigned"))
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_col, {
                                  cols: "12",
                                  md: "4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-overline mb-2" }, "Estimation"),
                                    createVNode("div", { class: "d-flex gap-2" }, [
                                      epic.value.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                        key: 0,
                                        variant: "tonal",
                                        color: "info"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(epic.value.estimation) + " pts ", 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      epic.value.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                        key: 1,
                                        variant: "tonal",
                                        color: "warning"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(epic.value.remainingEffort) + " remaining ", 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_col, {
                                  cols: "12",
                                  md: "4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-overline mb-2" }, "Actions"),
                                    createVNode(_component_v_btn, {
                                      variant: "outlined",
                                      href: epic.value.htmlUrl,
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                      "prepend-icon": "mdi-open-in-new"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" View in Tuleap ")
                                      ]),
                                      _: 1
                                    }, 8, ["href"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_divider, { class: "my-4" }),
                            epic.value.summary ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mb-4"
                            }, [
                              createVNode("div", { class: "text-overline mb-2" }, "Summary"),
                              createVNode("div", {
                                class: "text-body-1 summary-content",
                                innerHTML: epic.value.summary
                              }, null, 8, ["innerHTML"])
                            ])) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_v_card_title, { class: "d-flex align-center pa-6" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "d-flex align-center flex-grow-1" }, [
                            createVNode(_component_v_chip, {
                              class: "mr-3",
                              variant: "flat",
                              size: "default",
                              color: epic.value.status === "Done" ? "success" : epic.value.status === "Development in progress" ? "warning" : "info"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(epic.value.status), 1)
                              ]),
                              _: 1
                            }, 8, ["color"]),
                            createVNode("div", null, [
                              createVNode("div", { class: "text-h4" }, toDisplayString(epic.value.title), 1),
                              createVNode("div", { class: "text-subtitle-1 text-grey-darken-1 mt-1" }, toDisplayString(epic.value.project.label) + " • Epic #" + toDisplayString(epic.value.id), 1)
                            ])
                          ]),
                          epic.value.project.icon ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-h4 ml-4"
                          }, toDisplayString(epic.value.project.icon), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_v_card_text, { class: "pa-6 pt-0" }, {
                        default: withCtx(() => [
                          createVNode(_component_v_row, null, {
                            default: withCtx(() => [
                              createVNode(_component_v_col, {
                                cols: "12",
                                md: "4"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-overline mb-2" }, "Leading Team"),
                                  epic.value.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                    key: 0,
                                    variant: "tonal",
                                    color: "success"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(epic.value.leadTeam), 1)
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-grey-darken-1"
                                  }, "Not assigned"))
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                md: "4"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-overline mb-2" }, "Estimation"),
                                  createVNode("div", { class: "d-flex gap-2" }, [
                                    epic.value.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                      key: 0,
                                      variant: "tonal",
                                      color: "info"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(epic.value.estimation) + " pts ", 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    epic.value.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                      key: 1,
                                      variant: "tonal",
                                      color: "warning"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(epic.value.remainingEffort) + " remaining ", 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                md: "4"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-overline mb-2" }, "Actions"),
                                  createVNode(_component_v_btn, {
                                    variant: "outlined",
                                    href: epic.value.htmlUrl,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    "prepend-icon": "mdi-open-in-new"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" View in Tuleap ")
                                    ]),
                                    _: 1
                                  }, 8, ["href"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_divider, { class: "my-4" }),
                          epic.value.summary ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "mb-4"
                          }, [
                            createVNode("div", { class: "text-overline mb-2" }, "Summary"),
                            createVNode("div", {
                              class: "text-body-1 summary-content",
                              innerHTML: epic.value.summary
                            }, null, 8, ["innerHTML"])
                          ])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(EpicTreeView, { epic: epic.value }, null, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "d-flex align-center mb-4" }, [
                createVNode(_component_v_btn, {
                  variant: "text",
                  "prepend-icon": "mdi-arrow-left",
                  onClick: goBack,
                  class: "mr-3"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Back ")
                  ]),
                  _: 1
                }),
                createVNode(_component_v_breadcrumbs, {
                  items: [
                    { title: "Home", disabled: false, to: "/" },
                    { title: `Epic #${epicId.value}`, disabled: true }
                  ],
                  class: "pa-0"
                }, null, 8, ["items"])
              ]),
              loading.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "text-center py-8"
              }, [
                createVNode(_component_v_progress_circular, {
                  indeterminate: "",
                  size: "64",
                  color: "primary"
                }),
                createVNode("div", { class: "mt-4 text-h6" }, "Loading epic details...")
              ])) : error.value ? (openBlock(), createBlock(_component_v_alert, {
                key: 1,
                type: "error",
                variant: "tonal",
                closable: "",
                class: "mb-4"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(error.value), 1)
                ]),
                _: 1
              })) : epic.value ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                createVNode(_component_v_card, {
                  class: "mb-6",
                  elevation: "2"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_card_title, { class: "d-flex align-center pa-6" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "d-flex align-center flex-grow-1" }, [
                          createVNode(_component_v_chip, {
                            class: "mr-3",
                            variant: "flat",
                            size: "default",
                            color: epic.value.status === "Done" ? "success" : epic.value.status === "Development in progress" ? "warning" : "info"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(epic.value.status), 1)
                            ]),
                            _: 1
                          }, 8, ["color"]),
                          createVNode("div", null, [
                            createVNode("div", { class: "text-h4" }, toDisplayString(epic.value.title), 1),
                            createVNode("div", { class: "text-subtitle-1 text-grey-darken-1 mt-1" }, toDisplayString(epic.value.project.label) + " • Epic #" + toDisplayString(epic.value.id), 1)
                          ])
                        ]),
                        epic.value.project.icon ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-h4 ml-4"
                        }, toDisplayString(epic.value.project.icon), 1)) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_card_text, { class: "pa-6 pt-0" }, {
                      default: withCtx(() => [
                        createVNode(_component_v_row, null, {
                          default: withCtx(() => [
                            createVNode(_component_v_col, {
                              cols: "12",
                              md: "4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-overline mb-2" }, "Leading Team"),
                                epic.value.leadTeam ? (openBlock(), createBlock(_component_v_chip, {
                                  key: 0,
                                  variant: "tonal",
                                  color: "success"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(epic.value.leadTeam), 1)
                                  ]),
                                  _: 1
                                })) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "text-grey-darken-1"
                                }, "Not assigned"))
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              md: "4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-overline mb-2" }, "Estimation"),
                                createVNode("div", { class: "d-flex gap-2" }, [
                                  epic.value.estimation ? (openBlock(), createBlock(_component_v_chip, {
                                    key: 0,
                                    variant: "tonal",
                                    color: "info"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(epic.value.estimation) + " pts ", 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  epic.value.remainingEffort ? (openBlock(), createBlock(_component_v_chip, {
                                    key: 1,
                                    variant: "tonal",
                                    color: "warning"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(epic.value.remainingEffort) + " remaining ", 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              md: "4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-overline mb-2" }, "Actions"),
                                createVNode(_component_v_btn, {
                                  variant: "outlined",
                                  href: epic.value.htmlUrl,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  "prepend-icon": "mdi-open-in-new"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" View in Tuleap ")
                                  ]),
                                  _: 1
                                }, 8, ["href"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_v_divider, { class: "my-4" }),
                        epic.value.summary ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mb-4"
                        }, [
                          createVNode("div", { class: "text-overline mb-2" }, "Summary"),
                          createVNode("div", {
                            class: "text-body-1 summary-content",
                            innerHTML: epic.value.summary
                          }, null, 8, ["innerHTML"])
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(EpicTreeView, { epic: epic.value }, null, 8, ["epic"])
              ], 64)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/epic/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ad3668f1"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-fqz5wXNB.mjs.map
