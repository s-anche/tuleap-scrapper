import { defineComponent, ref, watch, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { d as useEpicStore, g as apiService } from './server.mjs';
import { storeToRefs } from 'pinia';
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
import 'vue-router';

const useStoriesTable = () => {
  const flattenEpicTreeData = async (epics) => {
    const rows = [];
    for (const epic of epics) {
      try {
        const treeData = await apiService.getEpicTreeData(epic);
        for (const feature of treeData.features) {
          for (const subArtifact of feature.subArtifacts) {
            const row = await createTableRow(subArtifact, feature.artifact.id);
            rows.push(row);
          }
        }
        for (const story of treeData.directStories) {
          const row = await createTableRow(story, epic.id);
          rows.push(row);
        }
        for (const task of treeData.directTasks) {
          const row = await createTableRow(task, epic.id);
          rows.push(row);
        }
      } catch (error) {
        console.error(`Error processing epic ${epic.id}:`, error);
      }
    }
    return rows;
  };
  const createTableRow = async (artifact, parentId) => {
    const trackerLabel = artifact.tracker.label.toLowerCase();
    let type = "task";
    if (trackerLabel.includes("story") || trackerLabel.includes("stories")) {
      type = "story";
    } else if (trackerLabel.includes("defect") || trackerLabel.includes("bug") || trackerLabel.includes("issue")) {
      type = "defect";
    }
    return {
      id: artifact.id,
      parentId,
      title: artifact.title,
      status: artifact.status,
      points: apiService.extractPoints(artifact),
      sprint: await apiService.extractSprintInfo(artifact),
      type,
      htmlUrl: apiService.buildTuleapUrl(artifact.html_url, artifact.id)
    };
  };
  return {
    flattenEpicTreeData
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "stories-table",
  __ssrInlineRender: true,
  setup(__props) {
    const epicStore = useEpicStore();
    const { epics, loading } = storeToRefs(epicStore);
    const { flattenEpicTreeData } = useStoriesTable();
    const search = ref("");
    const statusFilter = ref("");
    const typeFilter = ref("");
    const page = ref(1);
    const itemsPerPage = ref(50);
    const tableRows = ref([]);
    const tableLoading = ref(false);
    const headers = [
      { title: "ID", value: "id", sortable: true, width: "100px" },
      { title: "Parent ID", value: "parentId", sortable: true, width: "100px" },
      { title: "Title", value: "title", sortable: true },
      { title: "Status", value: "status", sortable: true, width: "150px" },
      { title: "Points", value: "points", sortable: true, width: "100px" },
      { title: "Sprint", value: "sprint", sortable: true, width: "150px" }
    ];
    watch(
      epics,
      async (newEpics) => {
        if (newEpics.length > 0) {
          tableLoading.value = true;
          try {
            tableRows.value = await flattenEpicTreeData(newEpics);
          } catch (error) {
            console.error("Error flattening epic tree data:", error);
          } finally {
            tableLoading.value = false;
          }
        } else {
          tableRows.value = [];
        }
      },
      { immediate: true }
    );
    const isLoading = computed(() => loading.value || tableLoading.value);
    const statusOptions = computed(() => {
      const statuses = [...new Set(tableRows.value.map((row) => row.status))];
      return statuses.sort();
    });
    const typeOptions = computed(() => [
      { title: "Story", value: "story" },
      { title: "Task", value: "task" },
      { title: "Defect", value: "defect" }
    ]);
    const filteredRows = computed(() => {
      let filtered = tableRows.value;
      if (search.value) {
        const searchTerm = search.value.toLowerCase();
        filtered = filtered.filter(
          (row) => row.id.toString().includes(searchTerm) || row.title.toLowerCase().includes(searchTerm) || row.status.toLowerCase().includes(searchTerm) || row.sprint && row.sprint.toLowerCase().includes(searchTerm)
        );
      }
      if (statusFilter.value) {
        filtered = filtered.filter((row) => row.status === statusFilter.value);
      }
      if (typeFilter.value) {
        filtered = filtered.filter((row) => row.type === typeFilter.value);
      }
      return filtered.sort((a, b) => {
        if (!a.sprint && !b.sprint) return 0;
        if (!a.sprint) return -1;
        if (!b.sprint) return 1;
        return b.sprint.localeCompare(a.sprint);
      });
    });
    const storiesWithPointsData = computed(() => {
      const allStories = filteredRows.value.filter((row) => row.type === "story");
      const storiesWithPoints2 = allStories.filter((row) => row.points !== null && row.points >= 0);
      return storiesWithPoints2;
    });
    const storiesWithPoints = computed(() => storiesWithPointsData.value.length);
    const totalPoints = computed(() => {
      const total = storiesWithPointsData.value.reduce((sum, row) => sum + (row.points || 0), 0);
      return total;
    });
    const meanPointsPerStory = computed(() => {
      if (storiesWithPointsData.value.length === 0) return 0;
      return totalPoints.value / storiesWithPointsData.value.length;
    });
    const getTypeIcon = (type) => {
      switch (type) {
        case "story":
          return "mdi-book-open-variant";
        case "task":
          return "mdi-checkbox-marked-circle";
        case "defect":
          return "mdi-bug";
        default:
          return "mdi-circle";
      }
    };
    const getTypeColor = (type) => {
      switch (type) {
        case "story":
          return "blue";
        case "task":
          return "yellow";
        case "defect":
          return "red";
        default:
          return "grey";
      }
    };
    const getStatusColor = (status) => {
      const statusLower = status.toLowerCase();
      if (statusLower.includes("done") || statusLower.includes("closed")) {
        return "success";
      } else if (statusLower.includes("progress") || statusLower.includes("development")) {
        return "warning";
      } else if (statusLower.includes("cancel")) {
        return "error";
      } else if (statusLower.includes("todo") || statusLower.includes("new")) {
        return "info";
      }
      return "default";
    };
    const copyToClipboard = async () => {
      try {
        const headerRow = ["ID", "Parent ID", "Title", "Status", "Points", "Sprint", "Type", "URL"];
        const dataRows = filteredRows.value.map((row) => [
          row.id,
          row.parentId || "",
          row.title,
          row.status,
          row.points || "",
          row.sprint || "",
          row.type,
          row.htmlUrl
        ]);
        const allRows = [headerRow, ...dataRows];
        const tsvContent = allRows.map((row) => row.join("	")).join("\n");
        await (void 0).clipboard.writeText(tsvContent);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_spacer = resolveComponent("v-spacer");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_data_table = resolveComponent("v-data-table");
      const _component_v_pagination = resolveComponent("v-pagination");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pa-4" }, _attrs))} data-v-afa9ac3d><div class="d-flex align-center mb-4" data-v-afa9ac3d>`);
      _push(ssrRenderComponent(_component_v_icon, {
        class: "mr-2",
        size: "large"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`mdi-table`);
          } else {
            return [
              createTextVNode("mdi-table")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h2 class="text-h4" data-v-afa9ac3d>Stories &amp; Tasks</h2>`);
      _push(ssrRenderComponent(_component_v_spacer, null, null, _parent));
      _push(`<div class="d-flex align-center ga-2" data-v-afa9ac3d>`);
      if (filteredRows.value.length > 0) {
        _push(ssrRenderComponent(_component_v_chip, {
          color: "primary",
          variant: "tonal",
          size: "large",
          class: "text-subtitle-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(filteredRows.value.length)} Item${ssrInterpolate(filteredRows.value.length > 1 ? "s" : "")}`);
            } else {
              return [
                createTextVNode(toDisplayString(filteredRows.value.length) + " Item" + toDisplayString(filteredRows.value.length > 1 ? "s" : ""), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (storiesWithPoints.value > 0 && meanPointsPerStory.value > 0) {
        _push(ssrRenderComponent(_component_v_chip, {
          color: "info",
          variant: "tonal",
          size: "large",
          class: "text-subtitle-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Mean: ${ssrInterpolate(meanPointsPerStory.value.toFixed(1))} pts/story `);
            } else {
              return [
                createTextVNode(" Mean: " + toDisplayString(meanPointsPerStory.value.toFixed(1)) + " pts/story ", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (totalPoints.value > 0) {
        _push(ssrRenderComponent(_component_v_chip, {
          color: "success",
          variant: "tonal",
          size: "large",
          class: "text-subtitle-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Total: ${ssrInterpolate(totalPoints.value)} pts `);
            } else {
              return [
                createTextVNode(" Total: " + toDisplayString(totalPoints.value) + " pts ", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (tableRows.value.length > 0) {
        _push(ssrRenderComponent(_component_v_btn, {
          onClick: copyToClipboard,
          color: "primary",
          variant: "outlined",
          size: "small",
          "prepend-icon": "mdi-content-copy"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Copy to Excel `);
            } else {
              return [
                createTextVNode(" Copy to Excel ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (tableRows.value.length > 0) {
        _push(ssrRenderComponent(_component_v_card, { class: "mb-4" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_card_text, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_row, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_v_col, {
                            cols: "12",
                            md: "6"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_text_field, {
                                  modelValue: search.value,
                                  "onUpdate:modelValue": ($event) => search.value = $event,
                                  label: "Search",
                                  placeholder: "Search by ID, title, or status...",
                                  "prepend-inner-icon": "mdi-magnify",
                                  variant: "outlined",
                                  density: "compact",
                                  clearable: ""
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_text_field, {
                                    modelValue: search.value,
                                    "onUpdate:modelValue": ($event) => search.value = $event,
                                    label: "Search",
                                    placeholder: "Search by ID, title, or status...",
                                    "prepend-inner-icon": "mdi-magnify",
                                    variant: "outlined",
                                    density: "compact",
                                    clearable: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_v_col, {
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_select, {
                                  modelValue: statusFilter.value,
                                  "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                  label: "Status",
                                  items: statusOptions.value,
                                  variant: "outlined",
                                  density: "compact",
                                  clearable: ""
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_select, {
                                    modelValue: statusFilter.value,
                                    "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                    label: "Status",
                                    items: statusOptions.value,
                                    variant: "outlined",
                                    density: "compact",
                                    clearable: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_v_col, {
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_select, {
                                  modelValue: typeFilter.value,
                                  "onUpdate:modelValue": ($event) => typeFilter.value = $event,
                                  label: "Type",
                                  items: typeOptions.value,
                                  variant: "outlined",
                                  density: "compact",
                                  clearable: ""
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_select, {
                                    modelValue: typeFilter.value,
                                    "onUpdate:modelValue": ($event) => typeFilter.value = $event,
                                    label: "Type",
                                    items: typeOptions.value,
                                    variant: "outlined",
                                    density: "compact",
                                    clearable: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_v_col, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_text_field, {
                                  modelValue: search.value,
                                  "onUpdate:modelValue": ($event) => search.value = $event,
                                  label: "Search",
                                  placeholder: "Search by ID, title, or status...",
                                  "prepend-inner-icon": "mdi-magnify",
                                  variant: "outlined",
                                  density: "compact",
                                  clearable: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              md: "3"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_select, {
                                  modelValue: statusFilter.value,
                                  "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                  label: "Status",
                                  items: statusOptions.value,
                                  variant: "outlined",
                                  density: "compact",
                                  clearable: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              md: "3"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_select, {
                                  modelValue: typeFilter.value,
                                  "onUpdate:modelValue": ($event) => typeFilter.value = $event,
                                  label: "Type",
                                  items: typeOptions.value,
                                  variant: "outlined",
                                  density: "compact",
                                  clearable: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
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
                      createVNode(_component_v_row, null, {
                        default: withCtx(() => [
                          createVNode(_component_v_col, {
                            cols: "12",
                            md: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_text_field, {
                                modelValue: search.value,
                                "onUpdate:modelValue": ($event) => search.value = $event,
                                label: "Search",
                                placeholder: "Search by ID, title, or status...",
                                "prepend-inner-icon": "mdi-magnify",
                                variant: "outlined",
                                density: "compact",
                                clearable: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_col, {
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_select, {
                                modelValue: statusFilter.value,
                                "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                label: "Status",
                                items: statusOptions.value,
                                variant: "outlined",
                                density: "compact",
                                clearable: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_col, {
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_select, {
                                modelValue: typeFilter.value,
                                "onUpdate:modelValue": ($event) => typeFilter.value = $event,
                                label: "Type",
                                items: typeOptions.value,
                                variant: "outlined",
                                density: "compact",
                                clearable: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
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
                createVNode(_component_v_card_text, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_row, null, {
                      default: withCtx(() => [
                        createVNode(_component_v_col, {
                          cols: "12",
                          md: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_text_field, {
                              modelValue: search.value,
                              "onUpdate:modelValue": ($event) => search.value = $event,
                              label: "Search",
                              placeholder: "Search by ID, title, or status...",
                              "prepend-inner-icon": "mdi-magnify",
                              variant: "outlined",
                              density: "compact",
                              clearable: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_v_col, {
                          cols: "12",
                          md: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_select, {
                              modelValue: statusFilter.value,
                              "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                              label: "Status",
                              items: statusOptions.value,
                              variant: "outlined",
                              density: "compact",
                              clearable: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_v_col, {
                          cols: "12",
                          md: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_select, {
                              modelValue: typeFilter.value,
                              "onUpdate:modelValue": ($event) => typeFilter.value = $event,
                              label: "Type",
                              items: typeOptions.value,
                              variant: "outlined",
                              density: "compact",
                              clearable: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
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
      } else {
        _push(`<!---->`);
      }
      if (tableRows.value.length > 0) {
        _push(ssrRenderComponent(_component_v_card, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_data_table, {
                headers,
                items: filteredRows.value,
                loading: isLoading.value,
                "item-key": "id",
                "show-select": "",
                "disable-pagination": "",
                class: "elevation-1"
              }, {
                "item.id": withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_chip, {
                      color: getTypeColor(item.type),
                      variant: "tonal",
                      size: "small",
                      class: "font-weight-bold"
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.id)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.id), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_v_chip, {
                        color: getTypeColor(item.type),
                        variant: "tonal",
                        size: "small",
                        class: "font-weight-bold"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.id), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ];
                  }
                }),
                "item.parentId": withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.parentId) {
                      _push3(`<span class="text-caption" data-v-afa9ac3d${_scopeId2}>${ssrInterpolate(item.parentId)}</span>`);
                    } else {
                      _push3(`<span class="text-caption text-grey" data-v-afa9ac3d${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      item.parentId ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-caption"
                      }, toDisplayString(item.parentId), 1)) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-caption text-grey"
                      }, "—"))
                    ];
                  }
                }),
                "item.title": withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="d-flex align-center" data-v-afa9ac3d${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_icon, {
                      icon: getTypeIcon(item.type),
                      color: getTypeColor(item.type),
                      size: "small",
                      class: "mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(`<a${ssrRenderAttr("href", item.htmlUrl)} target="_blank" class="text-decoration-none" data-v-afa9ac3d${_scopeId2}>${ssrInterpolate(item.title)}</a></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "d-flex align-center" }, [
                        createVNode(_component_v_icon, {
                          icon: getTypeIcon(item.type),
                          color: getTypeColor(item.type),
                          size: "small",
                          class: "mr-2"
                        }, null, 8, ["icon", "color"]),
                        createVNode("a", {
                          href: item.htmlUrl,
                          target: "_blank",
                          class: "text-decoration-none",
                          onClick: withModifiers(() => {
                          }, ["stop"])
                        }, toDisplayString(item.title), 9, ["href", "onClick"])
                      ])
                    ];
                  }
                }),
                "item.status": withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_chip, {
                      color: getStatusColor(item.status),
                      variant: "tonal",
                      size: "small"
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.status)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.status), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_v_chip, {
                        color: getStatusColor(item.status),
                        variant: "tonal",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.status), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ];
                  }
                }),
                "item.points": withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.points !== null) {
                      _push3(`<span class="font-weight-bold" data-v-afa9ac3d${_scopeId2}>${ssrInterpolate(item.points)}</span>`);
                    } else {
                      _push3(`<span class="text-grey" data-v-afa9ac3d${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      item.points !== null ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "font-weight-bold"
                      }, toDisplayString(item.points), 1)) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-grey"
                      }, "—"))
                    ];
                  }
                }),
                "item.sprint": withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.sprint) {
                      _push3(ssrRenderComponent(_component_v_chip, {
                        color: "info",
                        variant: "outlined",
                        size: "small"
                      }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(item.sprint)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(item.sprint), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span class="text-grey" data-v-afa9ac3d${_scopeId2}>—</span>`);
                    }
                  } else {
                    return [
                      item.sprint ? (openBlock(), createBlock(_component_v_chip, {
                        key: 0,
                        color: "info",
                        variant: "outlined",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.sprint), 1)
                        ]),
                        _: 2
                      }, 1024)) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-grey"
                      }, "—"))
                    ];
                  }
                }),
                bottom: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="text-center pa-2" data-v-afa9ac3d${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_pagination, {
                      modelValue: page.value,
                      "onUpdate:modelValue": ($event) => page.value = $event,
                      length: Math.ceil(filteredRows.value.length / itemsPerPage.value),
                      "total-visible": 7
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "text-center pa-2" }, [
                        createVNode(_component_v_pagination, {
                          modelValue: page.value,
                          "onUpdate:modelValue": ($event) => page.value = $event,
                          length: Math.ceil(filteredRows.value.length / itemsPerPage.value),
                          "total-visible": 7
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "length"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_v_data_table, {
                  headers,
                  items: filteredRows.value,
                  loading: isLoading.value,
                  "item-key": "id",
                  "show-select": "",
                  "disable-pagination": "",
                  class: "elevation-1"
                }, {
                  "item.id": withCtx(({ item }) => [
                    createVNode(_component_v_chip, {
                      color: getTypeColor(item.type),
                      variant: "tonal",
                      size: "small",
                      class: "font-weight-bold"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.id), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ]),
                  "item.parentId": withCtx(({ item }) => [
                    item.parentId ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-caption"
                    }, toDisplayString(item.parentId), 1)) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "text-caption text-grey"
                    }, "—"))
                  ]),
                  "item.title": withCtx(({ item }) => [
                    createVNode("div", { class: "d-flex align-center" }, [
                      createVNode(_component_v_icon, {
                        icon: getTypeIcon(item.type),
                        color: getTypeColor(item.type),
                        size: "small",
                        class: "mr-2"
                      }, null, 8, ["icon", "color"]),
                      createVNode("a", {
                        href: item.htmlUrl,
                        target: "_blank",
                        class: "text-decoration-none",
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }, toDisplayString(item.title), 9, ["href", "onClick"])
                    ])
                  ]),
                  "item.status": withCtx(({ item }) => [
                    createVNode(_component_v_chip, {
                      color: getStatusColor(item.status),
                      variant: "tonal",
                      size: "small"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.status), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ]),
                  "item.points": withCtx(({ item }) => [
                    item.points !== null ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "font-weight-bold"
                    }, toDisplayString(item.points), 1)) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "text-grey"
                    }, "—"))
                  ]),
                  "item.sprint": withCtx(({ item }) => [
                    item.sprint ? (openBlock(), createBlock(_component_v_chip, {
                      key: 0,
                      color: "info",
                      variant: "outlined",
                      size: "small"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.sprint), 1)
                      ]),
                      _: 2
                    }, 1024)) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "text-grey"
                    }, "—"))
                  ]),
                  bottom: withCtx(() => [
                    createVNode("div", { class: "text-center pa-2" }, [
                      createVNode(_component_v_pagination, {
                        modelValue: page.value,
                        "onUpdate:modelValue": ($event) => page.value = $event,
                        length: Math.ceil(filteredRows.value.length / itemsPerPage.value),
                        "total-visible": 7
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "length"])
                    ])
                  ]),
                  _: 1
                }, 8, ["items", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (isLoading.value) {
        _push(ssrRenderComponent(_component_v_card, { class: "text-center pa-12" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_progress_circular, {
                indeterminate: "",
                color: "primary",
                size: "64"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-h6 mt-4" data-v-afa9ac3d${_scopeId}>Loading stories and tasks...</p>`);
            } else {
              return [
                createVNode(_component_v_progress_circular, {
                  indeterminate: "",
                  color: "primary",
                  size: "64"
                }),
                createVNode("p", { class: "text-h6 mt-4" }, "Loading stories and tasks...")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_v_card, { class: "text-center pa-12" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_icon, {
                size: "64",
                color: "grey-lighten-2"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`mdi-table-off`);
                  } else {
                    return [
                      createTextVNode("mdi-table-off")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<p class="text-h6 mt-4" data-v-afa9ac3d${_scopeId}>No stories or tasks found</p><p class="text-body-1" data-v-afa9ac3d${_scopeId}> Load some epics from the sidebar to see their stories and tasks here. </p>`);
            } else {
              return [
                createVNode(_component_v_icon, {
                  size: "64",
                  color: "grey-lighten-2"
                }, {
                  default: withCtx(() => [
                    createTextVNode("mdi-table-off")
                  ]),
                  _: 1
                }),
                createVNode("p", { class: "text-h6 mt-4" }, "No stories or tasks found"),
                createVNode("p", { class: "text-body-1" }, " Load some epics from the sidebar to see their stories and tasks here. ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/stories-table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const storiesTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-afa9ac3d"]]);

export { storiesTable as default };
//# sourceMappingURL=stories-table-D3wr0EIb.mjs.map
