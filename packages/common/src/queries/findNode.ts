import { TEditor, TNode } from '@udecode/slate-plugins-core';
import { Editor, Location, Node, NodeEntry, Path, Range, Span } from 'slate';
import { MatchOptions } from '../types/Editor.types';
import { match } from './match';

export type FindNodeOptions<T extends TNode = TNode> = {
  at?: Location | Span;
  reverse?: boolean;
  voids?: boolean;
} & MatchOptions<T>;

/**
 * Find node matching the condition.
 */
export const findNode = <T extends TNode = TNode>(
  editor: TEditor,
  options: FindNodeOptions<T>
): NodeEntry<T> | undefined => {
  // Slate throws when things aren't found so we wrap in a try catch and return undefined on throw.
  try {
    const {
      match: _match = () => true,
      at = editor.selection || [],
      reverse = false,
      voids = false,
    } = options;

    let from;
    let to;
    if (Span.isSpan(at)) {
      [from, to] = at;
    } else if (Range.isRange(at)) {
      const first = Editor.path(editor, at, { edge: 'start' });
      const last = Editor.path(editor, at, { edge: 'end' });
      from = reverse ? last : first;
      to = reverse ? first : last;
    }

    let root: NodeEntry = [editor, []];
    if (Path.isPath(at)) {
      root = Editor.node(editor, at);
    }

    const nodeEntries = Node.nodes(root[0], {
      reverse,
      from,
      to,
      pass: ([n]) => (voids ? false : Editor.isVoid(editor, n)),
    });

    for (const [node, path] of nodeEntries) {
      if (match<Node>(node, _match)) {
        return [node as any, path];
      }
    }
  } catch (error) {
    return undefined;
  }
};
