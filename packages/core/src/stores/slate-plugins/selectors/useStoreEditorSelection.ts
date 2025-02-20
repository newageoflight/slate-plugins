import { useCallback } from 'react';
import { useSlatePluginsStore } from '../slate-plugins.store';
import { getSlatePluginsState } from './getSlatePluginsState';

/**
 * Get the editor selection which is updated on editor change.
 */
export const useStoreEditorSelection = (id?: string | null) =>
  useSlatePluginsStore(
    useCallback((state) => getSlatePluginsState(state, id)?.selection, [id])
  );
