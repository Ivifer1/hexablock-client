# Test cases — Inicio

These cases extend the behavior in `spec.md`.
Test names must use the `should_<expected>_when_<condition>` convention.

| Spec element | Test name | Level |
| --- | --- | --- |
| All registered modes render | `should_render_all_registered_modes_when_home_loads` | UI |
| Fifth descriptor is extensible | `should_render_added_fifth_mode_when_descriptor_is_registered` | UI |
| Direct entry | `should_emit_direct_entry_when_lines_or_merge_is_selected` | UI / presenter |
| Level entry | `should_emit_levels_entry_when_fit_or_sort_is_selected` | UI / presenter |
| Loading progress | `should_render_progress_placeholder_when_progress_is_loading` | UI |
| Progress failure | `should_render_without_progress_when_progress_read_fails` | UI |
| Empty registry | `should_render_empty_state_when_no_modes_are_registered` | UI |
| 360 px Spanish layout | `should_remain_readable_when_viewport_is_360_px_in_spanish` | UI |
| 360 px English layout | `should_remain_readable_when_viewport_is_360_px_in_english` | UI |
| Initial selection | `should_select_lines_when_home_opens_for_the_first_time` | UI |
| Restored selection | `should_restore_last_selected_mode_when_home_reopens` | UI |
| Central preview | `should_load_preview_resource_when_selected_mode_changes` | UI |
| Tap selection | `should_rotate_selector_and_update_preview_when_mode_is_tapped` | UI |
| Gesture rotation | `should_select_variant_and_update_preview_when_selector_is_rotated` | UI |
| Session indicator | `should_open_login_when_session_indicator_is_tapped_without_session` | UI |
| Ranking access | `should_open_ranking_when_session_indicator_is_tapped_with_session` | UI |
