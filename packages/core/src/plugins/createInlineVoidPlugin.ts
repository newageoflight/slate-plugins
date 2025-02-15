import castArray from 'lodash/castArray';
import { SlatePlugin } from '../types/SlatePlugin/SlatePlugin';
import { WithOverride } from '../types/SlatePlugin/WithOverride';
import { SPEditor } from '../types/SPEditor';
import { TElement } from '../types/TElement';
import { getSlatePluginWithOverrides } from '../utils/getSlatePluginWithOverrides';

export interface WithInlineVoidOptions<T extends SPEditor = SPEditor> {
  plugins?: SlatePlugin<T>[];
  inlineTypes?: string[];
  voidTypes?: string[];
}

/**
 * Merge and register all the inline types and void types from the plugins and options,
 * using `editor.isInline` and `editor.isVoid`
 */
export const withInlineVoid = <T extends SPEditor = SPEditor>({
  plugins = [],
  inlineTypes = [],
  voidTypes = [],
}: WithInlineVoidOptions<T>): WithOverride<T> => (editor) => {
  const { isInline } = editor;
  const { isVoid } = editor;

  let allInlineTypes = [...inlineTypes];
  let allVoidTypes = [...voidTypes];

  plugins.forEach((plugin) => {
    if (plugin.inlineTypes) {
      allInlineTypes = allInlineTypes.concat(
        castArray(plugin.inlineTypes(editor))
      );
    }

    if (plugin.voidTypes) {
      allVoidTypes = allVoidTypes.concat(castArray(plugin.voidTypes(editor)));
    }
  });

  editor.isInline = (element) => {
    return allInlineTypes.includes((element as TElement).type)
      ? true
      : isInline(element);
  };

  editor.isVoid = (element) =>
    allVoidTypes.includes((element as TElement).type) ? true : isVoid(element);

  return editor;
};

/**
 * @see {@link withInlineVoid}
 */
export const createInlineVoidPlugin = getSlatePluginWithOverrides(
  withInlineVoid
);
